<script setup>
import { shallowRef } from 'vue'
import { RouterLink } from 'vue-router'
import { Mail } from 'lucide-vue-next'

const email = shallowRef('')
const sent = shallowRef(false)
</script>

<template>
  <el-card class="auth-card" shadow="never">
    <p class="eyebrow">Password Help</p>
    <h2>Reset your password</h2>
    <p class="auth-note">Enter your email and we will send reset instructions.</p>

    <el-alert v-if="sent" title="Reset email sent" type="success" show-icon :closable="false" />
    <el-form v-else label-position="top" @submit.prevent="sent = true">
      <el-form-item label="Email">
        <el-input v-model="email" type="email" size="large" placeholder="alex@example.com">
          <template #prefix><Mail :size="18" /></template>
        </el-input>
      </el-form-item>
      <el-button type="primary" native-type="submit" size="large" class="full-button">Send Reset Link</el-button>
    </el-form>

    <RouterLink class="auth-switch" to="/sign-in">Back to sign in</RouterLink>
  </el-card>
</template>
