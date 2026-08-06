<script setup>
import { computed, reactive, shallowRef } from 'vue'
import PageHeader from './PageHeader.vue'
import StatusTag from './StatusTag.vue'
import LucideIcon from './LucideIcon.vue'

const props = defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  text: { type: String, default: '' },
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  primaryAction: { type: String, default: '' },
})

const query = shallowRef('')
const status = shallowRef('All')
const pagination = reactive({ page: 1, size: 8 })

const statusOptions = computed(() => {
  const values = new Set(['All'])
  props.rows.forEach((row) => {
    Object.values(row).forEach((value) => {
      if (typeof value === 'string' && ['Open', 'Active', 'Paid', 'Pending', 'Failed', 'Published', 'Present', 'Late', 'Absent', 'Waitlist'].includes(value)) {
        values.add(value)
      }
    })
  })
  return Array.from(values)
})

const filteredRows = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase()
  return props.rows.filter((row) => {
    const matchesSearch = !normalizedQuery || Object.values(row).some((value) => String(value).toLowerCase().includes(normalizedQuery))
    const matchesStatus = status.value === 'All' || Object.values(row).includes(status.value)
    return matchesSearch && matchesStatus
  })
})

const pagedRows = computed(() => {
  const start = (pagination.page - 1) * pagination.size
  return filteredRows.value.slice(start, start + pagination.size)
})
</script>

<template>
  <div class="page-stack">
    <PageHeader :eyebrow="eyebrow" :title="title" :text="text">
      <template #actions>
        <el-button v-if="primaryAction" type="primary">
          <LucideIcon name="Plus" />
          {{ primaryAction }}
        </el-button>
      </template>
    </PageHeader>

    <section class="table-shell">
      <div class="table-toolbar">
        <el-input v-model="query" clearable placeholder="Search records" class="toolbar-search">
          <template #prefix>
            <LucideIcon name="Search" />
          </template>
        </el-input>
        <el-select v-model="status" class="toolbar-select" placeholder="Status">
          <el-option v-for="option in statusOptions" :key="option" :label="option" :value="option" />
        </el-select>
      </div>

      <el-table :data="pagedRows" stripe height="520" empty-text="No records found">
        <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label" min-width="150">
          <template #default="{ row }">
            <StatusTag v-if="column.status" :value="row[column.prop]" />
            <span v-else>{{ row[column.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="180" fixed="right">
          <template #default>
            <el-button text type="primary">
              <LucideIcon name="Eye" />
              View
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <span>{{ filteredRows.length }} records</span>
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          layout="prev, pager, next"
          :total="filteredRows.length"
        />
      </div>
    </section>
  </div>
</template>
