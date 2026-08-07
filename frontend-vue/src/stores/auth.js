import { defineStore } from 'pinia'
import { authService } from '@/services/authService'

const roleHome = {
  student: '/student/dashboard',
  coach: '/coach/dashboard',
  admin: '/admin/dashboard',
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('bc_token') || '',
    email: localStorage.getItem('bc_email') || '',
    role: localStorage.getItem('bc_role') || 'student',
    profileName: localStorage.getItem('bc_name') || 'Alex Morgan',
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    homeRoute: (state) => roleHome[state.role] || roleHome.student,
    roleLabel: (state) => ({
      student: 'Student / Parent',
      coach: 'Coach',
      admin: 'Administrator',
    }[state.role]),
    initials: (state) => state.profileName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
  },
  actions: {
    persistSession(remember = true) {
      if (!remember) return

      localStorage.setItem('bc_token', this.token)
      localStorage.setItem('bc_email', this.email)
      localStorage.setItem('bc_role', this.role)
      localStorage.setItem('bc_name', this.profileName)
    },
    applyAuthResult(result, remember = true) {
      this.token = result.token
      this.email = result.user.email
      this.role = result.user.role
      this.profileName = result.user.name
      this.persistSession(remember)
    },
    async signIn(values) {
      const result = await authService.login(values)
      this.applyAuthResult(result, values.remember)
    },
    async register(values) {
      const result = await authService.register(values)
      this.applyAuthResult(result, true)
    },
    async loadMe() {
      if (!this.token) return
      const user = await authService.me()
      this.email = user.email
      this.role = user.role
      this.profileName = user.name
      this.persistSession(true)
    },
    signOut() {
      this.token = ''
      this.email = ''
      this.role = 'student'
      this.profileName = 'Alex Morgan'
      localStorage.removeItem('bc_token')
      localStorage.removeItem('bc_email')
      localStorage.removeItem('bc_role')
      localStorage.removeItem('bc_name')
    },
  },
})
