import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  CreditCard,
  FileText,
  GraduationCap,
  Home,
  LineChart,
  ListChecks,
  LogIn,
  Mail,
  MessageCircle,
  PlayCircle,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  UploadCloud,
  UserRound,
  UsersRound,
  Video,
} from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1706841533921-518301209b62?auto=format&fit=crop&w=1600&q=80";
const trainingImage =
  "https://images.unsplash.com/photo-1762025753986-b6227fe6debb?auto=format&fit=crop&w=1200&q=80";
const youthImage =
  "https://images.unsplash.com/photo-1518614368389-5160c0b0de72?auto=format&fit=crop&w=1200&q=80";
const courtImage =
  "https://images.unsplash.com/photo-1762025753986-b6227fe6debb?auto=format&fit=crop&w=1200&q=80";

const roles = {
  student: {
    label: "Student / Parent",
    short: "Student",
    description: "Classes, homework, video analysis, growth reports",
    accent: "blue",
    home: "overview",
    nav: [
      ["overview", "Dashboard", Home],
      ["courses", "Course Catalog", GraduationCap],
      ["enrollment", "Enrollment", CreditCard],
      ["schedule", "My Schedule", CalendarDays],
      ["training", "Training Tasks", Target],
      ["video", "Video Analysis", Video],
      ["reports", "Feedback Reports", LineChart],
      ["profile", "Messages & Profile", UserRound],
    ],
  },
  coach: {
    label: "Coach",
    short: "Coach",
    description: "Today classes, rosters, attendance, assignments, AI review",
    accent: "green",
    home: "today",
    nav: [
      ["today", "Today", Home],
      ["roster", "Class Roster", UsersRound],
      ["attendance", "Attendance", ClipboardCheck],
      ["assign", "Assign Tasks", ListChecks],
      ["review", "AI Review Center", Video],
      ["coachReports", "Published Reports", FileText],
      ["coachProfile", "Coach Profile", UserRound],
    ],
  },
  admin: {
    label: "Institution Admin",
    short: "Admin",
    description: "Courses, schedules, orders, users, reporting, settings",
    accent: "orange",
    home: "adminOverview",
    nav: [
      ["adminOverview", "Overview", Home],
      ["courseMgmt", "Course Management", GraduationCap],
      ["scheduleMgmt", "Schedule Planner", CalendarDays],
      ["orders", "Orders", CreditCard],
      ["users", "Users", UsersRound],
      ["adminReports", "Reports", BarChart3],
      ["settings", "Settings", Settings],
    ],
  },
};

const courses = [
  {
    name: "U12 Ball Handling Lab",
    level: "Beginner",
    coach: "Coach Miller",
    price: "$299",
    seats: "8 seats left",
    schedule: "Tue & Thu, 5:30 PM",
    image: youthImage,
  },
  {
    name: "Shooting Form Builder",
    level: "Intermediate",
    coach: "Coach Lee",
    price: "$349",
    seats: "5 seats left",
    schedule: "Sat, 10:00 AM",
    image: trainingImage,
  },
  {
    name: "Elite Footwork Camp",
    level: "Advanced",
    coach: "Coach Carter",
    price: "$399",
    seats: "Waitlist open",
    schedule: "Mon & Wed, 6:00 PM",
    image: courtImage,
  },
];

const students = [
  ["Alex Morgan", "U12 Skills", "Present", "82%", "Layup footwork"],
  ["Mia Chen", "U12 Skills", "Present", "91%", "Free throw rhythm"],
  ["Noah Brooks", "Shooting Lab", "Late", "76%", "Release angle"],
  ["Sofia Rivera", "Shooting Lab", "Present", "88%", "Follow through"],
  ["Ethan Patel", "Elite Footwork", "Absent", "69%", "Makeup needed"],
];

