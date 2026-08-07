using MySqlConnector;
using System.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [])
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("Frontend");

var api = app.MapGroup("/api");

api.MapGet("/", (HttpContext http) => Ok(http, new
{
    name = "Basketball Camp API",
    health = "/api/health",
    openApi = "/openapi/v1.json",
    frontend = "http://127.0.0.1:5175/sign-in",
}));

api.MapGet("/health", (HttpContext http) => Ok(http, new
{
    service = "Basketball Camp API",
    status = "ok",
    database = "basketball_camp",
    timestamp = DateTimeOffset.UtcNow,
}));

api.MapPost("/auth/login", async (LoginRequest request, IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
    {
        return Fail(http, "Email and password are required.", StatusCodes.Status400BadRequest);
    }

    await using var conn = await Open(config, ct);
    const string sql = """
        SELECT u.id, u.email, u.full_name, u.phone, r.code role
        FROM users u
        JOIN user_roles ur ON ur.user_id = u.id
        JOIN roles r ON r.id = ur.role_id
        WHERE u.email = @email AND u.status = 'Active'
        LIMIT 1;
        """;
    var user = await Single(conn, sql, row =>
    {
        var role = S(row, "role");
        return new
        {
            id = L(row, "id"),
            email = S(row, "email"),
            name = S(row, "full_name"),
            phone = S(row, "phone"),
            role,
            roleLabel = RoleLabel(role),
            homeRoute = HomeRoute(role),
        };
    }, P("@email", request.Email.Trim().ToLowerInvariant()), ct);

    if (user is null)
    {
        return Fail(http, "Invalid email or password.", StatusCodes.Status401Unauthorized);
    }

    await Exec(conn, "UPDATE users SET last_login_at = NOW() WHERE id = @id", P("@id", user.id), ct);
    return Ok(http, new { token = $"dev-{user.id}-{user.role}", user });
});

api.MapPost("/auth/register", async (RegisterRequest request, IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Name))
    {
        return Fail(http, "Name and email are required.", StatusCodes.Status400BadRequest);
    }

    await using var conn = await Open(config, ct);
    var existing = await Scalar<long?>(conn, "SELECT id FROM users WHERE email = @email", P("@email", request.Email.Trim().ToLowerInvariant()), ct);
    if (existing is not null)
    {
        return Fail(http, "This email is already registered.", StatusCodes.Status409Conflict);
    }

    var userId = await Insert(conn, """
        INSERT INTO users (organization_id, email, password_hash, full_name, phone, status)
        VALUES (1, @email, 'dev-password', @name, @phone, 'Active');
        SELECT LAST_INSERT_ID();
        """,
        Params(P("@email", request.Email.Trim().ToLowerInvariant()), P("@name", request.Name.Trim()), P("@phone", request.Phone ?? "")), ct);

    await Exec(conn, "INSERT INTO user_roles (user_id, role_id) VALUES (@userId, 1)", P("@userId", userId), ct);
    await Exec(conn, """
        INSERT INTO students (organization_id, user_id, student_code, full_name, age_group, emergency_contact, status)
        VALUES (1, @userId, CONCAT('STU', LPAD(@userId, 4, '0')), @name, 'U12', @phone, 'Active')
        """, Params(P("@userId", userId), P("@name", request.Name.Trim()), P("@phone", request.Phone ?? "")), ct);

    var user = new { id = userId, email = request.Email.Trim().ToLowerInvariant(), name = request.Name.Trim(), phone = request.Phone, role = "student", roleLabel = RoleLabel("student"), homeRoute = HomeRoute("student") };
    return Ok(http, new { token = $"dev-{user.id}-student", user }, "Account created.");
});

api.MapPost("/auth/forgot-password", (ForgotPasswordRequest request, HttpContext http) =>
    Ok(http, new { email = request.Email, sent = true }, "Password reset instructions have been prepared for this development environment."));

api.MapGet("/auth/me", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    var auth = GetAuth(http);
    if (auth is null) return Fail(http, "Authentication required.", StatusCodes.Status401Unauthorized);

    await using var conn = await Open(config, ct);
    var user = await GetUser(conn, auth.UserId, ct);
    return user is null ? Fail(http, "User not found.", StatusCodes.Status404NotFound) : Ok(http, user);
});

api.MapGet("/student/dashboard", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    var studentId = await StudentId(conn, GetAuth(http)?.UserId, ct);
    var metrics = new[]
    {
        new Metric("Active Courses", await Count(conn, "SELECT COUNT(*) FROM enrollments WHERE student_id=@id AND status IN ('Paid','Active','Confirmed')", studentId, ct), "Confirmed enrollments", "BookOpen"),
        new Metric("Training Tasks", await Count(conn, "SELECT COUNT(*) FROM training_task_assignments WHERE student_id=@id", studentId, ct), "Assigned homework", "ClipboardList"),
        new Metric("Uploaded Videos", await Count(conn, "SELECT COUNT(*) FROM video_uploads WHERE student_id=@id", studentId, ct), "Video evidence", "Video"),
        new Metric("Published Reports", await Count(conn, "SELECT COUNT(*) FROM feedback_reports WHERE student_id=@id AND coach_status='Published'", studentId, ct), "Coach feedback", "FileCheck"),
    };
    var tasks = await StudentTasks(conn, studentId, ct);
    var reports = await StudentReports(conn, studentId, ct);
    var schedule = await StudentSchedule(conn, studentId, ct);
    return Ok(http, new { metrics, activeTasks = tasks.Take(4), latestReports = reports.Take(4), nextClass = schedule.FirstOrDefault() });
});

