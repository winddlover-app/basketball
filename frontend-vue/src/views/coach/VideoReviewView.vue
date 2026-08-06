<script setup>
import { PlayCircle } from 'lucide-vue-next'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatusTag from '@/components/ui/StatusTag.vue'
import { trainingImage } from '@/mocks/campData'
</script>

<template>
  <div class="content-grid two">
    <section class="video-panel">
      <PageHeader eyebrow="Video Review" title="Review student training video" text="Watch uploads, inspect AI status, and move drafts into annotation or coach review." />
      <div class="video-image" :style="{ backgroundImage: `url(${trainingImage})` }">
        <PlayCircle :size="64" />
      </div>
    </section>
    <el-card shadow="never">
      <template #header><StatusTag value="AI Draft Ready" /></template>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="Student">Alex Morgan</el-descriptions-item>
        <el-descriptions-item label="Drill">Layup Footwork</el-descriptions-item>
        <el-descriptions-item label="Upload Status">Uploaded</el-descriptions-item>
        <el-descriptions-item label="AI Confidence">91%</el-descriptions-item>
      </el-descriptions>
      <el-button type="primary" class="top-space">Open Annotation</el-button>
    </el-card>
  </div>
</template>
