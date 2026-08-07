<script setup>
import { onMounted, shallowRef } from 'vue'
import DataTablePage from '@/components/ui/DataTablePage.vue'
import { studentService } from '@/services/studentService'

const columns = [
  { label: 'Task', prop: 'title' },
  { label: 'Due Date', prop: 'dueDate' },
  { label: 'Requirement', prop: 'requirement' },
  { label: 'AI Status', prop: 'aiStatus', status: true },
  { label: 'Coach Status', prop: 'coachStatus', status: true },
]

const rows = shallowRef([])
const loading = shallowRef(false)

onMounted(async () => {
  loading.value = true
  rows.value = await studentService.tasks()
  loading.value = false
})
</script>

<template>
  <DataTablePage
    eyebrow="Training Tasks"
    title="Track assigned homework"
    text="Each task can require a training video, AI analysis, and coach-approved feedback."
    :columns="columns"
    :rows="rows"
    :loading="loading"
  />
</template>
