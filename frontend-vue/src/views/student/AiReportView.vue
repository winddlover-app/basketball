<script setup>
import { Sparkles } from 'lucide-vue-next'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatusTag from '@/components/ui/StatusTag.vue'
import TrendBars from '@/components/ui/TrendBars.vue'
</script>

<template>
  <div class="content-grid two">
    <section class="video-panel">
      <PageHeader eyebrow="AI Analysis Report" title="Layup Footwork AI Draft" text="AI results are preliminary until coach review is complete." />
      <div class="video-placeholder">
        <Sparkles :size="48" />
        <span>Pose analysis preview</span>
      </div>
    </section>
    <el-card shadow="never" class="analysis-card">
      <template #header><StatusTag value="AI Draft" /></template>
      <div class="score-ring">82</div>
      <TrendBars />
      <el-descriptions :column="1" border>
        <el-descriptions-item label="Approach Speed">+12% vs baseline</el-descriptions-item>
        <el-descriptions-item label="Takeoff Foot">Needs coach confirmation</el-descriptions-item>
        <el-descriptions-item label="Body Balance">Stable in 4 of 5 attempts</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>
