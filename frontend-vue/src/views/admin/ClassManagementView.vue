<script setup>
import DataTablePage from '@/components/ui/DataTablePage.vue'

const rows = [
  { classId: 'CL-201', className: 'U12 Skills A', court: 'Court A', coach: 'Coach Miller', time: 'Tue & Thu 5:30 PM', status: 'Active' },
  { classId: 'CL-202', className: 'Shooting Lab Weekend', court: 'Court B', coach: 'Coach Lee', time: 'Sat 10:00 AM', status: 'Open' },
  { classId: 'CL-203', className: 'Elite Footwork', court: 'Court C', coach: 'Coach Carter', time: 'Mon & Wed 6:00 PM', status: 'Waitlist' },
]

const columns = [
  { label: 'Class ID', prop: 'classId' },
  { label: 'Class', prop: 'className' },
  { label: 'Court', prop: 'court' },
  { label: 'Coach', prop: 'coach' },
  { label: 'Time', prop: 'time' },
  { label: 'Status', prop: 'status', status: true },
]
</script>

<template>
  <DataTablePage eyebrow="Class Management" title="Classes, courts, and schedules" text="Plan classes, assign coaches, resolve conflicts, and keep timetables reliable." primary-action="Create Class" :columns="columns" :rows="rows" />
</template>
