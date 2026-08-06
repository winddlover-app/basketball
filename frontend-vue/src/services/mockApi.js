import { courses, enrollments, reports, students, tasks, videoQueue } from '@/mocks/campData'

export function getDashboardMetrics(role) {
  if (role === 'coach') {
    return [
      { label: 'Classes Today', value: '4', detail: '2 courts active' },
      { label: 'Students', value: '42', detail: '5 makeup alerts' },
      { label: 'AI Drafts', value: '18', detail: '7 ready to review' },
      { label: 'Reports Due', value: '6', detail: 'Publish tonight' },
    ]
  }
  if (role === 'admin') {
    return [
      { label: 'Active Students', value: '286', detail: '+24 this month' },
      { label: 'Monthly Revenue', value: '$48.2K', detail: '+18%' },
      { label: 'Utilization', value: '87%', detail: '12 open seats' },
      { label: 'Report SLA', value: '94%', detail: 'Coach approved' },
    ]
  }
  return [
    { label: 'Booked Classes', value: '12', detail: '+2 this month' },
    { label: 'Tasks Done', value: '86%', detail: '+9% vs last camp' },
    { label: 'Coach Reports', value: '5', detail: '2 new comments' },
    { label: 'Shooting Trend', value: '+11%', detail: 'Arc and balance' },
  ]
}

export function getCourses() {
  return courses
}

export function getStudents() {
  return students
}

export function getTasks() {
  return tasks
}

export function getReports() {
  return reports
}

export function getEnrollments() {
  return enrollments
}

export function getVideoQueue() {
  return videoQueue
}
