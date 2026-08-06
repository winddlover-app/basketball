# Basketball Camp 后端接口设计

> 技术栈：.NET C# Web API + MySQL  
> 说明：本文只做接口设计，不包含后端代码。  
> 前端基础地址建议：`VITE_API_BASE_URL=/api`

## 1. 通用约定

### 1.1 认证方式

登录成功后后端返回 JWT Token，前端通过 Axios 拦截器放入：

```http
Authorization: Bearer {token}
```

### 1.2 通用返回格式

```json
{
  "success": true,
  "message": "OK",
  "data": {},
  "traceId": "optional-request-id"
}
```

### 1.3 分页返回格式

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "items": [],
    "page": 1,
    "pageSize": 20,
    "total": 100
  }
}
```

### 1.4 通用分页参数

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `page` | number | 否 | 默认 1 |
| `pageSize` | number | 否 | 默认 20 |
| `keyword` | string | 否 | 搜索关键字 |
| `status` | string | 否 | 状态筛选 |

## 2. Auth 认证接口

### POST `/api/auth/login`

用于登录页。登录成功后，后端根据账号返回角色，前端不展示角色选择。

请求：

```json
{
  "email": "alex@example.com",
  "password": "camp123",
  "remember": true
}
```

返回：

```json
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "alex@example.com",
    "fullName": "Alex Morgan",
    "role": "student",
    "roleLabel": "Student / Parent",
    "homeRoute": "/student/dashboard"
  }
}
```

### POST `/api/auth/register`

用于注册家庭/学员账号。默认创建 `student` 角色账号。

请求：

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "camp123"
}
```

返回：

```json
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "alex@example.com",
    "fullName": "Alex Morgan",
    "role": "student",
    "homeRoute": "/student/dashboard"
  }
}
```

### POST `/api/auth/forgot-password`

请求：

```json
{
  "email": "alex@example.com"
}
```

返回：

```json
{
  "sent": true
}
```

### GET `/api/auth/me`

获取当前登录用户、角色和基础权限。

返回：

```json
{
  "id": 1,
  "email": "alex@example.com",
  "fullName": "Alex Morgan",
  "role": "student",
  "roleLabel": "Student / Parent",
  "homeRoute": "/student/dashboard",
  "permissions": ["courses.view", "reports.view"]
}
```

### GET `/api/permissions/my-menu`

如果后期菜单改为后端控制，可使用该接口。当前前端也可以继续保留静态菜单。

返回：

```json
[
  {
    "label": "Dashboard",
    "path": "/student/dashboard",
    "icon": "LayoutDashboard"
  }
]
```

## 3. Student / Parent 学员家长端接口

### GET `/api/student/dashboard`

对应页面：Student Dashboard

返回：

```json
{
  "metrics": [
    { "label": "Booked Classes", "value": "12", "detail": "+2 this month" }
  ],
  "nextClass": {
    "classId": 1,
    "className": "U12 Skills Development",
    "date": "2026-08-06",
    "startTime": "17:30",
    "court": "Court A",
    "coachName": "Coach Miller",
    "reminder": "Bring water, indoor shoes, and last week's dribbling video."
  },
  "activeTasks": [],
  "latestReports": []
}
```

### GET `/api/student/courses`

对应页面：Courses

查询参数：`keyword`, `level`, `status`, `page`, `pageSize`

返回字段：

| 字段 | 说明 |
|---|---|
| `id` | 课程 ID |
| `courseCode` | 课程编号，例如 `C-101` |
| `name` | 课程名称 |
| `level` | 难度 |
| `coachName` | 教练 |
| `scheduleText` | 课程时间 |
| `capacityText` | 容量展示，例如 `18 / 24` |
| `price` | 价格 |
| `status` | Open / Waitlist / Closed |

### GET `/api/student/schedule`

对应页面：Schedule

查询参数：`fromDate`, `toDate`

返回：

```json
[
  {
    "sessionId": 1,
    "className": "U12 Skills Development",
    "date": "2026-08-06",
    "startTime": "17:30",
    "endTime": "18:30",
    "court": "Court A",
    "coachName": "Coach Miller",
    "status": "Scheduled"
  }
]
```

### GET `/api/student/training-tasks`

对应页面：Training Tasks

返回：

```json
[
  {
    "assignmentId": 1,
    "taskId": 1,
    "title": "Layup footwork, 5 attempts",
    "dueDate": "2026-08-15",
    "requirement": "Video required",
    "submitStatus": "In Progress",
    "aiStatus": "Ready for upload",
    "coachStatus": "Assigned"
  }
]
```