api.MapGet("/student/courses", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    var rows = await Query(conn, """
        SELECT c.id, c.name, c.level, c.age_group ageGroup, c.price, c.capacity, c.status,
               COALESCE(cl.schedule_text, 'Schedule pending') schedule,
               COALESCE(u.full_name, 'Coach TBD') coach
        FROM courses c
        LEFT JOIN classes cl ON cl.course_id = c.id
        LEFT JOIN coaches co ON co.id = cl.coach_id
        LEFT JOIN users u ON u.id = co.user_id
        GROUP BY c.id, c.name, c.level, c.age_group, c.price, c.capacity, c.status, cl.schedule_text, u.full_name
        ORDER BY c.name;
        """, row => new
        {
            id = L(row, "id"),
            name = S(row, "name"),
            level = S(row, "level"),
            ageGroup = S(row, "ageGroup"),
            price = $"${D(row, "price"):0.00}",
            capacity = $"{L(row, "capacity")} seats",
            status = S(row, "status"),
            schedule = S(row, "schedule"),
            coach = S(row, "coach"),
        }, ct);
    return Ok(http, rows);
});

api.MapGet("/student/schedule", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await StudentSchedule(conn, await StudentId(conn, GetAuth(http)?.UserId, ct), ct));
});

api.MapGet("/student/training-tasks", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await StudentTasks(conn, await StudentId(conn, GetAuth(http)?.UserId, ct), ct));
});

api.MapGet("/student/feedback-reports", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await StudentReports(conn, await StudentId(conn, GetAuth(http)?.UserId, ct), ct));
});

api.MapGet("/student/growth-trends", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    var studentId = await StudentId(conn, GetAuth(http)?.UserId, ct);
    var rows = await Query(conn, """
        SELECT metric_name metric, metric_value value, metric_unit unit, trend_text trend, recorded_date recordedDate
        FROM growth_metric_records
        WHERE student_id = @id
        ORDER BY recorded_date;
        """, row => new { metric = S(row, "metric"), value = D(row, "value"), unit = S(row, "unit"), trend = S(row, "trend"), recordedDate = Date(row, "recordedDate") }, P("@id", studentId), ct);
    return Ok(http, rows);
});

api.MapGet("/student/profile", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    var userId = GetAuth(http)?.UserId ?? 1;
    var profile = await Single(conn, """
        SELECT u.id, u.email, u.full_name name, u.phone, s.student_code studentCode, s.age_group ageGroup,
               s.emergency_contact emergencyContact, s.video_consent_status videoConsentStatus
        FROM users u
        LEFT JOIN students s ON s.user_id = u.id
        WHERE u.id = @id
        """, row => new { id = L(row, "id"), email = S(row, "email"), name = S(row, "name"), phone = S(row, "phone"), studentCode = S(row, "studentCode"), ageGroup = S(row, "ageGroup"), emergencyContact = S(row, "emergencyContact"), videoConsentStatus = S(row, "videoConsentStatus") }, P("@id", userId), ct);
    return Ok(http, profile);
});

api.MapGet("/coach/dashboard", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    var coachId = await CoachId(conn, GetAuth(http)?.UserId, ct);
    var metrics = new[]
    {
        new Metric("Today Classes", await Count(conn, "SELECT COUNT(*) FROM class_sessions WHERE coach_id=@id", coachId, ct), "Scheduled sessions", "CalendarDays"),
        new Metric("Students", await Count(conn, "SELECT COUNT(DISTINCT cs.student_id) FROM class_students cs JOIN classes c ON c.id=cs.class_id WHERE c.coach_id=@id", coachId, ct), "Assigned roster", "Users"),
        new Metric("Videos To Review", await Count(conn, "SELECT COUNT(*) FROM video_uploads WHERE upload_status <> 'Failed'", coachId, ct), "Uploaded homework", "Video"),
        new Metric("AI Drafts", await Count(conn, "SELECT COUNT(*) FROM ai_analysis_reports WHERE status='AI Draft'", coachId, ct), "Need review", "ShieldCheck"),
    };
    return Ok(http, new { metrics, reviewQueue = await VideoQueue(conn, ct), todayClasses = await CoachClasses(conn, coachId, ct) });
});

api.MapGet("/coach/classes/today", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await CoachClasses(conn, await CoachId(conn, GetAuth(http)?.UserId, ct), ct));
});

api.MapGet("/classes/{classId:long}/roster", async (long classId, IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await Roster(conn, classId, ct));
});

api.MapGet("/classes/{classId:long}/attendance", async (long classId, IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await Roster(conn, classId, ct));
});

