<script setup>
import { onMounted, shallowRef } from 'vue'
import DataTablePage from '@/components/ui/DataTablePage.vue'
import { adminService } from '@/services/adminService'

const columns = [
  { label: 'Video ID', prop: 'id' },
  { label: 'Student', prop: 'student' },
  { label: 'Drill', prop: 'drill' },
  { label: 'Upload Status', prop: 'uploadStatus', status: true },
  { label: 'AI Status', prop: 'aiStatus', status: true },
  { label: 'Reviewer', prop: 'reviewer' },
]

const rows = shallowRef([])
const loading = shallowRef(false)

onMounted(async () => {
  loading.value = true
  rows.value = await adminService.videoAiQueue()
  loading.value = false
})
</script>

<template>
  <DataTablePage eyebrow="Video/AI Queue" title="Video upload and AI analysis queue" text="Monitor upload progress, async AI processing, reviewer assignment, and stuck jobs." :columns="columns" :rows="rows" :loading="loading" />
</template>
