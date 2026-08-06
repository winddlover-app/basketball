<script setup>
import DataTablePage from '@/components/ui/DataTablePage.vue'
import { getStudents } from '@/services/mockApi'

const columns = [
  { label: 'Student', prop: 'name' },
  { label: 'Class', prop: 'className' },
  { label: 'Attendance', prop: 'attendance', status: true },
  { label: 'Progress', prop: 'progress' },
  { label: 'Training Focus', prop: 'focus' },
  { label: 'Status', prop: 'status', status: true },
]
</script>

<template>
  <DataTablePage eyebrow="Class Roster" title="Student list with readiness signals" text="Scan attendance history, current focus, and recent progress before class." :columns="columns" :rows="getStudents()" />
</template>
