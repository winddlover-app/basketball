<script setup>
import { onMounted, shallowRef } from 'vue'
import DataTablePage from '@/components/ui/DataTablePage.vue'
import { adminService } from '@/services/adminService'

const columns = [
  { label: 'Report', prop: 'title' },
  { label: 'AI Status', prop: 'aiStatus', status: true },
  { label: 'Coach Status', prop: 'coachStatus', status: true },
  { label: 'Family Status', prop: 'familyStatus', status: true },
  { label: 'Score', prop: 'score' },
  { label: 'Trend', prop: 'trend' },
]

const rows = shallowRef([])
const loading = shallowRef(false)

onMounted(async () => {
  loading.value = true
  rows.value = await adminService.reports()
  loading.value = false
})
</script>

<template>
  <DataTablePage eyebrow="Report Management" title="Training report quality and publishing" text="Audit report publishing, AI review backlog, family engagement, and student progress signals." :columns="columns" :rows="rows" :loading="loading" />
</template>
