<script setup>
import { onMounted, shallowRef } from 'vue'
import DataTablePage from '@/components/ui/DataTablePage.vue'
import { adminService } from '@/services/adminService'

const columns = [
  { label: 'Template / Task', prop: 'title' },
  { label: 'Due Date', prop: 'dueDate' },
  { label: 'Requirement', prop: 'requirement' },
  { label: 'AI Status', prop: 'aiStatus', status: true },
  { label: 'Coach Status', prop: 'coachStatus', status: true },
]

const rows = shallowRef([])
const loading = shallowRef(false)

onMounted(async () => {
  loading.value = true
  rows.value = await adminService.trainingTasks()
  loading.value = false
})
</script>

<template>
  <DataTablePage eyebrow="Training Task Management" title="Training task templates and assignments" text="Manage reusable drill templates and active post-class training assignments." primary-action="Create Template" :columns="columns" :rows="rows" :loading="loading" />
</template>
