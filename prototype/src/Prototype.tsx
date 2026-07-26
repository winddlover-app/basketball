import { useMemo, useState } from "react";
import {
  BackpackIcon,
  BarChartIcon,
  BellIcon,
  CalendarIcon,
  CheckCircledIcon,
  ChevronRightIcon,
  ClockIcon,
  DashboardIcon,
  ExitIcon,
  GearIcon,
  HomeIcon,
  LightningBoltIcon,
  MagicWandIcon,
  MixerHorizontalIcon,
  PersonIcon,
  PlayIcon,
  ReaderIcon,
  RocketIcon,
  UploadIcon,
  VideoIcon,
} from "@radix-ui/react-icons";
import { Carousel, MobileScroll, MobileTextField } from "./mobile";

type Role = "student" | "coach" | "admin";
type Tab = "home" | "courses" | "train" | "reports" | "profile";
type Screen =
  | "login"
  | "home"
  | "courses"
  | "courseDetail"
  | "checkout"
  | "schedule"
  | "train"
  | "taskDetail"
  | "upload"
  | "analysis"
  | "report"
  | "history"
  | "coachToday"
  | "roster"
  | "attendance"
  | "assignTask"
  | "review"
  | "admin"
  | "register"
  | "messages"
  | "profile";

type NavItem = {
  id: Tab;
  label: string;
  icon: React.ElementType;
  screen: Screen;
};

const heroImage =
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=85";
const shootingImage =
  "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=85";
const gymImage =
  "https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&w=1200&q=85";
const courtImage =
  "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=1200&q=85";
const youthTrainingImage =
  "https://unsplash.com/photos/jM0sC7ttmRE/download?force=true&w=1200";

const roles: Array<{ id: Role; label: string; sub: string }> = [
  { id: "student", label: "Student", sub: "Parent view included" },
  { id: "coach", label: "Coach", sub: "Classroom tools" },
  { id: "admin", label: "Admin", sub: "Institution ops" },
];

const navItemsByRole: Record<Role, NavItem[]> = {
  student: [
    { id: "home", label: "Home", icon: HomeIcon, screen: "home" },
    { id: "courses", label: "Courses", icon: BackpackIcon, screen: "courses" },
    { id: "train", label: "Train", icon: LightningBoltIcon, screen: "train" },
    { id: "reports", label: "Reports", icon: BarChartIcon, screen: "report" },
    { id: "profile", label: "Profile", icon: PersonIcon, screen: "profile" },
  ],
  coach: [
    { id: "home", label: "Today", icon: HomeIcon, screen: "coachToday" },
    { id: "courses", label: "Roster", icon: BackpackIcon, screen: "roster" },
    { id: "train", label: "Tasks", icon: LightningBoltIcon, screen: "assignTask" },
    { id: "reports", label: "Review", icon: BarChartIcon, screen: "review" },
    { id: "profile", label: "Profile", icon: PersonIcon, screen: "profile" },
  ],
  admin: [
    { id: "home", label: "Ops", icon: DashboardIcon, screen: "admin" },
    { id: "courses", label: "Courses", icon: BackpackIcon, screen: "courses" },
    { id: "train", label: "Schedule", icon: CalendarIcon, screen: "schedule" },
    { id: "reports", label: "Reports", icon: BarChartIcon, screen: "report" },
    { id: "profile", label: "Profile", icon: PersonIcon, screen: "profile" },
  ],
};

const courses = [
  {
    title: "Elite Handles Camp",
    level: "Ages 9-13",
    price: "$399",
    time: "Mon / Wed 18:30",
    spots: "6 seats left",
    image: heroImage,
  },
  {
    title: "Shooting Lab",
    level: "Intermediate",
    price: "$329",
    time: "Sat 10:00",
    spots: "12 seats left",
    image: shootingImage,
  },
  {
    title: "Vertical & Agility",
    level: "Advanced",
    price: "$299",
    time: "Sun 15:00",
    spots: "Open group",
    image: gymImage,
  },
];

const trainingTasks = [
  { title: "Shot Pocket Form", status: "Due Today", metric: "30 makes", icon: VideoIcon },
  { title: "Weak-hand Control", status: "2 days left", metric: "4 drills", icon: LightningBoltIcon },
  { title: "Footwork Ladder", status: "Coach review", metric: "Uploaded", icon: CheckCircledIcon },
];

