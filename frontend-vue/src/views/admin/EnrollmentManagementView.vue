<script setup>
import { onMounted, shallowRef } from 'vue'
import DataTablePage from '@/components/ui/DataTablePage.vue'
import { adminService } from '@/services/adminService'

const columns = [
  { label: 'Order ID', prop: 'orderId' },
  { label: 'Family', prop: 'family' },
  { label: 'Course', prop: 'course' },
  { label: 'Amount', prop: 'amount' },
  { label: 'Date', prop: 'date' },
  { label: 'Status', prop: 'status', status: true },
]

const rows = shallowRef([])
const loading = shallowRef(false)

onMounted(async () => {
  loading.value = true
  rows.value = await adminService.enrollments()
  loading.value = false
})
</script>

<template>
  <DataTablePage eyebrow="Enrollment Management" title="Enrollment and payment tracking" text="Track paid, pending, refunded, and failed orders across families and courses." :columns="columns" :rows="rows" :loading="loading" />
</template>