### POST `/api/videos/upload-url`

对应页面：Video Upload  
用于获取上传地址，可对接本地存储、OSS、S3、Azure Blob 等。

请求：

```json
{
  "fileName": "layup.mp4",
  "contentType": "video/mp4",
  "taskAssignmentId": 1
}
```

返回：

```json
{
  "uploadUrl": "https://storage.example.com/upload-url",
  "fileUrl": "https://storage.example.com/videos/layup.mp4"
}
```

### POST `/api/videos`

提交视频上传记录，并触发 AI 异步分析任务。

请求：

```json
{
  "taskAssignmentId": 1,
  "studentId": 1,
  "drillTitle": "Layup Footwork",
  "fileUrl": "https://storage.example.com/videos/layup.mp4",
  "durationSeconds": 42
}
```

返回：

```json
{
  "videoId": 2,
  "videoCode": "V-3002",
  "uploadStatus": "Uploaded",
  "aiStatus": "Waiting"
}
```

### GET `/api/videos/{id}/status`

对应页面：Video Upload / Video AI Queue

返回：

```json
{
  "videoId": 2,
  "uploadStatus": "Uploaded",
  "aiStatus": "Draft Ready",
  "progress": 100
}
```

### GET `/api/analysis-reports/{id}`

对应页面：AI Analysis Report

返回：

```json
{
  "id": 1,
  "videoId": 2,
  "title": "Layup Footwork Review",
  "overallScore": 82,
  "status": "AI Draft",
  "summary": "Approach speed improved while takeoff timing needs confirmation.",
  "metrics": [
    { "name": "Approach Speed", "value": "+12", "unit": "percent", "trendText": "+12% vs baseline" }
  ],
  "suggestions": [
    {
      "id": 1,
      "text": "Plant the outside foot earlier before takeoff.",
      "visibilityStatus": "Pending Coach Review",
      "coachDecision": "Pending"
    }
  ]
}
```

### GET `/api/student/feedback-reports`

对应页面：Coach Feedback

返回字段：

| 字段 | 说明 |
|---|---|
| `reportId` | 报告 ID |
| `title` | 报告标题 |
| `aiStatus` | AI 状态 |
| `coachStatus` | 教练状态 |
| `familyStatus` | 家长查看状态 |
| `score` | 总分 |
| `trend` | 趋势说明 |

### GET `/api/student/growth-trends`

对应页面：Growth Trends

返回：

```json
{
  "metrics": [
    {
      "metricName": "Balance",
      "metricValue": 14,
      "metricUnit": "percent",
      "trendText": "+14% balance",
      "recordedDate": "2026-08-06"
    }
  ],
  "timeline": [
    {
      "date": "2026-08-06",
      "text": "Layup balance improved by 14%."
    }
  ]
}
```

### GET `/api/student/profile`

对应页面：Profile

返回：

```json
{
  "student": {
    "id": 1,
    "fullName": "Alex Morgan",
    "ageGroup": "U12",
    "currentCourse": "U12 Skills Development",
    "videoConsentStatus": "Active"
  },
  "parent": {
    "fullName": "Dana Morgan",
    "email": "dana@example.com",
    "emergencyContact": "+1 555 0134"
  }
}
```

### PUT `/api/student/profile`

用于更新家长联系信息、紧急联系人和授权状态。

## 4. Coach 教练端接口

### GET `/api/coach/dashboard`

对应页面：Coach Dashboard

返回：

```json
{
  "metrics": [
    { "label": "Classes Today", "value": "4", "detail": "2 courts active" }
  ],
  "reviewQueue": [
    {
      "videoId": 2,
      "videoCode": "V-3002",
      "studentName": "Alex Morgan",
      "drill": "Layup Footwork",
      "uploadStatus": "Uploaded",
      "aiStatus": "Draft Ready",
      "reviewer": "Coach Miller"
    }
  ]
}
```

### GET `/api/coach/classes/today`

对应页面：Today Classes

返回字段：`sessionId`, `time`, `className`, `court`, `studentCount`, `status`

### GET `/api/classes/{classId}/roster`

对应页面：Class Roster

返回字段：`studentId`, `studentName`, `className`, `attendance`, `progress`, `focus`, `status`

### GET `/api/classes/{classId}/attendance`

对应页面：Attendance  
获取点名名单。

### POST `/api/classes/{classId}/attendance`

提交点名。

请求：

```json
{
  "sessionId": 1,
  "records": [
    {
      "studentId": 1,
      "status": "Present",
      "note": ""
    }
  ]
}
```

返回：

```json
{
  "saved": true
}
```

