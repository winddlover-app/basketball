<script setup>
import PageHeader from '@/components/ui/PageHeader.vue'
</script>

<template>
  <div class="content-grid two">
    <section class="page-stack">
      <PageHeader eyebrow="Assign Training" title="Create trackable homework" text="Select drill, class, due date, video requirements, and coach instructions." />
      <el-card shadow="never">
        <el-form label-position="top">
          <el-form-item label="Task Title"><el-input model-value="Layup footwork, 5 attempts" /></el-form-item>
          <el-form-item label="Class"><el-select model-value="U12 Skills Development"><el-option label="U12 Skills Development" value="U12 Skills Development" /></el-select></el-form-item>
          <el-form-item label="Due Date"><el-date-picker model-value="2026-08-15" type="date" /></el-form-item>
          <el-form-item label="Coach Instructions"><el-input type="textarea" :rows="5" model-value="Record from the side. Keep both feet visible before takeoff." /></el-form-item>
          <el-button type="primary">Assign to Class</el-button>
        </el-form>
      </el-card>
    </section>
    <el-card shadow="never">
      <template #header>Task Templates</template>
      <el-check-tag checked>Shooting release angle</el-check-tag>
      <el-check-tag checked>Defensive slide timing</el-check-tag>
      <el-check-tag checked>Dribble control ladder</el-check-tag>
      <el-check-tag checked>Layup footwork sequence</el-check-tag>
    </el-card>
  </div>
</template>
