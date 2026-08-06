<script setup>
import DataTablePage from '@/components/ui/DataTablePage.vue'
import { getCourses } from '@/services/mockApi'

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
</script>

<template>
  <DataTablePage eyebrow="Course Management" title="Programs, pricing, capacity, and publishing" text="Create, edit, publish, unpublish, and manage basketball training courses." primary-action="Create Course" :columns="columns" :rows="getCourses()" />
</template>
