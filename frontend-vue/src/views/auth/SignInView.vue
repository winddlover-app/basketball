<script setup>
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { Mail, LockKeyhole, LogIn } from 'lucide-vue-next'
import { signInSchema } from '@/validators/authSchemas'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const { handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: toTypedSchema(signInSchema),
  initialValues: {
    email: 'alex@example.com',
    password: 'camp123',
    remember: true,
  },
})

const { value: email } = useField('email')
const { value: password } = useField('password')
const { value: remember } = useField('remember')

const submit = handleSubmit(async (values) => {
  await auth.signIn(values)
  router.push(route.query.redirect || auth.homeRoute)
})
</script>

<template>
  <el-card class="auth-card" shadow="never">
    <p class="eyebrow">Sign In</p>
    <h2>Welcome back</h2>
    <p class="auth-note">Use your email to continue to your training portal.</p>

    <el-form label-position="top" @submit.prevent="submit">
      <el-form-item label="Email" :error="errors.email">
        <el-input v-model="email" type="email" size="large" placeholder="alex@example.com">
          <template #prefix><Mail :size="18" /></template>
        </el-input>
      </el-form-item>
      <el-form-item label="Password" :error="errors.password">
        <el-input v-model="password" type="password" size="large" placeholder="Enter password" show-password>
          <template #prefix><LockKeyhole :size="18" /></template>
        </el-input>
      </el-form-item>

      <div class="form-row">
        <el-checkbox v-model="remember">Remember me</el-checkbox>
        <RouterLink to="/forgot-password">Forgot password?</RouterLink>
      </div>

      <el-button type="primary" native-type="submit" size="large" class="full-button" :loading="isSubmitting">
        <LogIn :size="18" />
        Sign In
      </el-button>

      <RouterLink class="auth-switch" to="/register">New to Basketball Camp? Create an account</RouterLink>
    </el-form>
  </el-card>
</template>