api.MapPost("/classes/{classId:long}/attendance", async (long classId, AttendanceSaveRequest request, IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    var sessionId = await Scalar<long?>(conn, "SELECT id FROM class_sessions WHERE class_id=@classId ORDER BY session_date DESC LIMIT 1", P("@classId", classId), ct) ?? 1;
    var coachId = await CoachId(conn, GetAuth(http)?.UserId, ct);
    foreach (var item in request.Records)
    {
        await Exec(conn, "INSERT INTO attendance_records (class_session_id, student_id, status, note, checked_by) VALUES (@sessionId,@studentId,@status,@note,@coachId)", Params(P("@sessionId", sessionId), P("@studentId", item.StudentId), P("@status", item.Status), P("@note", item.Note ?? ""), P("@coachId", coachId)), ct);
    }
    return Ok(http, new { saved = request.Records.Count });
});

api.MapGet("/coach/profile", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    var userId = GetAuth(http)?.UserId ?? 3;
    var profile = await Single(conn, """
        SELECT u.id, u.email, u.full_name name, u.phone, c.coach_code coachCode, c.specialties, c.available_courts availableCourts, c.status
        FROM users u JOIN coaches c ON c.user_id = u.id
        WHERE u.id = @id
        """, row => new { id = L(row, "id"), email = S(row, "email"), name = S(row, "name"), phone = S(row, "phone"), coachCode = S(row, "coachCode"), specialties = S(row, "specialties"), availableCourts = S(row, "availableCourts"), status = S(row, "status") }, P("@id", userId), ct);
    return Ok(http, profile);
});

api.MapGet("/training-task-templates", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await Query(conn, "SELECT id, title, drill_type drillType, default_requirement requirement, status FROM training_task_templates ORDER BY id", row => new { id = L(row, "id"), title = S(row, "title"), drillType = S(row, "drillType"), requirement = S(row, "requirement"), status = S(row, "status") }, ct));
});

api.MapPost("/training-tasks/assign", async (AssignTaskRequest request, IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    var coachId = await CoachId(conn, GetAuth(http)?.UserId, ct);
    var taskId = await Insert(conn, """
        INSERT INTO training_tasks (organization_id, template_id, class_id, assigned_by, title, requirement, instruction, due_date, status)
        VALUES (1, @templateId, @classId, @coachId, @title, @requirement, @instruction, @dueDate, 'Assigned');
        SELECT LAST_INSERT_ID();
        """, Params(P("@templateId", request.TemplateId), P("@classId", request.ClassId), P("@coachId", coachId), P("@title", request.Title), P("@requirement", request.Requirement), P("@instruction", request.Instruction ?? ""), P("@dueDate", request.DueDate)), ct);
    var studentIds = await Query(conn, "SELECT student_id id FROM class_students WHERE class_id=@classId", row => L(row, "id"), P("@classId", request.ClassId), ct);
    foreach (var studentId in studentIds)
    {
        await Exec(conn, "INSERT INTO training_task_assignments (training_task_id, student_id) VALUES (@taskId,@studentId)", Params(P("@taskId", taskId), P("@studentId", studentId)), ct);
    }
    return Ok(http, new { taskId, assignedStudents = studentIds.Count }, "Training task assigned.");
});

api.MapGet("/videos/review-queue", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await VideoQueue(conn, ct));
});

api.MapGet("/videos/{id:long}", async (long id, IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    var video = await Single(conn, """
        SELECT v.id, v.video_code videoCode, s.full_name student, v.drill_title drill, v.file_url fileUrl,
               v.thumbnail_url thumbnailUrl, v.upload_status uploadStatus, v.duration_seconds durationSeconds,
               COALESCE(j.status, 'Waiting') aiStatus
        FROM video_uploads v
        JOIN students s ON s.id = v.student_id
        LEFT JOIN ai_analysis_jobs j ON j.video_id = v.id
        WHERE v.id = @id
        """, row => new { id = L(row, "id"), videoCode = S(row, "videoCode"), student = S(row, "student"), drill = S(row, "drill"), fileUrl = S(row, "fileUrl"), thumbnailUrl = S(row, "thumbnailUrl"), uploadStatus = S(row, "uploadStatus"), aiStatus = S(row, "aiStatus"), durationSeconds = L(row, "durationSeconds") }, P("@id", id), ct);
    return video is null ? Fail(http, "Video not found.", StatusCodes.Status404NotFound) : Ok(http, video);
});

api.MapPost("/videos/upload-url", (UploadUrlRequest request, HttpContext http) =>
    Ok(http, new { uploadUrl = "https://storage.local/dev-upload", fileUrl = $"https://cdn.local/videos/{Guid.NewGuid():N}-{request.FileName}", expiresInSeconds = 900 }));

