import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import SignInView from '@/views/auth/SignInView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue'
import AccessDeniedView from '@/views/system/AccessDeniedView.vue'
import NotFoundView from '@/views/system/NotFoundView.vue'

const studentRoutes = [
  ['student-dashboard', '/student/dashboard', 'Dashboard', () => import('@/views/student/StudentDashboardView.vue')],
  ['student-courses', '/student/courses', 'Courses', () => import('@/views/student/CoursesView.vue')],
  ['student-schedule', '/student/schedule', 'Schedule', () => import('@/views/student/ScheduleView.vue')],
  ['student-tasks', '/student/training-tasks', 'Training Tasks', () => import('@/views/student/TrainingTasksView.vue')],
  ['student-upload', '/student/video-upload', 'Video Upload', () => import('@/views/student/VideoUploadView.vue')],
  ['student-ai-report', '/student/ai-analysis-report', 'AI Analysis Report', () => import('@/views/student/AiReportView.vue')],
  ['student-feedback', '/student/coach-feedback', 'Coach Feedback', () => import('@/views/student/CoachFeedbackView.vue')],
  ['student-growth', '/student/growth-trends', 'Growth Trends', () => import('@/views/student/GrowthTrendsView.vue')],
  ['student-profile', '/student/profile', 'Profile', () => import('@/views/student/ProfileView.vue')],
]

const coachRoutes = [
  ['coach-dashboard', '/coach/dashboard', 'Coach Dashboard', () => import('@/views/coach/CoachDashboardView.vue')],
  ['coach-today-classes', '/coach/today-classes', 'Today Classes', () => import('@/views/coach/TodayClassesView.vue')],
  ['coach-roster', '/coach/class-roster', 'Class Roster', () => import('@/views/coach/ClassRosterView.vue')],
  ['coach-attendance', '/coach/attendance', 'Attendance', () => import('@/views/coach/AttendanceView.vue')],
  ['coach-assign-training', '/coach/assign-training', 'Assign Training', () => import('@/views/coach/AssignTrainingView.vue')],
  ['coach-video-review', '/coach/video-review', 'Video Review', () => import('@/views/coach/VideoReviewView.vue')],
  ['coach-annotation', '/coach/annotation', 'Annotation', () => import('@/views/coach/AnnotationView.vue')],
  ['coach-ai-review', '/coach/ai-review', 'AI Review', () => import('@/views/coach/AiReviewView.vue')],
  ['coach-published-reports', '/coach/published-reports', 'Published Reports', () => import('@/views/coach/PublishedReportsView.vue')],
  ['coach-profile', '/coach/profile', 'Coach Profile', () => import('@/views/coach/CoachProfileView.vue')],
]

const adminRoutes = [
  ['admin-dashboard', '/admin/dashboard', 'Admin Dashboard', () => import('@/views/admin/AdminDashboardView.vue')],
  ['admin-courses', '/admin/course-management', 'Course Management', () => import('@/views/admin/CourseManagementView.vue')],
  ['admin-classes', '/admin/class-management', 'Class Management', () => import('@/views/admin/ClassManagementView.vue')],
  ['admin-students', '/admin/student-management', 'Student Management', () => import('@/views/admin/StudentManagementView.vue')],
  ['admin-coaches', '/admin/coach-management', 'Coach Management', () => import('@/views/admin/CoachManagementView.vue')],
  ['admin-enrollments', '/admin/enrollment-management', 'Enrollment Management', () => import('@/views/admin/EnrollmentManagementView.vue')],
  ['admin-task-management', '/admin/training-task-management', 'Training Task Management', () => import('@/views/admin/TrainingTaskManagementView.vue')],
  ['admin-video-ai-queue', '/admin/video-ai-queue', 'Video/AI Queue', () => import('@/views/admin/VideoAiQueueView.vue')],
  ['admin-reports', '/admin/report-management', 'Report Management', () => import('@/views/admin/ReportManagementView.vue')],
  ['admin-permissions', '/admin/permission-management', 'Permission Management', () => import('@/views/admin/PermissionManagementView.vue')],
  ['admin-settings', '/admin/system-settings', 'System Settings', () => import('@/views/admin/SystemSettingsView.vue')],
]

function roleRoutes(routes, role) {
  return routes.map(([name, path, title, component]) => ({
    path,
    name,
    component,
    meta: { requiresAuth: true, role, title },
  }))
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/sign-in',
    },
    {
      path: '/',
      component: AuthLayout,
      children: [
        { path: 'sign-in', name: 'sign-in', component: SignInView, meta: { guest: true, title: 'Sign In' } },
        { path: 'register', name: 'register', component: RegisterView, meta: { guest: true, title: 'Create Account' } },
        { path: 'forgot-password', name: 'forgot-password', component: ForgotPasswordView, meta: { guest: true, title: 'Forgot Password' } },
      ],
    },
    {
      path: '/',
      component: DashboardLayout,
      children: [
        ...roleRoutes(studentRoutes, 'student'),
        ...roleRoutes(coachRoutes, 'coach'),
        ...roleRoutes(adminRoutes, 'admin'),
      ],
    },
    { path: '/access-denied', name: 'access-denied', component: AccessDeniedView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.guest && auth.isAuthenticated) {
    return auth.homeRoute
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'sign-in', query: { redirect: to.fullPath } }
  }

  if (to.meta.role && auth.role !== to.meta.role) {
    return { name: 'access-denied' }
  }

  return true
})
