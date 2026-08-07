import { api, unwrap } from './api'

export const coachService = {
  async dashboard() { return unwrap(await api.get('/coach/dashboard')) },
  async todayClasses() { return unwrap(await api.get('/coach/classes/today')) },
  async roster(classId = 1) { return unwrap(await api.get(`/classes/${classId}/roster`)) },
  async attendance(classId = 1) { return unwrap(await api.get(`/classes/${classId}/attendance`)) },
  async saveAttendance(classId, records) { return unwrap(await api.post(`/classes/${classId}/attendance`, { records })) },
  async templates() { return unwrap(await api.get('/training-task-templates')) },
  async assignTraining(payload) { return unwrap(await api.post('/training-tasks/assign', payload)) },
  async reviewQueue() { return unwrap(await api.get('/videos/review-queue')) },
  async publishedReports() { return unwrap(await api.get('/coach/reports/published')) },
  async profile() { return unwrap(await api.get('/coach/profile')) },
}
