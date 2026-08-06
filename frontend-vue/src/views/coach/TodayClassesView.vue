<script setup>
import DataTablePage from '@/components/ui/DataTablePage.vue'

const rows = [
  { time: '3:30 PM', className: 'Beginner Handles', court: 'Court A', students: '16', status: 'Open' },
  { time: '5:30 PM', className: 'U12 Skills Development', court: 'Court A', students: '24', status: 'Open' },
  { time: '6:45 PM', className: 'Shooting Lab', court: 'Court B', students: '18', status: 'Pending' },
  { time: '8:00 PM', className: 'AI Review Block', court: 'Remote', students: '12 videos', status: 'Active' },
]

const columns = [
  { label: 'Time', prop: 'time' },
  { label: 'Class', prop: 'className' },
  { label: 'Court', prop: 'court' },
  { label: 'Students', prop: 'students' },
  { label: 'Status', prop: 'status', status: true },
]
</script>

<template>
  <DataTablePage eyebrow="Today Classes" title="Coach class timeline" text="Review courts, rosters, and readiness before each training session." :columns="columns" :rows="rows" />
</template>
