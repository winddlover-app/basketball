<script setup>
import { onMounted, shallowRef } from 'vue'
import DataTablePage from '@/components/ui/DataTablePage.vue'
import { studentService } from '@/services/studentService'

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
  rows.value = await studentService.reports()
  loading.value = false
})
</script>

<template>
  <DataTablePage
    eyebrow="Coach Feedback"
    title="Coach-approved feedback reports"
    text="Parents and students only see AI suggestions after coach approval, edits, or hiding."
    :columns="columns"
    :rows="rows"
    :loading="loading"
  />
</template>