api.MapPost("/videos", async (VideoCreateRequest request, IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    var studentId = await StudentId(conn, GetAuth(http)?.UserId, ct);
    var id = await Insert(conn, """
        INSERT INTO video_uploads (video_code, task_assignment_id, student_id, uploaded_by, drill_title, file_url, upload_status, duration_seconds)
        VALUES (CONCAT('VID', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')), @assignmentId, @studentId, @userId, @drill, @fileUrl, 'Uploaded', @duration);
        SELECT LAST_INSERT_ID();
        """, Params(P("@assignmentId", request.TaskAssignmentId), P("@studentId", studentId), P("@userId", GetAuth(http)?.UserId ?? 1), P("@drill", request.DrillTitle), P("@fileUrl", request.FileUrl ?? ""), P("@duration", request.DurationSeconds)), ct);
    await Exec(conn, "INSERT INTO ai_analysis_jobs (video_id, engine, status) VALUES (@id, 'MMPose', 'Waiting')", P("@id", id), ct);
    return Ok(http, new { id, uploadStatus = "Uploaded", aiStatus = "Waiting" }, "Video record created.");
});

api.MapGet("/videos/{id:long}/status", async (long id, IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    var status = await Single(conn, "SELECT v.upload_status uploadStatus, COALESCE(j.status,'Waiting') aiStatus FROM video_uploads v LEFT JOIN ai_analysis_jobs j ON j.video_id=v.id WHERE v.id=@id", row => new { uploadStatus = S(row, "uploadStatus"), aiStatus = S(row, "aiStatus") }, P("@id", id), ct);
    return Ok(http, status);
});

api.MapGet("/videos/{id:long}/annotations", async (long id, IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await Query(conn, "SELECT id, timestamp_seconds timestampSeconds, marker_type markerType, guidance FROM coach_annotations WHERE video_id=@id ORDER BY timestamp_seconds", row => new { id = L(row, "id"), timestampSeconds = L(row, "timestampSeconds"), markerType = S(row, "markerType"), guidance = S(row, "guidance") }, P("@id", id), ct));
});

api.MapPost("/videos/{id:long}/annotations", async (long id, AnnotationRequest request, IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    var annotationId = await Insert(conn, "INSERT INTO coach_annotations (video_id, coach_id, timestamp_seconds, marker_type, guidance) VALUES (@videoId,@coachId,@seconds,@type,@guidance); SELECT LAST_INSERT_ID();", Params(P("@videoId", id), P("@coachId", await CoachId(conn, GetAuth(http)?.UserId, ct)), P("@seconds", request.TimestampSeconds), P("@type", request.MarkerType), P("@guidance", request.Guidance)), ct);
    return Ok(http, new { id = annotationId }, "Annotation saved.");
});

api.MapGet("/analysis-reports/{id:long}", async (long id, IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await AnalysisReport(conn, id, ct));
});

api.MapGet("/reports/{id:long}/review-draft", async (long id, IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await AnalysisReport(conn, id, ct));
});

api.MapPut("/reports/{id:long}/review", async (long id, ReviewReportRequest request, IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    await Exec(conn, "UPDATE ai_analysis_reports SET summary=@summary, status='Coach Reviewed' WHERE id=@id", Params(P("@summary", request.Summary), P("@id", id)), ct);
    return Ok(http, new { id, status = "Coach Reviewed" });
});

api.MapPost("/reports/{id:long}/publish", async (long id, PublishReportRequest request, IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    await Exec(conn, "UPDATE feedback_reports SET final_note=@note, coach_status='Published', family_status='Visible', published_at=NOW() WHERE ai_report_id=@id", Params(P("@note", request.FinalNote), P("@id", id)), ct);
    return Ok(http, new { id, status = "Published" }, "Report published.");
});

api.MapGet("/coach/reports/published", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await AllReports(conn, "Published", ct));
});

api.MapGet("/admin/dashboard", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    var metrics = new[]
    {
        new Metric("Students", await Count(conn, "SELECT COUNT(*) FROM students", 0, ct), "Active learners", "Users"),
        new Metric("Courses", await Count(conn, "SELECT COUNT(*) FROM courses", 0, ct), "Programs", "BookOpen"),
        new Metric("Enrollments", await Count(conn, "SELECT COUNT(*) FROM enrollments", 0, ct), "Orders pipeline", "CreditCard"),
        new Metric("AI Queue", await Count(conn, "SELECT COUNT(*) FROM ai_analysis_jobs", 0, ct), "Video jobs", "Activity"),
    };
    return Ok(http, new { metrics, enrollments = await Enrollments(conn, ct), videoQueue = await VideoQueue(conn, ct) });
});

api.MapGet("/admin/courses", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await CoursesAdmin(conn, ct));
});

api.MapGet("/admin/classes", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await Query(conn, """
        SELECT cl.id, cl.class_code classCode, cl.name, c.name course, u.full_name coach, cl.schedule_text schedule, cl.capacity, cl.status
        FROM classes cl JOIN courses c ON c.id=cl.course_id JOIN coaches co ON co.id=cl.coach_id JOIN users u ON u.id=co.user_id
        ORDER BY cl.id;
        """, row => new { id = L(row, "id"), classCode = S(row, "classCode"), name = S(row, "name"), course = S(row, "course"), coach = S(row, "coach"), schedule = S(row, "schedule"), capacity = L(row, "capacity"), status = S(row, "status") }, ct));
});

