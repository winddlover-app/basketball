<script setup>
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { useRouter, RouterLink } from 'vue-router'
import { Mail, LockKeyhole, UserRound } from 'lucide-vue-next'
import { registerSchema } from '@/validators/authSchemas'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const { handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: toTypedSchema(registerSchema),
  initialValues: {
    name: '',
    email: '',
    password: '',
  },
})

const { value: name } = useField('name')
const { value: email } = useField('email')
const { value: password } = useField('password')

const submit = handleSubmit(async (values) => {
  await auth.register(values)
  router.push(auth.homeRoute)
})
</script>

<template>
  <el-card class="auth-card" shadow="never">
    <p class="eyebrow">Create Account</p>
    <h2>Join Basketball Camp</h2>
    <p class="auth-note">Create a family account with email. Staff roles are assigned by the institution.</p>

    <el-form label-position="top" @submit.prevent="submit">
      <el-form-item label="Full Name" :error="errors.name">
        <el-input v-model="name" size="large" placeholder="Alex Morgan">
          <template #prefix><UserRound :size="18" /></template>
        </el-input>
      </el-form-item>
      <el-form-item label="Email" :error="errors.email">
        <el-input v-model="email" type="email" size="large" placeholder="alex@example.com">
          <template #prefix><Mail :size="18" /></template>
        </el-input>
      </el-form-item>
      <el-form-item label="Password" :error="errors.password">
        <el-input v-model="password" type="password" size="large" placeholder="Create password" show-password>
          <template #prefix><LockKeyhole :size="18" /></template>
        </el-input>
      </el-form-item>

      <el-button type="primary" native-type="submit" size="large" class="full-button" :loading="isSubmitting">
        Create Account
      </el-button>
      <RouterLink class="auth-switch" to="/sign-in">Already have an account? Sign in</RouterLink>
    </el-form>
  </el-card>
</template>
