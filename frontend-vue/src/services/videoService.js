import { api, unwrap } from './api'

export const videoService = {
  async uploadUrl(payload) { return unwrap(await api.post('/videos/upload-url', payload)) },
  async create(payload) { return unwrap(await api.post('/videos', payload)) },
  async status(id) { return unwrap(await api.get(`/videos/${id}/status`)) },
  async detail(id = 1) { return unwrap(await api.get(`/videos/${id}`)) },
  async annotations(id = 1) { return unwrap(await api.get(`/videos/${id}/annotations`)) },
  async createAnnotation(id, payload) { return unwrap(await api.post(`/videos/${id}/annotations`, payload)) },
  async analysisReport(id = 1) { return unwrap(await api.get(`/analysis-reports/${id}`)) },
  async reviewDraft(id = 1) { return unwrap(await api.get(`/reports/${id}/review-draft`)) },
  async saveReview(id, payload) { return unwrap(await api.put(`/reports/${id}/review`, payload)) },
  async publish(id, payload) { return unwrap(await api.post(`/reports/${id}/publish`, payload)) },
}