api.MapGet("/admin/students", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await Students(conn, ct));
});

api.MapGet("/admin/coaches", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await Query(conn, "SELECT c.id, c.coach_code coachCode, u.full_name name, u.email, c.specialties, c.available_courts availableCourts, c.status FROM coaches c JOIN users u ON u.id=c.user_id ORDER BY c.id", row => new { id = L(row, "id"), coachCode = S(row, "coachCode"), name = S(row, "name"), email = S(row, "email"), specialties = S(row, "specialties"), availableCourts = S(row, "availableCourts"), status = S(row, "status") }, ct));
});

api.MapGet("/admin/enrollments", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await Enrollments(conn, ct));
});

api.MapGet("/admin/training-tasks", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await Query(conn, """
        SELECT t.id, t.title, c.name className, u.full_name coach, t.requirement, t.due_date dueDate, t.status
        FROM training_tasks t JOIN classes c ON c.id=t.class_id JOIN coaches co ON co.id=t.assigned_by JOIN users u ON u.id=co.user_id
        ORDER BY t.due_date DESC;
        """, row => new { id = L(row, "id"), title = S(row, "title"), className = S(row, "className"), coach = S(row, "coach"), requirement = S(row, "requirement"), dueDate = Date(row, "dueDate"), status = S(row, "status") }, ct));
});

api.MapGet("/admin/video-ai-queue", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await VideoQueue(conn, ct));
});

api.MapGet("/admin/reports", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await AllReports(conn, "", ct));
});

api.MapGet("/admin/permissions", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await Query(conn, "SELECT r.code role, p.code permission, p.name FROM role_permissions rp JOIN roles r ON r.id=rp.role_id JOIN permissions p ON p.id=rp.permission_id ORDER BY r.code, p.code", row => new { role = S(row, "role"), permission = S(row, "permission"), name = S(row, "name") }, ct));
});

api.MapGet("/admin/settings", async (IConfiguration config, HttpContext http, CancellationToken ct) =>
{
    await using var conn = await Open(config, ct);
    return Ok(http, await Query(conn, "SELECT id, setting_key settingKey, setting_value settingValue FROM system_settings ORDER BY setting_key", row => new { id = L(row, "id"), settingKey = S(row, "settingKey"), settingValue = S(row, "settingValue") }, ct));
});

app.Run();

static async Task<MySqlConnection> Open(IConfiguration config, CancellationToken ct)
{
    var conn = new MySqlConnection(config.GetConnectionString("DefaultConnection"));
    await conn.OpenAsync(ct);
    return conn;
}

static IResult Ok<T>(HttpContext http, T data, string message = "OK") => Results.Ok(new ApiResponse<T>(true, message, data, http.TraceIdentifier));
static IResult Fail(HttpContext http, string message, int statusCode) => Results.Json(new ApiResponse<object>(false, message, null, http.TraceIdentifier), statusCode: statusCode);
static MySqlParameter P(string name, object? value) => new(name, value ?? DBNull.Value);
static MySqlParameter[] Params(params MySqlParameter[] parameters) => parameters;

static async Task<System.Collections.Generic.List<T>> Query<T>(MySqlConnection conn, string sql, Func<IDataRecord, T> map, object parametersOrToken, CancellationToken ct = default)
{
    var parameters = NormalizeParameters(parametersOrToken, ref ct);
    await using var cmd = new MySqlCommand(sql, conn);
    foreach (var parameter in parameters) cmd.Parameters.Add(parameter);
    await using var reader = await cmd.ExecuteReaderAsync(ct);
    var rows = new System.Collections.Generic.List<T>();
    while (await reader.ReadAsync(ct)) rows.Add(map(reader));
    return rows;
}

static async Task<T?> Single<T>(MySqlConnection conn, string sql, Func<IDataRecord, T> map, MySqlParameter parameter, CancellationToken ct)
{
    var rows = await Query(conn, sql, map, parameter, ct);
    return rows.FirstOrDefault();
}

static async Task<long?> Scalar<TIgnored>(MySqlConnection conn, string sql, MySqlParameter parameter, CancellationToken ct)
{
    await using var cmd = new MySqlCommand(sql, conn);
    cmd.Parameters.Add(parameter);
    var value = await cmd.ExecuteScalarAsync(ct);
    return value is null or DBNull ? null : Convert.ToInt64(value);
}

static async Task<long> Insert(MySqlConnection conn, string sql, IReadOnlyCollection<MySqlParameter> parameters, CancellationToken ct)
{
    await using var cmd = new MySqlCommand(sql, conn);
    foreach (var parameter in parameters) cmd.Parameters.Add(parameter);
    return Convert.ToInt64(await cmd.ExecuteScalarAsync(ct));
}

static async Task Exec(MySqlConnection conn, string sql, object parametersOrToken, CancellationToken ct = default)
{
    var parameters = NormalizeParameters(parametersOrToken, ref ct);
    await using var cmd = new MySqlCommand(sql, conn);
    foreach (var parameter in parameters) cmd.Parameters.Add(parameter);
    await cmd.ExecuteNonQueryAsync(ct);
}

