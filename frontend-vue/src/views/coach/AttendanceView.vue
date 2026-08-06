<script setup>
import PageHeader from '@/components/ui/PageHeader.vue'
import { getStudents } from '@/services/mockApi'

const students = getStudents()
</script>

<template>
  <div class="page-stack">
    <PageHeader eyebrow="Attendance" title="Fast class check-in" text="Mark present, late, absent, or makeup needed, then sync status to families and administrators." />
    <section class="attendance-grid">
      <el-card v-for="student in students" :key="student.name" shadow="never">
        <strong>{{ student.name }}</strong>
        <span>{{ student.className }} · {{ student.focus }}</span>
        <el-segmented v-model="student.attendance" :options="['Present', 'Late', 'Absent']" />
      </el-card>
    </section>
  </div>
</template>
