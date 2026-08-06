<script setup>
import DataTablePage from '@/components/ui/DataTablePage.vue'
import { getReports } from '@/services/mockApi'

const columns = [
  { label: 'Report', prop: 'title' },
  { label: 'AI Status', prop: 'aiStatus', status: true },
  { label: 'Coach Status', prop: 'coachStatus', status: true },
  { label: 'Family Status', prop: 'familyStatus', status: true },
  { label: 'Trend', prop: 'trend' },
]
</script>

<template>
  <DataTablePage eyebrow="Published Reports" title="Coach feedback history" text="Review published reports and family read status." :columns="columns" :rows="getReports()" />
</template>