static IReadOnlyCollection<MySqlParameter> NormalizeParameters(object parametersOrToken, ref CancellationToken ct)
{
    if (parametersOrToken is CancellationToken token)
    {
        ct = token;
        return Array.Empty<MySqlParameter>();
    }

    if (parametersOrToken is MySqlParameter parameter)
    {
        return Params(parameter);
    }

    return parametersOrToken as IReadOnlyCollection<MySqlParameter> ?? Array.Empty<MySqlParameter>();
}

static async Task<int> Count(MySqlConnection conn, string sql, long id, CancellationToken ct)
{
    await using var cmd = new MySqlCommand(sql, conn);
    if (sql.Contains("@id", StringComparison.OrdinalIgnoreCase)) cmd.Parameters.AddWithValue("@id", id);
    return Convert.ToInt32(await cmd.ExecuteScalarAsync(ct));
}

static AuthInfo? GetAuth(HttpContext http)
{
    var header = http.Request.Headers.Authorization.ToString();
    if (!header.StartsWith("Bearer dev-", StringComparison.OrdinalIgnoreCase)) return null;
    var parts = header["Bearer dev-".Length..].Split('-', StringSplitOptions.RemoveEmptyEntries);
    return parts.Length >= 2 && long.TryParse(parts[0], out var userId) ? new AuthInfo(userId, parts[1]) : null;
}

static async Task<object?> GetUser(MySqlConnection conn, long id, CancellationToken ct) => await Single(conn, """
    SELECT u.id, u.email, u.full_name name, u.phone, r.code role
    FROM users u JOIN user_roles ur ON ur.user_id=u.id JOIN roles r ON r.id=ur.role_id
    WHERE u.id=@id
    """, row =>
    {
        var role = S(row, "role");
        return new { id = L(row, "id"), email = S(row, "email"), name = S(row, "name"), phone = S(row, "phone"), role, roleLabel = RoleLabel(role), homeRoute = HomeRoute(role) };
    }, P("@id", id), ct);

static async Task<long> StudentId(MySqlConnection conn, long? userId, CancellationToken ct) =>
    await Scalar<long>(conn, "SELECT id FROM students WHERE user_id = @id LIMIT 1", P("@id", userId ?? 1), ct) ?? 1;

static async Task<long> CoachId(MySqlConnection conn, long? userId, CancellationToken ct) =>
    await Scalar<long>(conn, "SELECT id FROM coaches WHERE user_id = @id LIMIT 1", P("@id", userId ?? 3), ct) ?? 1;

static async Task<System.Collections.Generic.List<object>> StudentTasks(MySqlConnection conn, long studentId, CancellationToken ct) => await Query(conn, """
    SELECT a.id, t.title, t.requirement, t.due_date dueDate, a.submit_status submitStatus, a.coach_status coachStatus, a.ai_status aiStatus
    FROM training_task_assignments a JOIN training_tasks t ON t.id=a.training_task_id
    WHERE a.student_id=@id
    ORDER BY t.due_date DESC;
    """, row => (object)new { id = L(row, "id"), title = S(row, "title"), requirement = S(row, "requirement"), dueDate = Date(row, "dueDate"), submitStatus = S(row, "submitStatus"), coachStatus = S(row, "coachStatus"), aiStatus = S(row, "aiStatus") }, P("@id", studentId), ct);

static async Task<System.Collections.Generic.List<object>> StudentReports(MySqlConnection conn, long studentId, CancellationToken ct) => await Query(conn, """
    SELECT f.id, f.report_code reportCode, f.title, f.final_note finalNote, f.coach_status coachStatus, f.family_status familyStatus,
           f.published_at publishedAt, a.overall_score overallScore, a.summary trend
    FROM feedback_reports f JOIN ai_analysis_reports a ON a.id=f.ai_report_id
    WHERE f.student_id=@id
    ORDER BY f.created_at DESC;
    """, row => (object)new { id = L(row, "id"), reportCode = S(row, "reportCode"), title = S(row, "title"), finalNote = S(row, "finalNote"), coachStatus = S(row, "coachStatus"), familyStatus = S(row, "familyStatus"), publishedAt = S(row, "publishedAt"), overallScore = L(row, "overallScore"), trend = S(row, "trend") }, P("@id", studentId), ct);

static async Task<System.Collections.Generic.List<object>> StudentSchedule(MySqlConnection conn, long studentId, CancellationToken ct) => await Query(conn, """
    SELECT cs.id, c.name className, co.name course, u.full_name coach, cs.session_date sessionDate, cs.start_time startTime, cs.end_time endTime, cs.status
    FROM class_students x
    JOIN classes c ON c.id=x.class_id
    JOIN courses co ON co.id=c.course_id
    JOIN class_sessions cs ON cs.class_id=c.id
    JOIN coaches ch ON ch.id=cs.coach_id
    JOIN users u ON u.id=ch.user_id
    WHERE x.student_id=@id
    ORDER BY cs.session_date, cs.start_time;
    """, row => (object)new { id = L(row, "id"), className = S(row, "className"), course = S(row, "course"), coach = S(row, "coach"), sessionDate = Date(row, "sessionDate"), startTime = S(row, "startTime"), endTime = S(row, "endTime"), status = S(row, "status") }, P("@id", studentId), ct);