### GET `/api/coach/classes`

对应页面：Assign Training  
获取教练可布置任务的班级列表。

### GET `/api/training-task-templates`

对应页面：Assign Training / Training Task Management

返回字段：`id`, `title`, `drillType`, `defaultRequirement`, `defaultInstruction`, `status`

### POST `/api/training-tasks/assign`

对应页面：Assign Training

请求：

```json
{
  "templateId": 1,
  "classId": 1,
  "title": "Layup footwork, 5 attempts",
  "dueDate": "2026-08-15",
  "requirement": "Video required",
  "instruction": "Record from the side. Keep both feet visible before takeoff."
}
```

返回：

```json
{
  "taskId": 1,
  "assignedStudentCount": 24,
  "status": "Assigned"
}
```

### GET `/api/videos/review-queue`

对应页面：Video Review / Coach Dashboard

查询参数：`aiStatus`, `studentName`, `page`, `pageSize`

返回字段：`videoId`, `videoCode`, `studentName`, `drill`, `uploadStatus`, `aiStatus`, `reviewer`

### GET `/api/videos/{id}`

对应页面：Video Review

返回视频详情、学生、任务、AI 状态、缩略图、文件 URL。

### GET `/api/videos/{id}/annotations`

对应页面：Annotation

返回：

```json
[
  {
    "id": 1,
    "timestampSeconds": 14,
    "markerType": "Footwork",
    "guidance": "Plant the outside foot earlier and keep shoulders square to the basket."
  }
]
```

### POST `/api/videos/{id}/annotations`

保存教练标注。

请求：

```json
{
  "timestampSeconds": 14,
  "markerType": "Footwork",
  "guidance": "Plant the outside foot earlier and keep shoulders square to the basket."
}
```

### GET `/api/reports/{id}/review-draft`

对应页面：AI Review

返回 AI 草稿、指标、建议、教练已有修改内容。

### PUT `/api/reports/{id}/review`

对应页面：AI Review  
用于确认、修改或隐藏 AI 建议。

请求：

```json
{
  "finalNote": "Good rhythm. Keep the guide hand steady and finish with a higher hold.",
  "suggestions": [
    {
      "suggestionId": 1,
      "coachDecision": "Approved",
      "visibilityStatus": "Visible"
    }
  ]
}
```

### POST `/api/reports/{id}/publish`

对应页面：AI Review

返回：

```json
{
  "reportId": 1,
  "coachStatus": "Published",
  "familyStatus": "Unread",
  "publishedAt": "2026-08-06T18:00:00"
}
```

### GET `/api/coach/reports/published`

对应页面：Published Reports

返回教练已发布报告列表。

### GET `/api/coach/profile`

对应页面：Coach Profile

返回教练姓名、专长、可用场地、状态。

### PUT `/api/coach/profile`

更新教练资料。

## 5. Admin 管理端接口

### GET `/api/admin/dashboard`

对应页面：Admin Dashboard

返回：

```json
{
  "metrics": [
    { "label": "Active Students", "value": "286", "detail": "+24 this month" }
  ],
  "paymentAlerts": [],
  "videoAiAlerts": []
}
```

### GET `/api/admin/courses`

对应页面：Course Management  
查询参数：`keyword`, `level`, `status`, `page`, `pageSize`

### POST `/api/admin/courses`

创建课程。

### PUT `/api/admin/courses/{id}`

更新课程。

### PATCH `/api/admin/courses/{id}/status`

上下架课程。

请求：

```json
{
  "status": "Open"
}
```

### GET `/api/admin/classes`

对应页面：Class Management  
返回班级、课程、教练、场地、排课、容量和状态。

### POST `/api/admin/classes`

创建班级。

### PUT `/api/admin/classes/{id}`

更新班级和排课。

### GET `/api/admin/students`

对应页面：Student Management  
返回学员、家长绑定、班级、状态、训练进度。

### GET `/api/admin/coaches`

对应页面：Coach Management  
返回教练、专长、课程数、待处理报告数、状态。

### GET `/api/admin/enrollments`

对应页面：Enrollment Management

查询参数：`keyword`, `paymentStatus`, `courseId`, `fromDate`, `toDate`, `page`, `pageSize`

返回字段：`orderId`, `family`, `course`, `amount`, `date`, `status`

### GET `/api/admin/training-tasks`

对应页面：Training Task Management  
返回任务模板和任务分配记录。

### GET `/api/admin/video-ai-queue`

对应页面：Video/AI Queue

查询参数：`uploadStatus`, `aiStatus`, `reviewerId`, `page`, `pageSize`