const screensByRole: Record<Role, Screen[]> = {
  student: ["home", "courses", "courseDetail", "checkout", "schedule", "train", "taskDetail", "upload", "analysis", "report", "history", "messages", "profile"],
  coach: ["coachToday", "roster", "attendance", "assignTask", "review", "messages", "profile"],
  admin: ["admin", "courses", "schedule", "report", "messages", "profile"],
};

function landingForRole(role: Role): Screen {
  if (role === "coach") return "coachToday";
  if (role === "admin") return "admin";
  return "home";
}

function pageTitle(screen: Screen, role: Role) {
  if (role === "coach" && screen === "home") return "Coach Today";
  if (role === "admin" && screen === "home") return "Operations";
  const titles: Record<Screen, string> = {
    login: "Sign In",
    home: "Basketball Camp",
    courses: "Course Store",
    courseDetail: "Course Detail",
    checkout: "Enrollment",
    schedule: "My Schedule",
    train: "Training",
    taskDetail: "Task Detail",
    upload: "Video Upload",
    analysis: "AI Analysis",
    report: "Feedback Report",
    history: "Growth Trend",
    coachToday: "Coach Today",
    roster: "Class Roster",
    attendance: "Attendance",
    assignTask: "Assign Task",
    review: "Review Center",
    admin: "Ops Dashboard",
    register: "Create Account",
    messages: "Messages",
    profile: "Profile",
  };
  return titles[screen];
}

