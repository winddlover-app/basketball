export const heroImage =
  'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1800&q=80'

export const trainingImage =
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1400&q=80'

export const youthImage =
  'https://images.unsplash.com/photo-1518614368389-5160c0b0de72?auto=format&fit=crop&w=1400&q=80'

export const roleMenus = {
  student: [
    { label: 'Dashboard', path: '/student/dashboard', icon: 'LayoutDashboard' },
    { label: 'Courses', path: '/student/courses', icon: 'GraduationCap' },
    { label: 'Schedule', path: '/student/schedule', icon: 'CalendarDays' },
    { label: 'Training Tasks', path: '/student/training-tasks', icon: 'Target' },
    { label: 'Video Upload', path: '/student/video-upload', icon: 'UploadCloud' },
    { label: 'AI Analysis Report', path: '/student/ai-analysis-report', icon: 'Sparkles' },
    { label: 'Coach Feedback', path: '/student/coach-feedback', icon: 'MessageSquareText' },
    { label: 'Growth Trends', path: '/student/growth-trends', icon: 'TrendingUp' },
    { label: 'Profile', path: '/student/profile', icon: 'UserRound' },
  ],
  coach: [
    { label: 'Coach Dashboard', path: '/coach/dashboard', icon: 'LayoutDashboard' },
    { label: 'Today Classes', path: '/coach/today-classes', icon: 'CalendarClock' },
    { label: 'Class Roster', path: '/coach/class-roster', icon: 'UsersRound' },
    { label: 'Attendance', path: '/coach/attendance', icon: 'ClipboardCheck' },
    { label: 'Assign Training', path: '/coach/assign-training', icon: 'ListChecks' },
    { label: 'Video Review', path: '/coach/video-review', icon: 'Video' },
    { label: 'Annotation', path: '/coach/annotation', icon: 'PenLine' },
    { label: 'AI Review', path: '/coach/ai-review', icon: 'ShieldCheck' },
    { label: 'Published Reports', path: '/coach/published-reports', icon: 'FileText' },
    { label: 'Coach Profile', path: '/coach/profile', icon: 'UserRound' },
  ],
  admin: [
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
    { label: 'Course Management', path: '/admin/course-management', icon: 'GraduationCap' },
    { label: 'Class Management', path: '/admin/class-management', icon: 'CalendarRange' },
    { label: 'Student Management', path: '/admin/student-management', icon: 'UsersRound' },
    { label: 'Coach Management', path: '/admin/coach-management', icon: 'BadgeCheck' },
    { label: 'Enrollment Management', path: '/admin/enrollment-management', icon: 'CreditCard' },
    { label: 'Training Task Management', path: '/admin/training-task-management', icon: 'ListChecks' },
    { label: 'Video/AI Queue', path: '/admin/video-ai-queue', icon: 'Bot' },
    { label: 'Report Management', path: '/admin/report-management', icon: 'FileBarChart' },
    { label: 'Permission Management', path: '/admin/permission-management', icon: 'LockKeyhole' },
    { label: 'System Settings', path: '/admin/system-settings', icon: 'Settings' },
  ],
}

export const courses = [
  { id: 'C-101', name: 'U12 Ball Handling Lab', level: 'Beginner', coach: 'Coach Miller', schedule: 'Tue & Thu 5:30 PM', capacity: '18 / 24', price: '$299', status: 'Open' },
  { id: 'C-102', name: 'Shooting Form Builder', level: 'Intermediate', coach: 'Coach Lee', schedule: 'Sat 10:00 AM', capacity: '14 / 20', price: '$349', status: 'Open' },
  { id: 'C-103', name: 'Elite Footwork Camp', level: 'Advanced', coach: 'Coach Carter', schedule: 'Mon & Wed 6:00 PM', capacity: '20 / 20', price: '$399', status: 'Waitlist' },
]

export const students = [
  { name: 'Alex Morgan', className: 'U12 Skills', attendance: 'Present', progress: '86%', focus: 'Layup footwork', status: 'Active' },
  { name: 'Mia Chen', className: 'U12 Skills', attendance: 'Present', progress: '91%', focus: 'Free throw rhythm', status: 'Active' },
  { name: 'Noah Brooks', className: 'Shooting Lab', attendance: 'Late', progress: '76%', focus: 'Release angle', status: 'Needs follow-up' },
  { name: 'Sofia Rivera', className: 'Shooting Lab', attendance: 'Present', progress: '88%', focus: 'Follow through', status: 'Active' },
  { name: 'Ethan Patel', className: 'Elite Footwork', attendance: 'Absent', progress: '69%', focus: 'Makeup needed', status: 'Alert' },
]

export const tasks = [
  { title: 'Layup footwork, 5 attempts', dueDate: 'Aug 15, 2026', requirement: 'Video required', aiStatus: 'Ready for upload', coachStatus: 'Assigned' },
  { title: 'Left-hand dribble ladder', dueDate: 'Aug 17, 2026', requirement: '3 sets', aiStatus: 'Not submitted', coachStatus: 'Assigned' },
  { title: 'Free throw release rhythm', dueDate: 'Completed', requirement: 'AI analyzed', aiStatus: 'AI draft ready', coachStatus: 'Coach reviewed' },
]

export const reports = [
  { title: 'Layup Footwork Review', aiStatus: 'AI Draft', coachStatus: 'Published', familyStatus: 'Viewed', score: 82, trend: '+14% balance' },
  { title: 'Free Throw Set Point', aiStatus: 'Needs Coach Review', coachStatus: 'Draft Hidden', familyStatus: 'Not visible', score: 78, trend: '+8% arc' },
  { title: 'Defensive Slide Timing', aiStatus: 'Analyzed', coachStatus: 'Published', familyStatus: 'Unread', score: 88, trend: '+11% speed' },
]

export const enrollments = [
  { orderId: 'BC-1024', family: 'Morgan Family', course: 'U12 Ball Handling Lab', status: 'Paid', amount: '$279', date: 'Aug 6, 2026' },
  { orderId: 'BC-1025', family: 'Chen Family', course: 'Shooting Form Builder', status: 'Pending', amount: '$349', date: 'Aug 5, 2026' },
  { orderId: 'BC-1026', family: 'Brooks Family', course: 'Elite Footwork Camp', status: 'Failed', amount: '$399', date: 'Aug 4, 2026' },
]

export const videoQueue = [
  { id: 'V-3001', student: 'Mia Chen', drill: 'Free Throw Set Point', uploadStatus: 'Uploaded', aiStatus: 'Analyzing', reviewer: 'Coach Lee' },
  { id: 'V-3002', student: 'Alex Morgan', drill: 'Layup Footwork', uploadStatus: 'Uploaded', aiStatus: 'Draft Ready', reviewer: 'Coach Miller' },
  { id: 'V-3003', student: 'Noah Brooks', drill: 'Release Angle', uploadStatus: 'Processing', aiStatus: 'Waiting', reviewer: 'Coach Lee' },
]
