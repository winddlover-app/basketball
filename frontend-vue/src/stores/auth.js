import { defineStore } from 'pinia'

const roleHome = {
  student: '/student/dashboard',
  coach: '/coach/dashboard',
  admin: '/admin/dashboard',
}

function inferRoleFromEmail(email) {
  const normalized = email.trim().toLowerCase()
  if (normalized.includes('admin')) return 'admin'
  if (normalized.includes('coach')) return 'coach'
  return 'student'
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
    signIn({ email, remember }) {
      this.email = email
      this.role = inferRoleFromEmail(email)
      this.profileName = this.role === 'coach' ? 'Coach Miller' : this.role === 'admin' ? 'Taylor Admin' : 'Alex Morgan'
      this.token = `mock-token-${Date.now()}`

      if (remember) {
        localStorage.setItem('bc_token', this.token)
        localStorage.setItem('bc_email', this.email)
        localStorage.setItem('bc_role', this.role)
        localStorage.setItem('bc_name', this.profileName)
      }
    },
    register({ name, email }) {
      this.email = email
      this.role = 'student'
      this.profileName = name
      this.token = `mock-token-${Date.now()}`
      localStorage.setItem('bc_token', this.token)
      localStorage.setItem('bc_email', this.email)
      localStorage.setItem('bc_role', this.role)
      localStorage.setItem('bc_name', this.profileName)
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