const reports = [
  ["Layup Footwork", "AI reviewed", "Coach approved", "+14% balance"],
  ["Free Throw Set Point", "Needs coach review", "Draft hidden", "+8% arc"],
  ["Defensive Slides", "Published", "Parent viewed", "+11% speed"],
];

function App() {
  const [authMode, setAuthMode] = useState("signin");
  const [authEmail, setAuthEmail] = useState("alex@example.com");
  const [role, setRole] = useState("student");
  const [signedIn, setSignedIn] = useState(false);
  const [page, setPage] = useState(roles.student.home);

  const activeRole = roles[role];
  const nav = activeRole.nav;

  function signIn() {
    const email = authEmail.trim().toLowerCase();
    const matchedRole = email.includes("admin")
      ? "admin"
      : email.includes("coach")
        ? "coach"
        : "student";
    setRole(matchedRole);
    setSignedIn(true);
    setPage(roles[matchedRole].home);
  }

  if (!signedIn) {
    return (
      <AuthPage
        authMode={authMode}
        setAuthMode={setAuthMode}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        onSignIn={signIn}
      />
    );
  }

  return (
    <div className="site-shell">
      <SiteHeader
        role={role}
        activeRole={activeRole}
        nav={nav}
        page={page}
        setPage={setPage}
        setSignedIn={setSignedIn}
      />
      <main className="website-workspace">
        <PageContent role={role} page={page} setPage={setPage} />
      </main>
    </div>
  );
}

