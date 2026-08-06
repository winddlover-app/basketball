<script setup>
import { PenLine } from 'lucide-vue-next'
import PageHeader from '@/components/ui/PageHeader.vue'
</script>

<template>
  <div class="content-grid two">
    <section class="video-panel">
      <PageHeader eyebrow="Annotation" title="Mark key movement moments" text="Add timestamps, coach notes, and visual guidance before publishing feedback." />
      <div class="video-placeholder">
        <PenLine :size="48" />
        <span>Annotation canvas placeholder</span>
      </div>
    </section>
    <el-card shadow="never">
      <template #header>Coach Notes</template>
      <el-form label-position="top">
        <el-form-item label="Timestamp"><el-input model-value="00:14" /></el-form-item>
        <el-form-item label="Marker Type"><el-select model-value="Footwork"><el-option label="Footwork" value="Footwork" /></el-select></el-form-item>
        <el-form-item label="Guidance"><el-input type="textarea" :rows="6" model-value="Plant the outside foot earlier and keep shoulders square to the basket." /></el-form-item>
      </el-form>
      <el-button type="primary">Save Annotation</el-button>
    </el-card>
  </div>
</template>