static async Task<System.Collections.Generic.List<object>> CoachClasses(MySqlConnection conn, long coachId, CancellationToken ct) => await Query(conn, """
    SELECT cs.id, c.id classId, c.name className, co.name course, cs.session_date sessionDate, cs.start_time startTime, cs.end_time endTime, cs.status,
           COUNT(cls.student_id) rosterCount
    FROM class_sessions cs JOIN classes c ON c.id=cs.class_id JOIN courses co ON co.id=c.course_id
    LEFT JOIN class_students cls ON cls.class_id=c.id
    WHERE cs.coach_id=@id
    GROUP BY cs.id, c.id, c.name, co.name, cs.session_date, cs.start_time, cs.end_time, cs.status
    ORDER BY cs.session_date, cs.start_time;
    """, row => (object)new { id = L(row, "id"), classId = L(row, "classId"), className = S(row, "className"), course = S(row, "course"), sessionDate = Date(row, "sessionDate"), startTime = S(row, "startTime"), endTime = S(row, "endTime"), status = S(row, "status"), rosterCount = L(row, "rosterCount") }, P("@id", coachId), ct);

static async Task<System.Collections.Generic.List<object>> Roster(MySqlConnection conn, long classId, CancellationToken ct) => await Query(conn, """
    SELECT s.id, s.student_code studentCode, s.full_name name, s.age_group ageGroup,
           COALESCE(ar.status, 'Pending') attendanceStatus, COALESCE(ar.note, '') note, s.status
    FROM class_students cs JOIN students s ON s.id=cs.student_id
    LEFT JOIN class_sessions sess ON sess.class_id=cs.class_id
    LEFT JOIN attendance_records ar ON ar.class_session_id=sess.id AND ar.student_id=s.id
    WHERE cs.class_id=@id
    GROUP BY s.id, s.student_code, s.full_name, s.age_group, ar.status, ar.note, s.status
    ORDER BY s.full_name;
    """, row => (object)new { id = L(row, "id"), studentId = L(row, "id"), studentCode = S(row, "studentCode"), name = S(row, "name"), ageGroup = S(row, "ageGroup"), attendanceStatus = S(row, "attendanceStatus"), note = S(row, "note"), status = S(row, "status") }, P("@id", classId), ct);

static async Task<System.Collections.Generic.List<object>> VideoQueue(MySqlConnection conn, CancellationToken ct) => await Query(conn, """
    SELECT v.id, v.video_code videoCode, s.full_name student, v.drill_title drill, v.upload_status uploadStatus,
           COALESCE(j.status, 'Waiting') aiStatus, COALESCE(j.engine, 'MMPose') engine, COALESCE(j.confidence, 0) confidence,
           COALESCE(u.full_name, 'Coach TBD') reviewer
    FROM video_uploads v JOIN students s ON s.id=v.student_id
    LEFT JOIN ai_analysis_jobs j ON j.video_id=v.id
    LEFT JOIN feedback_reports f ON f.student_id=s.id
    LEFT JOIN coaches c ON c.id=f.coach_id
    LEFT JOIN users u ON u.id=c.user_id
    GROUP BY v.id, v.video_code, s.full_name, v.drill_title, v.upload_status, j.status, j.engine, j.confidence, u.full_name
    ORDER BY v.created_at DESC;
    """, row => (object)new { id = L(row, "id"), videoCode = S(row, "videoCode"), student = S(row, "student"), drill = S(row, "drill"), uploadStatus = S(row, "uploadStatus"), aiStatus = S(row, "aiStatus"), engine = S(row, "engine"), confidence = D(row, "confidence"), reviewer = S(row, "reviewer") }, ct);

static async Task<System.Collections.Generic.List<object>> CoursesAdmin(MySqlConnection conn, CancellationToken ct) => await Query(conn, "SELECT id, course_code courseCode, name, level, age_group ageGroup, price, capacity, status FROM courses ORDER BY id", row => (object)new { id = L(row, "id"), courseCode = S(row, "courseCode"), name = S(row, "name"), level = S(row, "level"), ageGroup = S(row, "ageGroup"), price = D(row, "price"), capacity = L(row, "capacity"), status = S(row, "status") }, ct);
static async Task<System.Collections.Generic.List<object>> Students(MySqlConnection conn, CancellationToken ct) => await Query(conn, "SELECT s.id, s.student_code studentCode, s.full_name name, u.email, s.age_group ageGroup, s.video_consent_status videoConsentStatus, s.status FROM students s LEFT JOIN users u ON u.id=s.user_id ORDER BY s.id", row => (object)new { id = L(row, "id"), studentCode = S(row, "studentCode"), name = S(row, "name"), email = S(row, "email"), ageGroup = S(row, "ageGroup"), videoConsentStatus = S(row, "videoConsentStatus"), status = S(row, "status") }, ct);
static async Task<System.Collections.Generic.List<object>> Enrollments(MySqlConnection conn, CancellationToken ct) => await Query(conn, "SELECT o.id, o.order_no orderId, o.family_name family, c.name course, o.amount, o.currency, o.status FROM orders o JOIN enrollments e ON e.id=o.enrollment_id JOIN courses c ON c.id=e.course_id ORDER BY o.order_date DESC", row => (object)new { id = L(row, "id"), orderId = S(row, "orderId"), family = S(row, "family"), course = S(row, "course"), amount = $"{S(row, "currency")} {D(row, "amount"):0.00}", status = S(row, "status") }, ct);

