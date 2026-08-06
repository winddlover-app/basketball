<script setup>
import DataTablePage from '@/components/ui/DataTablePage.vue'

const rows = [
  { name: 'Coach Miller', specialty: 'Ball handling', classes: '4', reportsDue: '3', status: 'Active' },
  { name: 'Coach Lee', specialty: 'Shooting form', classes: '3', reportsDue: '5', status: 'Active' },
  { name: 'Coach Carter', specialty: 'Footwork', classes: '2', reportsDue: '1', status: 'Pending' },
]

const columns = [
  { label: 'Coach', prop: 'name' },
  { label: 'Specialty', prop: 'specialty' },
  { label: 'Classes', prop: 'classes' },
  { label: 'Reports Due', prop: 'reportsDue' },
  { label: 'Status', prop: 'status', status: true },
]
</script>

<template>
  <DataTablePage eyebrow="Coach Management" title="Coach profiles and workload" text="Manage coach assignments, specialties, class load, and report review workload." primary-action="Add Coach" :columns="columns" :rows="rows" />
</template>
