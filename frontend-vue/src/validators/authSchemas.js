import * as yup from 'yup'

export const signInSchema = yup.object({
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  remember: yup.boolean(),
})

export const registerSchema = yup.object({
  name: yup.string().min(2, 'Full name is required').required('Full name is required'),
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})
