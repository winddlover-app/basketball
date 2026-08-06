<script setup>
import DataTablePage from '@/components/ui/DataTablePage.vue'
import { getVideoQueue } from '@/services/mockApi'

const columns = [
  { label: 'Video ID', prop: 'id' },
  { label: 'Student', prop: 'student' },
  { label: 'Drill', prop: 'drill' },
  { label: 'Upload Status', prop: 'uploadStatus', status: true },
  { label: 'AI Status', prop: 'aiStatus', status: true },
  { label: 'Reviewer', prop: 'reviewer' },
]
</script>

<template>
  <DataTablePage eyebrow="Video/AI Queue" title="Video upload and AI analysis queue" text="Monitor upload progress, async AI processing, reviewer assignment, and stuck jobs." :columns="columns" :rows="getVideoQueue()" />
</template>
