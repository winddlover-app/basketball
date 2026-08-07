import { api, unwrap } from './api'

export const adminService = {
  async dashboard() { return unwrap(await api.get('/admin/dashboard')) },
  async courses() { return unwrap(await api.get('/admin/courses')) },
  async classes() { return unwrap(await api.get('/admin/classes')) },
  async students() { return unwrap(await api.get('/admin/students')) },
  async coaches() { return unwrap(await api.get('/admin/coaches')) },
  async enrollments() { return unwrap(await api.get('/admin/enrollments')) },
  async trainingTasks() { return unwrap(await api.get('/admin/training-tasks')) },
  async videoAiQueue() { return unwrap(await api.get('/admin/video-ai-queue')) },
  async reports() { return unwrap(await api.get('/admin/reports')) },
  async permissions() { return unwrap(await api.get('/admin/permissions')) },
  async settings() { return unwrap(await api.get('/admin/settings')) },
}
