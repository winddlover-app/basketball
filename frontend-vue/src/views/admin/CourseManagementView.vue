<script setup>
import { onMounted, shallowRef } from 'vue'
import DataTablePage from '@/components/ui/DataTablePage.vue'
import { adminService } from '@/services/adminService'

const columns = [
  { label: 'Course ID', prop: 'id' },
  { label: 'Course', prop: 'name' },
  { label: 'Level', prop: 'level' },
  { label: 'Coach', prop: 'coach' },
  { label: 'Schedule', prop: 'schedule' },
  { label: 'Capacity', prop: 'capacity' },
  { label: 'Price', prop: 'price' },
  { label: 'Status', prop: 'status', status: true },
]

const rows = shallowRef([])
const loading = shallowRef(false)

onMounted(async () => {
  loading.value = true
  rows.value = await adminService.courses()
  loading.value = false
})
</script>

<template>
  <DataTablePage eyebrow="Course Management" title="Programs, pricing, capacity, and publishing" text="Create, edit, publish, unpublish, and manage basketball training courses." primary-action="Create Course" :columns="columns" :rows="rows" :loading="loading" />
</template>
