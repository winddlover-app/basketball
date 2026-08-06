<script setup>
import { useRouter } from 'vue-router'
import { LockKeyhole } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
</script>

<template>
  <main class="system-page">
    <el-result title="Access Denied" sub-title="This page is not available for your current role.">
      <template #icon><LockKeyhole :size="64" /></template>
      <template #extra>
        <el-button type="primary" @click="router.push(auth.homeRoute)">Back to My Dashboard</el-button>
      </template>
    </el-result>
  </main>
</template>
