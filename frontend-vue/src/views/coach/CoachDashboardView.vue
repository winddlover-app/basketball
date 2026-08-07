<script setup>
import { onMounted, shallowRef } from 'vue'
import { RouterLink } from 'vue-router'
import { ClipboardCheck, ShieldCheck } from 'lucide-vue-next'
import PageHeader from '@/components/ui/PageHeader.vue'
import MetricCards from '@/components/ui/MetricCards.vue'
import StatusTag from '@/components/ui/StatusTag.vue'
import { coachService } from '@/services/coachService'

const metrics = shallowRef([])
const queue = shallowRef([])

onMounted(async () => {
  const data = await coachService.dashboard()
  metrics.value = data.metrics || []
  queue.value = data.reviewQueue || []
})
</script>

<template>
  <div class="page-stack">
    <PageHeader eyebrow="Coach Dashboard" title="Today classes and review workload" text="Coach tools are organized around class delivery, attendance, homework assignment, video review, and report publishing.">
      <template #actions>
        <RouterLink to="/coach/attendance"><el-button type="primary"><ClipboardCheck :size="18" />Start Attendance</el-button></RouterLink>
        <RouterLink to="/coach/ai-review"><el-button><ShieldCheck :size="18" />Review AI Drafts</el-button></RouterLink>
      </template>
    </PageHeader>
    <MetricCards :metrics="metrics" />
    <el-card shadow="never">
      <template #header>Priority Review Queue</template>
      <div class="row-list">
        <div v-for="item in queue" :key="item.id" class="data-row">
          <div>
            <strong>{{ item.student }} · {{ item.drill }}</strong>
            <span>{{ item.uploadStatus }} · Reviewer {{ item.reviewer }}</span>
          </div>
          <StatusTag :value="item.aiStatus" />
        </div>
      </div>
    </el-card>
  </div>
</template>
