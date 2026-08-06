<script setup>
import DataTablePage from '@/components/ui/DataTablePage.vue'
import { getStudents } from '@/services/mockApi'

const columns = [
  { label: 'Student', prop: 'name' },
  { label: 'Class', prop: 'className' },
  { label: 'Progress', prop: 'progress' },
  { label: 'Focus', prop: 'focus' },
  { label: 'Status', prop: 'status', status: true },
]
</script>

<template>
  <DataTablePage eyebrow="Student Management" title="Students and linked parent accounts" text="Manage student profiles, family bindings, consent status, and training participation." primary-action="Add Student" :columns="columns" :rows="getStudents()" />
</template>
