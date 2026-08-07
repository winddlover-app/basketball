import { api, unwrap } from './api'

export const authService = {
  async login(payload) {
    return unwrap(await api.post('/auth/login', payload))
  },
  async register(payload) {
    return unwrap(await api.post('/auth/register', payload))
  },
  async forgotPassword(payload) {
    return unwrap(await api.post('/auth/forgot-password', payload))
  },
  async me() {
    return unwrap(await api.get('/auth/me'))
  },
}
