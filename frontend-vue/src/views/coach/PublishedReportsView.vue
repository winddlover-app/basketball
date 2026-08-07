<script setup>
import { onMounted, shallowRef } from 'vue'
import DataTablePage from '@/components/ui/DataTablePage.vue'
import { coachService } from '@/services/coachService'

const columns = [
  { label: 'Report', prop: 'title' },
  { label: 'AI Status', prop: 'aiStatus', status: true },
  { label: 'Coach Status', prop: 'coachStatus', status: true },
  { label: 'Family Status', prop: 'familyStatus', status: true },
  { label: 'Trend', prop: 'trend' },
]

const rows = shallowRef([])
const loading = shallowRef(false)

onMounted(async () => {
  loading.value = true
  rows.value = await coachService.publishedReports()
  loading.value = false
})
</script>

<template>
  <DataTablePage eyebrow="Published Reports" title="Coach feedback history" text="Review published reports and family read status." :columns="columns" :rows="rows" :loading="loading" />
</template>
