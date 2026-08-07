import { api, unwrap } from './api'

export const studentService = {
  async dashboard() { return unwrap(await api.get('/student/dashboard')) },
  async courses() { return unwrap(await api.get('/student/courses')) },
  async schedule() { return unwrap(await api.get('/student/schedule')) },
  async tasks() { return unwrap(await api.get('/student/training-tasks')) },
  async reports() { return unwrap(await api.get('/student/feedback-reports')) },
  async growthTrends() { return unwrap(await api.get('/student/growth-trends')) },
  async profile() { return unwrap(await api.get('/student/profile')) },
}