function Pill({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "hot" | "green" }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

function ActionButton({
  children,
  icon: Icon,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  icon?: React.ElementType;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "dark";
}) {
  return (
    <button className={`action-button ${variant}`} onClick={onClick} type="button">
      {Icon ? <Icon /> : null}
      <span>{children}</span>
    </button>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{sub}</small>
    </div>
  );
}

function Header({
  role,
  screen,
  setScreen,
}: {
  role: Role;
  screen: Screen;
  setScreen: (screen: Screen) => void;
}) {
  return (
    <header className="app-header">
      <div>
        <span className="eyebrow">BASKETBALL CAMP</span>
        <h1>{pageTitle(screen, role)}</h1>
      </div>
      <div className="header-actions">
        <button aria-label="Messages" onClick={() => setScreen("messages")} type="button">
          <BellIcon />
        </button>
        <button aria-label="Settings" onClick={() => setScreen("profile")} type="button">
          <GearIcon />
        </button>
      </div>
    </header>
  );
}

function RoleRail({ role, setRole, setScreen }: { role: Role; setRole: (role: Role) => void; setScreen: (screen: Screen) => void }) {
  return (
    <div className="role-rail" aria-label="Role switcher">
      {roles.map((item) => (
        <button
          className={item.id === role ? "active" : ""}
          key={item.id}
          onClick={() => {
            setRole(item.id);
            setScreen(item.id === "coach" ? "coachToday" : item.id === "admin" ? "admin" : "home");
          }}
          type="button"
        >
          <span>{item.label}</span>
          <small>{item.sub}</small>
        </button>
      ))}
    </div>
  );
}

function BottomNav({ active, items, setScreen }: { active: Tab; items: NavItem[]; setScreen: (screen: Screen) => void }) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            className={item.id === active ? "active" : ""}
            key={item.id}
            onClick={() => setScreen(item.screen)}
            type="button"
          >
            <Icon />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function Hero({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <section className="hero" style={{ backgroundImage: `linear-gradient(180deg, rgba(8,9,16,.1), rgba(8,9,16,.92)), url(${heroImage})` }}>
      <div className="hero-top">
        <Pill tone="hot">82% weekly goal</Pill>
        <Pill>PRO</Pill>
      </div>
      <div className="hero-copy">
        <span className="giant-stat">HIGH IS THE LIMIT</span>
        <h2>Train, upload, get reviewed.</h2>
        <p>Three active tasks, one coach note waiting, and your next class starts at 18:30.</p>
      </div>
      <ActionButton icon={PlayIcon} onClick={() => setScreen("taskDetail")}>
        Start Today's Drill
      </ActionButton>
    </section>
  );
}

function HomeScreen({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <>
      <Hero setScreen={setScreen} />
      <section className="metrics-grid">
        <MetricCard label="Training streak" value="12" sub="days" />
        <MetricCard label="Shot form" value="87" sub="AI score" />
        <MetricCard label="Coach notes" value="4" sub="new" />
      </section>
      <section className="section-block">
        <div className="section-title">
          <h3>Next Class</h3>
          <button onClick={() => setScreen("schedule")} type="button">View all</button>
        </div>
        <article className="class-card" onClick={() => setScreen("schedule")}>
          <CalendarIcon />
          <div>
            <strong>Elite Handles Camp</strong>
            <span>Today, 18:30 - Court 2</span>
          </div>
          <Pill tone="green">Confirmed</Pill>
        </article>
      </section>
      <TaskList setScreen={setScreen} />
    </>
  );
}

function CourseStore({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <>
      <section className="search-row">
        <MobileTextField id="course-search" label="Search" placeholder="Search courses, coach, age group" />
        <button aria-label="Filters" type="button"><MixerHorizontalIcon /></button>
      </section>
      <Carousel ariaLabel="Course categories" className="category-carousel" contentClassName="category-track">
        {["Ball Handling", "Shooting", "Strength", "1-on-1", "Weekend Camp"].map((item, index) => (
          <button className={index === 0 ? "category-chip active" : "category-chip"} key={item} type="button">
            {item}
          </button>
        ))}
      </Carousel>
      <section className="course-list">
        {courses.map((course) => (
          <article className="course-card" key={course.title} onClick={() => setScreen("courseDetail")}>
            <img alt="" src={course.image} />
            <div>
              <Pill>{course.level}</Pill>
              <h3>{course.title}</h3>
              <p>{course.time}</p>
              <div className="card-footer">
                <strong>{course.price}</strong>
                <span>{course.spots}</span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function CourseDetail({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <>
      <section className="detail-media" style={{ backgroundImage: `linear-gradient(180deg, rgba(8,9,16,.08), rgba(8,9,16,.9)), url(${shootingImage})` }}>
        <button aria-label="Preview video" type="button"><PlayIcon /></button>
      </section>
      <section className="detail-panel">
        <Pill tone="hot">8 weeks</Pill>
        <h2>Shooting Lab</h2>
        <p>Build repeatable mechanics with video assignments, AI form checks, and coach-reviewed progress reports.</p>
        <div className="detail-stats">
          <MetricCard label="Sessions" value="16" sub="small group" />
          <MetricCard label="Coach" value="Ava" sub="USAB cert." />
        </div>
        <ActionButton icon={RocketIcon} onClick={() => setScreen("checkout")}>Enroll Now - $329</ActionButton>
      </section>
    </>
  );
}

function Checkout({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <section className="checkout">
      <div className="receipt-card">
        <h2>Confirm Enrollment</h2>
        <div className="line"><span>Course</span><strong>Shooting Lab</strong></div>
        <div className="line"><span>Schedule</span><strong>Sat 10:00</strong></div>
        <div className="line"><span>Student</span><strong>Mason F.</strong></div>
        <div className="total"><span>Total</span><strong>$329</strong></div>
      </div>
      <div className="pay-card">
        <Pill>Saved payment</Pill>
        <h3>Visa ending 0428</h3>
        <p>Receipt and personal class schedule will be generated after payment.</p>
      </div>
      <ActionButton icon={CheckCircledIcon} onClick={() => setScreen("schedule")}>Pay & Generate Schedule</ActionButton>
    </section>
  );
}

function Schedule() {
  return (
    <section className="timeline">
      {[
        ["Today", "Elite Handles Camp", "18:30", "Confirmed"],
        ["Sat, Jul 31", "Shooting Lab", "10:00", "New"],
        ["Sun, Aug 1", "Open Gym Makeup", "15:00", "Pending"],
      ].map(([day, title, time, status]) => (
        <article className="timeline-card" key={`${day}-${title}`}>
          <div className="date-badge">{day}</div>
          <div>
            <h3>{title}</h3>
            <p>{time} - Court 2</p>
          </div>
          <Pill tone={status === "Confirmed" ? "green" : "default"}>{status}</Pill>
        </article>
      ))}
    </section>
  );
}

function TaskList({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <section className="section-block">
      <div className="section-title">
        <h3>Training Tasks</h3>
        <button onClick={() => setScreen("train")} type="button">All</button>
      </div>
      <div className="task-list">
        {trainingTasks.map((task) => {
          const Icon = task.icon;
          return (
            <article className="task-card" key={task.title} onClick={() => setScreen("taskDetail")}>
              <div className="task-icon"><Icon /></div>
              <div>
                <strong>{task.title}</strong>
                <span>{task.status}</span>
              </div>
              <small>{task.metric}</small>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Training({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <>
      <section className="training-feature" style={{ backgroundImage: `linear-gradient(90deg, rgba(9,10,17,.86), rgba(9,10,17,.2)), url(${courtImage})` }}>
        <Pill tone="hot">Coach assigned</Pill>
        <h2>Shot Pocket Form</h2>
        <p>Record 30 makes from three spots. AI checks release angle, balance, and rhythm.</p>
        <ActionButton icon={UploadIcon} onClick={() => setScreen("upload")}>Upload Video</ActionButton>
      </section>
      <TaskList setScreen={setScreen} />
    </>
  );
}

function TaskDetail({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <section className="detail-panel">
      <Pill tone="hot">Due Today</Pill>
      <h2>Shot Pocket Form</h2>
      <p>Use the guide video, then upload one clean take. Keep your full body and rim visible for analysis.</p>
      <div className="drill-steps">
        {["Warm-up: 20 wrist flicks", "Record: 30 makes from corners and wing", "Submit: one video under 3 minutes"].map((step, index) => (
          <div className="step" key={step}>
            <span>{index + 1}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>
      <ActionButton icon={UploadIcon} onClick={() => setScreen("upload")}>Record or Upload</ActionButton>
    </section>
  );
}

function Upload({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <section className="upload-zone">
      <div className="upload-card">
        <UploadIcon />
        <h2>Drop training video here</h2>
        <p>MP4 or MOV. The system will upload, process, and start AI analysis in the background.</p>
      </div>
      <ActionButton icon={MagicWandIcon} onClick={() => setScreen("analysis")}>Simulate Upload Complete</ActionButton>
    </section>
  );
}

function Analysis({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <section className="analysis-screen">
      <div className="analysis-orbit">
        <MagicWandIcon />
        <strong>AI Analysis Running</strong>
      </div>
      <div className="progress-list">
        {["Video uploaded", "Pose tracking", "Shot form metrics", "Coach review queue"].map((item, index) => (
          <div className="progress-row" key={item}>
            <CheckCircledIcon className={index < 3 ? "done" : ""} />
            <span>{item}</span>
          </div>
        ))}
      </div>
      <ActionButton icon={ReaderIcon} onClick={() => setScreen("report")}>Open Draft Report</ActionButton>
    </section>
  );
}

function FeedbackReport({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <>
      <section className="report-hero">
        <div>
          <Pill tone="green">Coach published</Pill>
          <h2>Form Score 87</h2>
          <p>Release is faster and more balanced. Keep your elbow stacked on catch-and-shoot reps.</p>
        </div>
        <BarChartIcon />
      </section>
      <section className="metrics-grid">
        <MetricCard label="Release angle" value="51°" sub="+4° vs last" />
        <MetricCard label="Balance" value="92" sub="stable" />
        <MetricCard label="Makes" value="23/30" sub="77%" />
      </section>
      <section className="coach-note">
        <h3>Coach Ava's Note</h3>
        <p>Your feet are landing square more often. Next week we will add one-dribble pull-ups.</p>
      </section>
      <ActionButton icon={BarChartIcon} onClick={() => setScreen("history")}>View Growth Trend</ActionButton>
    </>
  );
}

function History() {
  return (
    <section className="history">
      <div className="trend-card">
        <h2>Growth Trend</h2>
        <div className="bars" aria-label="Shot form score trend">
          {[58, 64, 72, 69, 78, 87].map((height, index) => (
            <span key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
      {["Shot form improved 15 points in 4 weeks", "Attendance rate is 94%", "Coach feedback published 8 times"].map((item) => (
        <article className="insight-row" key={item}>
          <CheckCircledIcon />
          <span>{item}</span>
        </article>
      ))}
    </section>
  );
}

function CoachToday({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <>
      <section className="coach-hero">
        <Pill tone="hot">3 classes today</Pill>
        <h2>Good afternoon, Coach Ava.</h2>
        <p>Elite Handles starts in 42 minutes. Roster, attendance, tasks, and review queue are ready.</p>
      </section>
      <section className="coach-actions">
        <ActionButton icon={CalendarIcon} onClick={() => setScreen("roster")}>Open Roster</ActionButton>
        <ActionButton icon={CheckCircledIcon} onClick={() => setScreen("attendance")} variant="dark">Take Attendance</ActionButton>
        <ActionButton icon={RocketIcon} onClick={() => setScreen("assignTask")} variant="dark">Assign Task</ActionButton>
        <ActionButton icon={VideoIcon} onClick={() => setScreen("review")} variant="dark">Review Videos</ActionButton>
      </section>
    </>
  );
}

function Roster({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <section className="roster">
      {["Mason F.", "Lena C.", "Noah W.", "Ella Z.", "Jayden P."].map((name, index) => (
        <article className="student-row" key={name}>
          <div className="avatar">{name.slice(0, 1)}</div>
          <div><strong>{name}</strong><span>{index % 2 ? "Parent linked" : "Training streak active"}</span></div>
          <ChevronRightIcon />
        </article>
      ))}
      <ActionButton icon={CheckCircledIcon} onClick={() => setScreen("attendance")}>Start Attendance</ActionButton>
    </section>
  );
}

function Attendance({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <section className="attendance">
      {["Mason F.", "Lena C.", "Noah W.", "Ella Z."].map((name, index) => (
        <article className="attendance-row" key={name}>
          <span>{name}</span>
          <div>
            <button className={index !== 2 ? "selected" : ""} type="button">Present</button>
            <button className={index === 2 ? "selected" : ""} type="button">Leave</button>
          </div>
        </article>
      ))}
      <ActionButton icon={RocketIcon} onClick={() => setScreen("assignTask")}>Save & Assign Homework</ActionButton>
    </section>
  );
}

function AssignTask({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <section className="assign">
      <MobileTextField id="task-title" label="Task title" placeholder="Shot Pocket Form" />
      <div className="template-grid">
        {["Shooting", "Handles", "Footwork", "Strength"].map((item) => (
          <button className={item === "Shooting" ? "selected" : ""} key={item} type="button">{item}</button>
        ))}
      </div>
      <div className="coach-note">
        <h3>Instructions</h3>
        <p>Record 30 makes from corners and wing. Keep full body and rim visible.</p>
      </div>
      <ActionButton icon={VideoIcon} onClick={() => setScreen("review")}>Publish to Class</ActionButton>
    </section>
  );
}

function ReviewCenter({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <section className="review">
      {["Mason F.", "Lena C.", "Jayden P."].map((name, index) => (
        <article className="review-card" key={name}>
          <img alt="" src={index === 1 ? courtImage : shootingImage} />
          <div>
            <Pill tone={index === 0 ? "hot" : "default"}>{index === 0 ? "AI ready" : "Needs review"}</Pill>
            <h3>{name} - Shot Pocket Form</h3>
            <p>AI suggests release angle, balance score, and one improvement note.</p>
            <div className="review-actions">
              <button type="button">Hide Suggestion</button>
              <button onClick={() => setScreen("report")} type="button">Publish</button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

function AdminDashboard({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <>
      <section className="admin-hero">
        <h2>Institution Health</h2>
        <p>Enrollment, orders, active coaches, makeup requests, and review throughput.</p>
      </section>
      <section className="metrics-grid">
        <MetricCard label="Active students" value="428" sub="+18 this month" />
        <MetricCard label="Revenue" value="$42K" sub="July" />
        <MetricCard label="Reports" value="186" sub="published" />
      </section>
      <section className="ops-list">
        {[
          ["Course Management", "12 courses live", "courses"],
          ["Schedule & Makeup", "9 pending requests", "schedule"],
          ["Coach Review SLA", "92% within 24h", "report"],
        ].map(([title, sub, target]) => (
          <article className="ops-row" key={title} onClick={() => setScreen(target as Screen)}>
            <DashboardIcon />
            <div><strong>{title}</strong><span>{sub}</span></div>
            <ChevronRightIcon />
          </article>
        ))}
      </section>
    </>
  );
}

function Messages() {
  return (
    <section className="messages">
      {["Payment receipt generated", "Coach Ava published a new report", "Makeup request approved"].map((message, index) => (
        <article className="message-row" key={message}>
          <BellIcon />
          <div><strong>{message}</strong><span>{index + 1}h ago</span></div>
        </article>
      ))}
    </section>
  );
}

function Login({ setScreen }: { setScreen: (screen: Screen) => void }) {
  return (
    <section className="login">
      <div className="login-hero" style={{ backgroundImage: `linear-gradient(180deg, rgba(8,9,16,.12), rgba(8,9,16,.9)), url(${youthTrainingImage})` }}>
        <h2>Basketball Camp</h2>
      </div>
      <div className="form-stack">
        <MobileTextField id="login-email" label="Email or phone" placeholder="alex@example.com" />
        <MobileTextField id="login-password" label="Password" placeholder="Enter password" />
        <div className="login-options">
          <label>
            <input defaultChecked type="checkbox" />
            <span>Remember me</span>
          </label>
          <button type="button">Forgot password?</button>
        </div>
      </div>
      <ActionButton icon={PersonIcon} onClick={() => setScreen("home")}>
        Sign In
      </ActionButton>
      <button className="signin-link" onClick={() => setScreen("register")} type="button">
        New to Basketball Camp? Create an account
      </button>
    </section>
  );
}

function Register({ role, setRole, setScreen }: { role: Role; setRole: (role: Role) => void; setScreen: (screen: Screen) => void }) {
  return (
    <section className="register">
      <div className="register-hero">
        <Pill tone="hot">New member</Pill>
        <h2>Create your Basketball Camp account</h2>
        <p>Register as a parent, student, coach, or institution operator. The right workspace opens after approval.</p>
      </div>
      <div className="signup-role-grid" aria-label="Account type">
        {roles.map((item) => (
          <button
            className={item.id === role ? "selected" : ""}
            key={item.id}
            onClick={() => setRole(item.id)}
            type="button"
          >
            <strong>{item.label}</strong>
            <span>{item.sub}</span>
          </button>
        ))}
      </div>
      <div className="form-stack">
        <MobileTextField id="signup-name" label="Full name" placeholder="Alex Carter" />
        <MobileTextField id="signup-email" label="Email" placeholder="alex@example.com" />
        <MobileTextField id="signup-phone" label="Phone" placeholder="+1 555 012 0248" />
        <MobileTextField id="signup-password" label="Password" placeholder="Create a password" />
        {role === "student" ? <MobileTextField id="signup-student" label="Student name" placeholder="Mason Carter" /> : null}
        {role === "coach" ? <MobileTextField id="signup-cert" label="Coach credential" placeholder="USAB certificate or experience" /> : null}
        {role === "admin" ? <MobileTextField id="signup-org" label="Organization" placeholder="Basketball Camp Academy" /> : null}
      </div>
      <label className="consent-row">
        <input defaultChecked type="checkbox" />
        <span>I agree to receive course, training, and safety notifications.</span>
      </label>
      <ActionButton icon={CheckCircledIcon} onClick={() => setScreen(landingForRole(role))}>
        Create Account
      </ActionButton>
      <button className="signin-link" onClick={() => setScreen("login")} type="button">
        Already have an account? Sign in
      </button>
    </section>
  );
}

function Profile({ role, setScreen }: { role: Role; setScreen: (screen: Screen) => void }) {
  return (
    <section className="profile">
      <div className="profile-card">
        <div className="avatar big">{role === "coach" ? "A" : role === "admin" ? "O" : "M"}</div>
        <h2>{role === "coach" ? "Coach Ava" : role === "admin" ? "Ops Manager" : "Mason Family"}</h2>
        <p>{role === "student" ? "Parent account with linked student profile" : "Secure institution workspace"}</p>
        <ActionButton icon={PersonIcon} onClick={() => setScreen("register")} variant="dark">Create New Account</ActionButton>
        <ActionButton icon={ExitIcon} onClick={() => setScreen("login")} variant="ghost">Sign Out</ActionButton>
      </div>
      {["Account Details", "Linked Students", "Payment Methods", "Privacy & Consent", "Support"].map((item) => (
        <article className="ops-row" key={item}>
          <PersonIcon />
          <div><strong>{item}</strong><span>Manage settings</span></div>
          <ChevronRightIcon />
        </article>
      ))}
    </section>
  );
}

export default function Prototype() {
  const [role, setRole] = useState<Role>("student");
  const [screen, setScreen] = useState<Screen>("login");

  const activeTab: Tab = useMemo(() => {
    if (role === "coach") {
      if (["roster", "attendance"].includes(screen)) return "courses";
      if (["assignTask", "train", "taskDetail", "upload", "analysis"].includes(screen)) return "train";
      if (["review", "report", "history"].includes(screen)) return "reports";
      if (["profile", "messages", "register", "login"].includes(screen)) return "profile";
      return "home";
    }
    if (role === "admin") {
      if (["courses", "courseDetail", "checkout"].includes(screen)) return "courses";
      if (screen === "schedule") return "train";
      if (["report", "history", "review"].includes(screen)) return "reports";
      if (["profile", "messages", "register", "login"].includes(screen)) return "profile";
      return "home";
    }
    if (["courses", "courseDetail", "checkout"].includes(screen)) return "courses";
    if (["schedule", "train", "taskDetail", "upload", "analysis"].includes(screen)) return "train";
    if (["report", "history", "review"].includes(screen)) return "reports";
    if (["profile", "messages", "register", "login"].includes(screen)) return "profile";
    return "home";
  }, [role, screen]);

  const visibleScreens = screensByRole[role];
  const navItems = navItemsByRole[role];
  const isAuthScreen = screen === "login" || screen === "register";

  const content = (() => {
    if (screen === "login") return <Login setScreen={setScreen} />;
    if (role === "coach" && screen === "home") return <CoachToday setScreen={setScreen} />;
    if (role === "admin" && screen === "home") return <AdminDashboard setScreen={setScreen} />;
    switch (screen) {
      case "home":
        return <HomeScreen setScreen={setScreen} />;
      case "courses":
        return <CourseStore setScreen={setScreen} />;
      case "courseDetail":
        return <CourseDetail setScreen={setScreen} />;
      case "checkout":
        return <Checkout setScreen={setScreen} />;
      case "schedule":
        return <Schedule />;
      case "train":
        return <Training setScreen={setScreen} />;
      case "taskDetail":
        return <TaskDetail setScreen={setScreen} />;
      case "upload":
        return <Upload setScreen={setScreen} />;
      case "analysis":
        return <Analysis setScreen={setScreen} />;
      case "report":
        return <FeedbackReport setScreen={setScreen} />;
      case "history":
        return <History />;
      case "coachToday":
        return <CoachToday setScreen={setScreen} />;
      case "roster":
        return <Roster setScreen={setScreen} />;
      case "attendance":
        return <Attendance setScreen={setScreen} />;
      case "assignTask":
        return <AssignTask setScreen={setScreen} />;
      case "review":
        return <ReviewCenter setScreen={setScreen} />;
      case "admin":
        return <AdminDashboard setScreen={setScreen} />;
      case "register":
        return <Register role={role} setRole={setRole} setScreen={setScreen} />;
      case "messages":
        return <Messages />;
      case "profile":
        return <Profile role={role} setScreen={setScreen} />;
    }
  })();

  return (
    <div className="app-shell">
      <MobileScroll className="app-screen">
        {isAuthScreen ? null : (
          <>
            <Header role={role} screen={screen} setScreen={setScreen} />
            <Carousel ariaLabel="Prototype pages" className="screen-carousel" contentClassName="screen-track">
              {visibleScreens.map((item) => (
                <button className={screen === item ? "screen-chip active" : "screen-chip"} key={item} onClick={() => setScreen(item)} type="button">
                  {pageTitle(item, role)}
                </button>
              ))}
            </Carousel>
          </>
        )}
        <main className={isAuthScreen ? "screen-content auth-content" : "screen-content"} data-testid="basketball-prototype">
          {content}
        </main>
        {isAuthScreen ? null : <BottomNav active={activeTab} items={navItems} setScreen={setScreen} />}
      </MobileScroll>
    </div>
  );
}
