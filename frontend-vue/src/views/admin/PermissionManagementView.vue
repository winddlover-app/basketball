<script setup>
import PageHeader from '@/components/ui/PageHeader.vue'

const permissions = [
  { module: 'Courses', student: 'View', coach: 'View', admin: 'Manage' },
  { module: 'Attendance', student: 'No Access', coach: 'Manage', admin: 'View' },
  { module: 'AI Review', student: 'View Published', coach: 'Manage Drafts', admin: 'Audit' },
  { module: 'Payments', student: 'Family Orders', coach: 'No Access', admin: 'Manage' },
]
</script>

<template>
  <div class="page-stack">
    <PageHeader eyebrow="Permission Management" title="Role permissions" text="Configure what students, coaches, and administrators can access." />
    <el-card shadow="never">
      <el-table :data="permissions" stripe>
        <el-table-column prop="module" label="Module" />
        <el-table-column prop="student" label="Student / Parent" />
        <el-table-column prop="coach" label="Coach" />
        <el-table-column prop="admin" label="Admin" />
      </el-table>
    </el-card>
  </div>
</template>
