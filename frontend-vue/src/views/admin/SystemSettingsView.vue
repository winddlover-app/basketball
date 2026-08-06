<script setup>
import PageHeader from '@/components/ui/PageHeader.vue'
</script>

<template>
  <div class="content-grid two">
    <section class="page-stack">
      <PageHeader eyebrow="System Settings" title="Institution configuration" text="Configure organization defaults, review policies, notification settings, and privacy controls." />
      <el-card shadow="never">
        <el-form label-position="top">
          <el-form-item label="Organization Name"><el-input model-value="Basketball Camp Academy" /></el-form-item>
          <el-form-item label="Default Currency"><el-select model-value="USD"><el-option label="USD" value="USD" /></el-select></el-form-item>
          <el-form-item label="Report Review Policy"><el-input model-value="Coach approval required before publish" /></el-form-item>
          <el-form-item label="AI Visibility"><el-switch model-value active-text="Hide AI suggestions until coach approval" /></el-form-item>
        </el-form>
      </el-card>
    </section>
    <el-card shadow="never">
      <template #header>Privacy Controls</template>
      <el-checkbox checked>Parent consent required for video upload</el-checkbox>
      <el-checkbox checked>Coach approval required before publishing AI suggestions</el-checkbox>
      <el-checkbox checked>Staff access limited by role permissions</el-checkbox>
    </el-card>
  </div>
</template>