static async Task<System.Collections.Generic.List<object>> AllReports(MySqlConnection conn, string status, CancellationToken ct)
{
    var sql = """
        SELECT f.id, f.report_code reportCode, f.title, s.full_name student, u.full_name coach, f.coach_status coachStatus, f.family_status familyStatus, f.published_at publishedAt
        FROM feedback_reports f JOIN students s ON s.id=f.student_id JOIN coaches c ON c.id=f.coach_id JOIN users u ON u.id=c.user_id
        """;
    if (!string.IsNullOrWhiteSpace(status)) sql += " WHERE f.coach_status=@status";
    sql += " ORDER BY f.created_at DESC";
    return string.IsNullOrWhiteSpace(status)
        ? await Query(conn, sql, row => (object)new { id = L(row, "id"), reportCode = S(row, "reportCode"), title = S(row, "title"), student = S(row, "student"), coach = S(row, "coach"), coachStatus = S(row, "coachStatus"), familyStatus = S(row, "familyStatus"), publishedAt = S(row, "publishedAt") }, ct)
        : await Query(conn, sql, row => (object)new { id = L(row, "id"), reportCode = S(row, "reportCode"), title = S(row, "title"), student = S(row, "student"), coach = S(row, "coach"), coachStatus = S(row, "coachStatus"), familyStatus = S(row, "familyStatus"), publishedAt = S(row, "publishedAt") }, P("@status", status), ct);
}

static async Task<object?> AnalysisReport(MySqlConnection conn, long id, CancellationToken ct)
{
    var report = await Single(conn, "SELECT id, title, overall_score overallScore, summary, status FROM ai_analysis_reports WHERE id=@id", row => new { id = L(row, "id"), title = S(row, "title"), overallScore = L(row, "overallScore"), summary = S(row, "summary"), status = S(row, "status") }, P("@id", id), ct);
    if (report is null) return null;
    var metrics = await Query(conn, "SELECT metric_name name, metric_value value, metric_unit unit, trend_text trend FROM ai_report_metrics WHERE ai_report_id=@id", row => new { name = S(row, "name"), value = S(row, "value"), unit = S(row, "unit"), trend = S(row, "trend") }, P("@id", id), ct);
    var suggestions = await Query(conn, "SELECT id, suggestion_text text, visibility_status visibilityStatus, coach_decision coachDecision FROM ai_report_suggestions WHERE ai_report_id=@id", row => new { id = L(row, "id"), text = S(row, "text"), visibilityStatus = S(row, "visibilityStatus"), coachDecision = S(row, "coachDecision") }, P("@id", id), ct);
    return new { report, metrics, suggestions };
}

static string S(IDataRecord row, string name) => row[name] is DBNull ? "" : Convert.ToString(row[name]) ?? "";
static long L(IDataRecord row, string name) => row[name] is DBNull ? 0 : Convert.ToInt64(row[name]);
static decimal D(IDataRecord row, string name) => row[name] is DBNull ? 0 : Convert.ToDecimal(row[name]);
static string Date(IDataRecord row, string name) => row[name] is DBNull ? "" : Convert.ToDateTime(row[name]).ToString("yyyy-MM-dd");
static string RoleLabel(string role) => role switch { "coach" => "Coach", "admin" => "Administrator", _ => "Student / Parent" };
static string HomeRoute(string role) => role switch { "coach" => "/coach/dashboard", "admin" => "/admin/dashboard", _ => "/student/dashboard" };

record ApiResponse<T>(bool Success, string Message, T? Data, string TraceId);
record AuthInfo(long UserId, string Role);
record Metric(string Label, int Value, string Helper, string Icon);
record LoginRequest(string Email, string Password, bool Remember);
record RegisterRequest(string Name, string Email, string? Phone, string Password);
record ForgotPasswordRequest(string Email);
record AttendanceSaveRequest(List<AttendanceRecordRequest> Records);
record AttendanceRecordRequest(long StudentId, string Status, string? Note);
record AssignTaskRequest(long ClassId, long? TemplateId, string Title, string Requirement, string? Instruction, DateOnly? DueDate);
record UploadUrlRequest(string FileName, string ContentType);
record VideoCreateRequest(long? TaskAssignmentId, string DrillTitle, string? FileUrl, int? DurationSeconds);
record AnnotationRequest(int TimestampSeconds, string MarkerType, string Guidance);
record ReviewReportRequest(string Summary);
record PublishReportRequest(string FinalNote);


