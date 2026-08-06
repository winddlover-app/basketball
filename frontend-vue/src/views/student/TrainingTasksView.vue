<script setup>
import DataTablePage from '@/components/ui/DataTablePage.vue'
import { getTasks } from '@/services/mockApi'

const columns = [
  { label: 'Task', prop: 'title' },
  { label: 'Due Date', prop: 'dueDate' },
  { label: 'Requirement', prop: 'requirement' },
  { label: 'AI Status', prop: 'aiStatus', status: true },
  { label: 'Coach Status', prop: 'coachStatus', status: true },
]
</script>

<template>
  <DataTablePage
    eyebrow="Training Tasks"
    title="Track assigned homework"
    text="Each task can require a training video, AI analysis, and coach-approved feedback."
    :columns="columns"
    :rows="getTasks()"
  />
</template>
