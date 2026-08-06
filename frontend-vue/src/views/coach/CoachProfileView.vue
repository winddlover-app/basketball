<script setup>
import PageHeader from '@/components/ui/PageHeader.vue'
</script>

<template>
  <div class="page-stack">
    <PageHeader eyebrow="Coach Profile" title="Coach settings and availability" text="Manage profile details, specialties, and class availability." />
    <el-card shadow="never">
      <el-form label-position="top">
        <el-form-item label="Coach Name"><el-input model-value="Coach Miller" /></el-form-item>
        <el-form-item label="Specialties"><el-input model-value="Ball handling, youth development, layup footwork" /></el-form-item>
        <el-form-item label="Available Courts"><el-input model-value="Court A, Court B" /></el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