返回字段：`videoId`, `videoCode`, `studentName`, `drill`, `uploadStatus`, `aiStatus`, `reviewer`

### GET `/api/admin/reports`

对应页面：Report Management

查询参数：`aiStatus`, `coachStatus`, `familyStatus`, `page`, `pageSize`

返回字段：`reportId`, `title`, `aiStatus`, `coachStatus`, `familyStatus`, `score`, `trend`

### GET `/api/admin/permissions`

对应页面：Permission Management

返回：

```json
[
  {
    "module": "Courses",
    "student": "View",
    "coach": "View",
    "admin": "Manage"
  }
]
```

### PUT `/api/admin/permissions`

更新角色权限配置。

请求：

```json
{
  "roleCode": "coach",
  "permissionCodes": ["courses.view", "attendance.manage", "ai.review", "reports.manage"]
}
```

### GET `/api/admin/settings`

对应页面：System Settings

返回：

```json
{
  "organizationName": "Basketball Camp Academy",
  "defaultCurrency": "USD",
  "reportReviewPolicy": "Coach approval required before publish",
  "hideAiSuggestionsUntilCoachApproval": true,
  "parentConsentRequiredForVideoUpload": true
}
```

### PUT `/api/admin/settings`

更新系统配置。

## 6. 前端页面与接口映射

| 前端页面 | 主要接口 |
|---|---|
| Sign In | `POST /api/auth/login` |
| Register | `POST /api/auth/register` |
| Forgot Password | `POST /api/auth/forgot-password` |
| Dashboard Layout | `GET /api/auth/me`, `GET /api/permissions/my-menu` |
| Student Dashboard | `GET /api/student/dashboard` |
| Courses | `GET /api/student/courses` |
| Schedule | `GET /api/student/schedule` |
| Training Tasks | `GET /api/student/training-tasks` |
| Video Upload | `POST /api/videos/upload-url`, `POST /api/videos`, `GET /api/videos/{id}/status` |
| AI Analysis Report | `GET /api/analysis-reports/{id}` |
| Coach Feedback | `GET /api/student/feedback-reports` |
| Growth Trends | `GET /api/student/growth-trends` |
| Profile | `GET /api/student/profile`, `PUT /api/student/profile` |
| Coach Dashboard | `GET /api/coach/dashboard` |
| Today Classes | `GET /api/coach/classes/today` |
| Class Roster | `GET /api/classes/{classId}/roster` |
| Attendance | `GET /api/classes/{classId}/attendance`, `POST /api/classes/{classId}/attendance` |
| Assign Training | `GET /api/coach/classes`, `GET /api/training-task-templates`, `POST /api/training-tasks/assign` |
| Video Review | `GET /api/videos/review-queue`, `GET /api/videos/{id}` |
| Annotation | `GET /api/videos/{id}/annotations`, `POST /api/videos/{id}/annotations` |
| AI Review | `GET /api/reports/{id}/review-draft`, `PUT /api/reports/{id}/review`, `POST /api/reports/{id}/publish` |
| Published Reports | `GET /api/coach/reports/published` |
| Coach Profile | `GET /api/coach/profile`, `PUT /api/coach/profile` |
| Admin Dashboard | `GET /api/admin/dashboard` |
| Course Management | `GET /api/admin/courses`, `POST /api/admin/courses`, `PUT /api/admin/courses/{id}` |
| Class Management | `GET /api/admin/classes`, `POST /api/admin/classes`, `PUT /api/admin/classes/{id}` |
| Student Management | `GET /api/admin/students` |
| Coach Management | `GET /api/admin/coaches` |
| Enrollment Management | `GET /api/admin/enrollments` |
| Training Task Management | `GET /api/admin/training-tasks`, `GET /api/training-task-templates` |
| Video/AI Queue | `GET /api/admin/video-ai-queue` |
| Report Management | `GET /api/admin/reports` |
| Permission Management | `GET /api/admin/permissions`, `PUT /api/admin/permissions` |
| System Settings | `GET /api/admin/settings`, `PUT /api/admin/settings` |

## 7. 建议优先开发顺序

1. Auth：`login`, `register`, `me`
2. Admin 基础数据：课程、班级、学员、教练
3. 报名支付：报名、订单、支付状态
4. 教练上课：今日课程、名单、点名
5. 训练任务：模板、布置、学员任务
6. 视频上传：上传记录、状态查询
7. AI 分析：队列、报告、指标、建议
8. 教练复核：标注、修改建议、发布报告
9. 学员成长：反馈报告、成长趋势
10. 权限与系统设置
