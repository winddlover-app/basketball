<script setup>
import DataTablePage from '@/components/ui/DataTablePage.vue'
import { getTasks } from '@/services/mockApi'

const columns = [
  { label: 'Template / Task', prop: 'title' },
  { label: 'Due Date', prop: 'dueDate' },
  { label: 'Requirement', prop: 'requirement' },
  { label: 'AI Status', prop: 'aiStatus', status: true },
  { label: 'Coach Status', prop: 'coachStatus', status: true },
]
</script>

<template>
  <DataTablePage eyebrow="Training Task Management" title="Training task templates and assignments" text="Manage reusable drill templates and active post-class training assignments." primary-action="Create Template" :columns="columns" :rows="getTasks()" />
</template>
