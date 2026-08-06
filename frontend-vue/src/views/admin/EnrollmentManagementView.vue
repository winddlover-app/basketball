<script setup>
import DataTablePage from '@/components/ui/DataTablePage.vue'
import { getEnrollments } from '@/services/mockApi'

const columns = [
  { label: 'Order ID', prop: 'orderId' },
  { label: 'Family', prop: 'family' },
  { label: 'Course', prop: 'course' },
  { label: 'Amount', prop: 'amount' },
  { label: 'Date', prop: 'date' },
  { label: 'Status', prop: 'status', status: true },
]
</script>

<template>
  <DataTablePage eyebrow="Enrollment Management" title="Enrollment and payment tracking" text="Track paid, pending, refunded, and failed orders across families and courses." :columns="columns" :rows="getEnrollments()" />
</template>
