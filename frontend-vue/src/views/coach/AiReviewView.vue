<script setup>
import { ShieldCheck } from 'lucide-vue-next'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatusTag from '@/components/ui/StatusTag.vue'
</script>

<template>
  <div class="content-grid two">
    <section class="page-stack">
      <PageHeader eyebrow="AI Review" title="Approve, edit, or hide AI suggestions" text="AI suggestions remain private until the coach confirms what should be published." />
      <el-card shadow="never">
        <template #header><StatusTag value="Needs Coach Review" /></template>
        <el-alert title="AI Suggestion" description="Raise elbow before release and hold follow-through longer." type="warning" :closable="false" show-icon />
        <el-form label-position="top" class="top-space">
          <el-form-item label="Coach Final Note"><el-input type="textarea" :rows="6" model-value="Good rhythm. Keep the guide hand steady and finish with a higher hold." /></el-form-item>
        </el-form>
        <div class="button-row">
          <el-button>Hide Suggestion</el-button>
          <el-button>Edit Draft</el-button>
          <el-button type="primary"><ShieldCheck :size="18" />Publish Report</el-button>
        </div>
      </el-card>
    </section>
    <el-card shadow="never">
      <template #header>AI Metrics</template>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="Elbow Angle">73 degrees</el-descriptions-item>
        <el-descriptions-item label="Release Height">+8%</el-descriptions-item>
        <el-descriptions-item label="Balance Score">82</el-descriptions-item>
        <el-descriptions-item label="AI Confidence">91%</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>
