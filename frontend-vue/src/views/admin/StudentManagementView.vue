<script setup>
import { onMounted, shallowRef } from 'vue'
import DataTablePage from '@/components/ui/DataTablePage.vue'
import { adminService } from '@/services/adminService'

const columns = [
  { label: 'Student', prop: 'name' },
  { label: 'Class', prop: 'className' },
  { label: 'Progress', prop: 'progress' },
  { label: 'Focus', prop: 'focus' },
  { label: 'Status', prop: 'status', status: true },
]

const rows = shallowRef([])
const loading = shallowRef(false)

onMounted(async () => {
  loading.value = true
  rows.value = await adminService.students()
  loading.value = false
})
</script>

<template>
  <DataTablePage eyebrow="Student Management" title="Students and linked parent accounts" text="Manage student profiles, family bindings, consent status, and training participation." primary-action="Add Student" :columns="columns" :rows="rows" :loading="loading" />
</template>
