<script setup>
import PageHeader from '@/components/ui/PageHeader.vue'
import TrendBars from '@/components/ui/TrendBars.vue'
</script>

<template>
  <div class="page-stack">
    <PageHeader eyebrow="Growth Trends" title="Long-term training progress" text="Training records are retained to show skill gains, coach notes, and repeated drill outcomes." />
    <el-card shadow="never">
      <template #header>Performance Trend</template>
      <TrendBars />
      <el-timeline>
        <el-timeline-item timestamp="Aug 6, 2026">Layup balance improved by 14%.</el-timeline-item>
        <el-timeline-item timestamp="Aug 1, 2026">Free throw release became more consistent.</el-timeline-item>
        <el-timeline-item timestamp="Jul 25, 2026">Coach assigned left-hand dribble focus.</el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>