function AuthPage({ authMode, setAuthMode, authEmail, setAuthEmail, onSignIn }) {
  return (
    <main className="auth-layout">
      <section className="auth-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="auth-hero-overlay" />
        <div className="auth-brand">
          <span className="logo-mark">BC</span>
          <span>Basketball Camp</span>
        </div>
        <div className="auth-hero-copy">
          <p className="eyebrow">Youth basketball training platform</p>
          <h1>Train smarter. Track every step.</h1>
          <p>
            Course enrollment, coach feedback, AI video analysis, and progress
            reports in one calm workspace.
          </p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <p className="eyebrow">{authMode === "signin" ? "Sign in" : "Create account"}</p>
            <h2>{authMode === "signin" ? "Welcome back" : "Join Basketball Camp"}</h2>
            <p>
              {authMode === "signin"
                ? "Use your email to continue to your training portal."
                : "Create an account with email and start from the right role."}
            </p>
          </div>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              placeholder="alex@example.com"
              value={authEmail}
              onChange={(event) => setAuthEmail(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" placeholder="Enter password" />
          </label>
          {authMode === "register" && (
            <label className="field">
              <span>Full name</span>
              <input type="text" placeholder="Alex Morgan" />
            </label>
          )}

          <div className="form-row">
            <label className="check">
              <input type="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>
            <button type="button" className="link-button">
              Forgot password?
            </button>
          </div>

          <button className="primary-button" onClick={onSignIn} type="button">
            <LogIn size={18} />
            {authMode === "signin" ? "Sign In" : "Create Account"}
          </button>

          <button
            className="switch-auth"
            onClick={() => setAuthMode(authMode === "signin" ? "register" : "signin")}
            type="button"
          >
            {authMode === "signin"
              ? "New to Basketball Camp? Create an account"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </section>
    </main>
  );
}

function SiteHeader({ activeRole, nav, page, setPage, setSignedIn }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-topline">
          <div className="brand-lockup">
            <span className="logo-mark">BC</span>
            <div>
              <strong>Basketball Camp</strong>
              <span>Training Web Portal</span>
            </div>
          </div>

          <div className="site-actions">
            <label className="search-box">
              <Search size={17} />
              <input placeholder="Search classes, reports, students" />
            </label>
            <button className="icon-button" type="button" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <button className="avatar-button" type="button">
              <span>AM</span>
              <div>
                <strong>Alex Morgan</strong>
                <small>{activeRole.short}</small>
              </div>
            </button>
            <button className="ghost-button" onClick={() => setSignedIn(false)} type="button">
              Sign Out
            </button>
          </div>
        </div>

        <section className={`site-hero-strip ${activeRole.accent}`}>
          <div>
            <p className="eyebrow">Basketball Camp</p>
            <h1>{activeRole.label} Web Portal</h1>
            <p>{activeRole.description}</p>
          </div>
          <div className="hero-strip-metrics">
            <span><Sparkles size={17} /> AI analysis</span>
            <span><Activity size={17} /> Progress tracking</span>
            <span><ShieldCheck size={17} /> Coach approved</span>
          </div>
        </section>

        <nav className="site-page-tabs" aria-label={`${activeRole.label} pages`}>
          {nav.map(([key, label, Icon]) => (
            <button
              key={key}
              className={page === key ? "active" : ""}
              onClick={() => setPage(key)}
              type="button"
            >
              <Icon size={17} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Sidebar({ role, activeRole, nav, page, setPage, changeRole }) {
  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <span className="logo-mark">BC</span>
        <div>
          <strong>Basketball Camp</strong>
          <span>Web Portal</span>
        </div>
      </div>

      <div className={`role-card ${activeRole.accent}`}>
        <p>{activeRole.label}</p>
        <span>{activeRole.description}</span>
      </div>

      <nav className="side-nav">
        {nav.map(([key, label, Icon]) => (
          <button
            key={key}
            className={page === key ? "active" : ""}
            onClick={() => setPage(key)}
            type="button"
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="role-switcher">
        <span>Preview role</span>
        {Object.entries(roles).map(([key, value]) => (
          <button
            key={key}
            className={role === key ? "selected" : ""}
            onClick={() => changeRole(key)}
            type="button"
          >
            {value.short}
          </button>
        ))}
      </div>
    </aside>
  );
}

function Topbar({ activeRole, setSignedIn }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Basketball Camp</p>
        <h1>{activeRole.label} Portal</h1>
      </div>
      <div className="topbar-actions">
        <label className="search-box">
          <Search size={17} />
          <input placeholder="Search classes, reports, students" />
        </label>
        <button className="icon-button" type="button" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <button className="avatar-button" type="button">
          <span>AM</span>
          <div>
            <strong>Alex Morgan</strong>
            <small>{activeRole.short}</small>
          </div>
        </button>
        <button className="ghost-button" onClick={() => setSignedIn(false)} type="button">
          Sign Out
        </button>
      </div>
    </header>
  );
}

function PageContent({ role, page, setPage }) {
  if (role === "student") return <StudentPage page={page} setPage={setPage} />;
  if (role === "coach") return <CoachPage page={page} />;
  return <AdminPage page={page} />;
}

function StudentPage({ page, setPage }) {
  if (page === "courses") return <CoursesPage setPage={setPage} />;
  if (page === "enrollment") return <EnrollmentPage />;
  if (page === "schedule") return <SchedulePage />;
  if (page === "training") return <TrainingPage />;
  if (page === "video") return <VideoAnalysisPage />;
  if (page === "reports") return <StudentReportsPage />;
  if (page === "profile") return <ProfilePage />;
  return <StudentDashboard setPage={setPage} />;
}

function StudentDashboard({ setPage }) {
  return (
    <div className="page-grid">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Next class today</p>
          <h2>U12 Skills Development</h2>
          <p>5:30 PM at Court A with Coach Miller. Bring water, indoor shoes, and last week's dribbling video.</p>
          <div className="hero-actions">
            <button className="primary-button compact" onClick={() => setPage("schedule")} type="button">
              <CalendarDays size={17} />
              View Schedule
            </button>
            <button className="secondary-button compact" onClick={() => setPage("training")} type="button">
              <Target size={17} />
              Open Tasks
            </button>
          </div>
        </div>
        <img src={youthImage} alt="Youth basketball class" />
      </section>
      <MetricStrip
        metrics={[
          ["Classes booked", "12", "+2 this month"],
          ["Homework done", "86%", "+9% vs last camp"],
          ["Coach reports", "5", "2 new comments"],
          ["Shooting trend", "+11%", "Arc and balance"],
        ]}
      />
      <div className="two-column">
        <Panel title="Training Plan" action="View all">
          <TaskRows />
        </Panel>
        <Panel title="Growth Snapshot" action="Reports">
          <MiniChart />
          <div className="insight-list">
            <Insight label="Ball control" value="Strong progress" tone="green" />
            <Insight label="Left-hand layup" value="Needs 3 more clips" tone="orange" />
            <Insight label="Parent report" value="Viewed yesterday" tone="blue" />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function CoursesPage({ setPage }) {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Course catalog"
        title="Find the right training program"
        text="Browse available camps, compare coaches, review schedule fit, and start enrollment."
        action={<button className="primary-button compact" onClick={() => setPage("enrollment")} type="button"><CreditCard size={17} />Enroll now</button>}
      />
      <div className="filter-bar">
        {["All", "Beginner", "Intermediate", "Advanced", "Weekend", "After school"].map((item) => (
          <button className={item === "All" ? "selected" : ""} key={item} type="button">{item}</button>
        ))}
      </div>
      <div className="course-grid">
        {courses.map((course) => (
          <article className="course-card" key={course.name}>
            <img src={course.image} alt="" />
            <div>
              <span className="tag">{course.level}</span>
              <h3>{course.name}</h3>
              <p>{course.schedule}</p>
              <div className="course-meta">
                <span>{course.coach}</span>
                <strong>{course.price}</strong>
              </div>
              <button className="secondary-button full" onClick={() => setPage("enrollment")} type="button">
                View Details <ChevronRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function EnrollmentPage() {
  return (
    <div className="split-page">
      <section>
        <PageHeader
          eyebrow="Enrollment"
          title="Confirm course and payment"
          text="Parents can review course details, student profile, discounts, waiver status, and payment summary before checkout."
        />
        <div className="checkout-card">
          <h3>U12 Ball Handling Lab</h3>
          <div className="checkout-line"><span>Student</span><strong>Alex Morgan</strong></div>
          <div className="checkout-line"><span>Schedule</span><strong>Tue & Thu, 5:30 PM</strong></div>
          <div className="checkout-line"><span>Start date</span><strong>Aug 12, 2026</strong></div>
          <div className="checkout-line"><span>Course fee</span><strong>$299.00</strong></div>
          <div className="checkout-line"><span>Sibling discount</span><strong>-$20.00</strong></div>
          <div className="checkout-total"><span>Total due</span><strong>$279.00</strong></div>
          <button className="primary-button full" type="button"><CreditCard size={18} />Pay and Enroll</button>
        </div>
      </section>
      <AsidePanel title="Enrollment Checklist" image={courtImage}>
        <CheckItem label="Parent account verified" />
        <CheckItem label="Student profile completed" />
        <CheckItem label="Training waiver ready" />
        <CheckItem label="Personal schedule will be generated after payment" />
      </AsidePanel>
    </div>
  );
}

function SchedulePage() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Personal schedule"
        title="Classes, makeup sessions, and homework windows"
        text="The system turns enrollment into a personal timetable that families and coaches can rely on."
      />
      <div className="calendar-grid">
        {days.map((day, index) => (
          <div className="day-card" key={day}>
            <strong>{day}</strong>
            <span>{index + 10}</span>
            {index === 1 || index === 3 ? (
              <div className="calendar-event">
                <b>U12 Skills</b>
                <small>5:30 PM Court A</small>
              </div>
            ) : index === 5 ? (
              <div className="calendar-event blue">
                <b>Shooting Lab</b>
                <small>10:00 AM Court B</small>
              </div>
            ) : (
              <div className="calendar-empty">Training window</div>
            )}
          </div>
        ))}
      </div>
      <Panel title="Upcoming reminders">
        <ReminderRows />
      </Panel>
    </div>
  );
}

function TrainingPage() {
  return (
    <div className="split-page">
      <section>
        <PageHeader
          eyebrow="Training tasks"
          title="Homework that can be tracked after class"
          text="Each task has a due date, recording guide, coach notes, and analysis status."
        />
        <Panel title="Active assignments">
          <TaskRows detailed />
        </Panel>
      </section>
      <AsidePanel title="Upload Guidance" image={trainingImage}>
        <CheckItem label="Record from the side and front if possible" />
        <CheckItem label="Keep the whole body visible" />
        <CheckItem label="Use the assigned drill timer" />
        <CheckItem label="AI analysis begins after upload" />
      </AsidePanel>
    </div>
  );
}

function VideoAnalysisPage() {
  return (
    <div className="video-layout">
      <section className="video-stage">
        <div className="video-frame">
          <img src={trainingImage} alt="Basketball training video preview" />
          <button className="play-button" type="button"><PlayCircle size={34} /></button>
          <div className="pose-markers">
            <span style={{ left: "46%", top: "18%" }} />
            <span style={{ left: "51%", top: "36%" }} />
            <span style={{ left: "57%", top: "54%" }} />
            <span style={{ left: "43%", top: "58%" }} />
          </div>
        </div>
      </section>
      <aside className="analysis-panel">
        <p className="eyebrow">AI video analysis</p>
        <h2>Layup Footwork Review</h2>
        <div className="analysis-score">
          <span>82</span>
          <small>overall score</small>
        </div>
        <Insight label="Approach speed" value="+12% vs baseline" tone="green" />
        <Insight label="Takeoff foot" value="Needs coach note" tone="orange" />
        <Insight label="Body balance" value="Stable in 4 of 5 attempts" tone="blue" />
        <button className="primary-button full" type="button"><UploadCloud size={18} />Upload New Video</button>
      </aside>
    </div>
  );
}

function StudentReportsPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Feedback reports"
        title="Coach-approved insights for students and parents"
        text="AI suggestions are visible only after coach review, editing, or hiding sensitive recommendations."
      />
      <div className="report-grid">
        {reports.map(([name, ai, coach, result]) => (
          <article className="report-card" key={name}>
            <div className="report-icon"><FileText size={22} /></div>
            <h3>{name}</h3>
            <p>{ai}</p>
            <Insight label={coach} value={result} tone="green" />
            <button className="secondary-button full" type="button">Open Report</button>
          </article>
        ))}
      </div>
      <Panel title="Growth trend">
        <MiniChart wide />
      </Panel>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="split-page">
      <Panel title="Messages">
        <MessageRows />
      </Panel>
      <Panel title="Family profile">
        <ProfileSummary />
      </Panel>
    </div>
  );
}

function CoachPage({ page }) {
  if (page === "roster") return <RosterPage />;
  if (page === "attendance") return <AttendancePage />;
  if (page === "assign") return <AssignTaskPage />;
  if (page === "review") return <ReviewCenterPage />;
  if (page === "coachReports") return <CoachReportsPage />;
  if (page === "coachProfile") return <ProfilePage />;
  return <CoachTodayPage />;
}

function CoachTodayPage() {
  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="Coach dashboard"
        title="Today's classes and review workload"
        text="Coach tools are organized around the day: class prep, roster, attendance, task assignment, and AI review."
      />
      <MetricStrip
        metrics={[
          ["Classes today", "4", "2 courts"],
          ["Students", "42", "5 makeup alerts"],
          ["Videos pending", "18", "7 AI drafts ready"],
          ["Reports to publish", "6", "Due tonight"],
        ]}
      />
      <div className="two-column">
        <Panel title="Class timeline">
          <TimelineRows />
        </Panel>
        <Panel title="Priority queue">
          <Insight label="Mia Chen" value="Free throw draft ready" tone="orange" />
          <Insight label="Alex Morgan" value="Coach note requested" tone="blue" />
          <Insight label="Ethan Patel" value="Absent, makeup needed" tone="red" />
        </Panel>
      </div>
    </div>
  );
}

function RosterPage() {
  return (
    <TablePage
      eyebrow="Class roster"
      title="Student list with readiness signals"
      text="Coaches can scan attendance history, current training focus, and recent progress before class."
      headers={["Student", "Class", "Status", "Progress", "Focus"]}
      rows={students}
    />
  );
}

function AttendancePage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Attendance"
        title="Fast class check-in"
        text="Mark present, late, absent, or makeup needed, then sync status to families and administrators."
      />
      <div className="attendance-grid">
        {students.map(([name, klass, status]) => (
          <article className="attendance-card" key={name}>
            <div>
              <strong>{name}</strong>
              <span>{klass}</span>
            </div>
            <div className="attendance-actions">
              {["Present", "Late", "Absent"].map((item) => (
                <button className={status === item ? "selected" : ""} key={item} type="button">{item}</button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function AssignTaskPage() {
  return (
    <div className="split-page">
      <section>
        <PageHeader
          eyebrow="Assign tasks"
          title="Create trackable homework"
          text="Select drill, class, due date, recording requirements, and coach instructions."
        />
        <div className="task-builder">
          <label className="field"><span>Task title</span><input defaultValue="Layup footwork, 5 attempts" /></label>
          <label className="field"><span>Class</span><input defaultValue="U12 Skills Development" /></label>
          <label className="field"><span>Due date</span><input defaultValue="Aug 15, 2026" /></label>
          <label className="field tall"><span>Coach instruction</span><textarea defaultValue="Record from the right side. Keep both feet visible before takeoff." /></label>
          <button className="primary-button" type="button"><Plus size={18} />Assign to Class</button>
        </div>
      </section>
      <AsidePanel title="Task templates" image={courtImage}>
        <CheckItem label="Shooting release angle" />
        <CheckItem label="Defensive slide timing" />
        <CheckItem label="Dribble control ladder" />
        <CheckItem label="Layup footwork sequence" />
      </AsidePanel>
    </div>
  );
}

function ReviewCenterPage() {
  return (
    <div className="video-layout">
      <section className="video-stage">
        <div className="video-frame">
          <img src={youthImage} alt="Coach video review" />
          <button className="play-button" type="button"><PlayCircle size={34} /></button>
        </div>
      </section>
      <aside className="analysis-panel">
        <p className="eyebrow">AI draft review</p>
        <h2>Free Throw Set Point</h2>
        <Insight label="AI suggestion" value="Raise elbow before release" tone="orange" />
        <Insight label="Coach action" value="Edit before publishing" tone="blue" />
        <label className="field tall"><span>Coach note</span><textarea defaultValue="Good rhythm. Keep the guide hand steady and finish with a higher hold." /></label>
        <div className="button-row">
          <button className="secondary-button" type="button">Hide Suggestion</button>
          <button className="primary-button" type="button"><ShieldCheck size={18} />Publish Report</button>
        </div>
      </aside>
    </div>
  );
}

function CoachReportsPage() {
  return (
    <TablePage
      eyebrow="Published reports"
      title="Feedback history for coach follow-up"
      text="Every published report keeps the AI draft status, coach decision, family view status, and growth signal."
      headers={["Report", "AI Status", "Coach Status", "Family Status"]}
      rows={reports}
    />
  );
}

function AdminPage({ page }) {
  if (page === "courseMgmt") return <AdminCoursesPage />;
  if (page === "scheduleMgmt") return <AdminSchedulePage />;
  if (page === "orders") return <AdminOrdersPage />;
  if (page === "users") return <AdminUsersPage />;
  if (page === "adminReports") return <AdminReportsPage />;
  if (page === "settings") return <AdminSettingsPage />;
  return <AdminOverviewPage />;
}

function AdminOverviewPage() {
  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="Institution overview"
        title="Operate courses, coaches, students, and service quality"
        text="Administrative pages focus on enrollment conversion, class utilization, payment status, coach workload, and report publishing."
      />
      <MetricStrip
        metrics={[
          ["Active students", "286", "+24 this month"],
          ["Monthly revenue", "$48.2K", "+18%"],
          ["Class utilization", "87%", "12 open seats"],
          ["Report SLA", "94%", "Published on time"],
        ]}
      />
      <div className="two-column">
        <Panel title="Operations health">
          <MiniChart wide />
        </Panel>
        <Panel title="Admin alerts">
          <Insight label="Payment" value="4 failed payments need follow-up" tone="red" />
          <Insight label="Scheduling" value="Court B conflict on Aug 16" tone="orange" />
          <Insight label="Coach review" value="12 AI drafts older than 24 hours" tone="blue" />
        </Panel>
      </div>
    </div>
  );
}

function AdminCoursesPage() {
  return <TablePage eyebrow="Course management" title="Programs, pricing, capacity, and publishing" text="Create and manage course offerings, coach assignments, seat limits, and published status." headers={["Course", "Level", "Coach", "Price", "Capacity"]} rows={courses.map((c) => [c.name, c.level, c.coach, c.price, c.seats])} />;
}

function AdminSchedulePage() {
  return <SchedulePage />;
}

function AdminOrdersPage() {
  return <TablePage eyebrow="Orders" title="Enrollment and payment tracking" text="Track paid, pending, refunded, and failed orders across families and courses." headers={["Order", "Family", "Course", "Status", "Amount"]} rows={[["BC-1024", "Morgan Family", "U12 Ball Handling", "Paid", "$279"], ["BC-1025", "Chen Family", "Shooting Form", "Pending", "$349"], ["BC-1026", "Brooks Family", "Elite Footwork", "Failed", "$399"]]} />;
}

function AdminUsersPage() {
  return <TablePage eyebrow="Users" title="Students, parents, coaches, and staff" text="Manage account roles, linked family members, coach permissions, and active status." headers={["Name", "Role", "Linked account", "Status", "Last active"]} rows={[["Alex Morgan", "Student", "Morgan Family", "Active", "Today"], ["Dana Morgan", "Parent", "Alex Morgan", "Active", "Today"], ["Coach Miller", "Coach", "U12 Skills", "Active", "1h ago"], ["Taylor Admin", "Staff", "Operations", "Active", "Yesterday"]]} />;
}

function AdminReportsPage() {
  return <TablePage eyebrow="Reports" title="Service quality and training outcomes" text="Monitor report publishing, AI review backlog, family engagement, and student progress trends." headers={["Metric", "Current", "Target", "Trend", "Owner"]} rows={[["Report publish SLA", "94%", "95%", "+3%", "Coaching"], ["Video upload rate", "78%", "80%", "+6%", "Student success"], ["Parent report views", "83%", "85%", "+8%", "Operations"]]} />;
}

function AdminSettingsPage() {
  return (
    <div className="split-page">
      <Panel title="Institution settings">
        <label className="field"><span>Organization name</span><input defaultValue="Basketball Camp Academy" /></label>
        <label className="field"><span>Default currency</span><input defaultValue="USD" /></label>
        <label className="field"><span>Report review policy</span><input defaultValue="Coach approval required before publish" /></label>
      </Panel>
      <Panel title="Privacy controls">
        <CheckItem label="Hide AI suggestions until coach approval" />
        <CheckItem label="Parent consent required for video upload" />
        <CheckItem label="Staff access limited by role" />
      </Panel>
    </div>
  );
}

function PageHeader({ eyebrow, title, text, action }) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      {action}
    </header>
  );
}

function MetricStrip({ metrics }) {
  return (
    <section className="metric-strip">
      {metrics.map(([label, value, detail]) => (
        <article className="metric-card" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
          <small>{detail}</small>
        </article>
      ))}
    </section>
  );
}

function Panel({ title, action, children }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3>{title}</h3>
        {action && <button className="link-button" type="button">{action}</button>}
      </div>
      {children}
    </section>
  );
}

function AsidePanel({ title, image, children }) {
  return (
    <aside className="aside-card">
      <img src={image} alt="" />
      <h3>{title}</h3>
      <div className="insight-list">{children}</div>
    </aside>
  );
}

function TaskRows({ detailed = false }) {
  const tasks = [
    ["Layup footwork", "Due Friday", "Video required", "In progress"],
    ["Left-hand dribble", "Due Sunday", "3 sets", "Not started"],
    ["Free throw rhythm", "Completed", "AI analyzed", "Coach reviewed"],
  ];
  return (
    <div className="row-list">
      {tasks.map(([name, due, detail, status]) => (
        <div className="data-row" key={name}>
          <div>
            <strong>{name}</strong>
            <span>{due}</span>
          </div>
          {detailed && <span>{detail}</span>}
          <b>{status}</b>
        </div>
      ))}
    </div>
  );
}

function ReminderRows() {
  return (
    <div className="row-list">
      <div className="data-row"><Clock3 size={18} /><div><strong>Class reminder</strong><span>Today 4:30 PM, one hour before class</span></div><b>Scheduled</b></div>
      <div className="data-row"><UploadCloud size={18} /><div><strong>Video upload</strong><span>Layup task due Friday</span></div><b>Open</b></div>
      <div className="data-row"><MessageCircle size={18} /><div><strong>Coach feedback</strong><span>New note from Coach Miller</span></div><b>Unread</b></div>
    </div>
  );
}

function TimelineRows() {
  return (
    <div className="timeline">
      {["3:30 PM Beginner Handles", "5:30 PM U12 Skills", "6:45 PM Shooting Lab", "8:00 PM AI Review Block"].map((item, index) => (
        <div className="timeline-item" key={item}>
          <span>{index + 1}</span>
          <strong>{item}</strong>
          <small>{index === 3 ? "Remote review" : `Court ${index + 1}`}</small>
        </div>
      ))}
    </div>
  );
}

function MessageRows() {
  return (
    <div className="row-list">
      <div className="data-row"><Mail size={18} /><div><strong>Coach Miller</strong><span>Great improvement on balance this week.</span></div><b>New</b></div>
      <div className="data-row"><Mail size={18} /><div><strong>Operations</strong><span>Payment receipt and schedule confirmation.</span></div><b>Read</b></div>
      <div className="data-row"><Mail size={18} /><div><strong>Coach Lee</strong><span>Please upload the shooting drill by Sunday.</span></div><b>Open</b></div>
    </div>
  );
}

function ProfileSummary() {
  return (
    <div className="profile-summary">
      <div className="profile-avatar">AM</div>
      <h3>Alex Morgan</h3>
      <p>U12 Skills Development</p>
      <Insight label="Parent account" value="Dana Morgan" tone="blue" />
      <Insight label="Emergency contact" value="Verified" tone="green" />
      <Insight label="Video consent" value="Active" tone="green" />
    </div>
  );
}

function TablePage({ eyebrow, title, text, headers, rows }) {
  return (
    <div className="page-stack">
      <PageHeader eyebrow={eyebrow} title={title} text={text} />
      <section className="table-card">
        <table>
          <thead>
            <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join("-")}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function MiniChart({ wide = false }) {
  const bars = useMemo(() => [42, 64, 58, 76, 71, 86, 91], []);
  return (
    <div className={`mini-chart ${wide ? "wide" : ""}`}>
      {bars.map((height, index) => (
        <span key={index} style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}

function Insight({ label, value, tone }) {
  return (
    <div className={`insight ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CheckItem({ label }) {
  return (
    <div className="check-item">
      <CheckCircle2 size={18} />
      <span>{label}</span>
    </div>
  );
}

export { App };
