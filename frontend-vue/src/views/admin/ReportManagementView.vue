<script setup>
import DataTablePage from '@/components/ui/DataTablePage.vue'
import { getReports } from '@/services/mockApi'

const columns = [
  { label: 'Report', prop: 'title' },
  { label: 'AI Status', prop: 'aiStatus', status: true },
  { label: 'Coach Status', prop: 'coachStatus', status: true },
  { label: 'Family Status', prop: 'familyStatus', status: true },
  { label: 'Score', prop: 'score' },
  { label: 'Trend', prop: 'trend' },
]
</script>

<template>
  <DataTablePage eyebrow="Report Management" title="Training report quality and publishing" text="Audit report publishing, AI review backlog, family engagement, and student progress signals." :columns="columns" :rows="getReports()" />
</template>
