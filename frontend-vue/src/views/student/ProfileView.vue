<script setup>
import PageHeader from '@/components/ui/PageHeader.vue'
</script>

<template>
  <div class="page-stack">
    <PageHeader eyebrow="Profile" title="Family and student profile" text="Manage linked students, contact details, consent status, and notification preferences." />
    <div class="content-grid two">
      <el-card shadow="never">
        <template #header>Student Information</template>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="Student">Alex Morgan</el-descriptions-item>
          <el-descriptions-item label="Age Group">U12</el-descriptions-item>
          <el-descriptions-item label="Current Course">U12 Skills Development</el-descriptions-item>
          <el-descriptions-item label="Video Consent">Active</el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card shadow="never">
        <template #header>Parent Account</template>
        <el-form label-position="top">
          <el-form-item label="Parent Name"><el-input model-value="Dana Morgan" /></el-form-item>
          <el-form-item label="Email"><el-input model-value="dana@example.com" /></el-form-item>
          <el-form-item label="Emergency Contact"><el-input model-value="+1 555 0134" /></el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
