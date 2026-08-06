<script setup>
import { RouterLink } from 'vue-router'
import { CalendarDays, MessageSquareText, UploadCloud } from 'lucide-vue-next'
import PageHeader from '@/components/ui/PageHeader.vue'
import MetricCards from '@/components/ui/MetricCards.vue'
import TrendBars from '@/components/ui/TrendBars.vue'
import StatusTag from '@/components/ui/StatusTag.vue'
import { getDashboardMetrics, getTasks, getReports } from '@/services/mockApi'
import { youthImage } from '@/mocks/campData'

const metrics = getDashboardMetrics('student')
const tasks = getTasks()
const reports = getReports()
</script>

<template>
  <div class="page-stack">
    <PageHeader
      eyebrow="Student / Parent Dashboard"
      title="Your training week at a glance"
      text="Track classes, homework videos, AI drafts, coach-approved feedback, and growth trends."
    >
      <template #actions>
        <RouterLink to="/student/video-upload"><el-button type="primary"><UploadCloud :size="18" />Upload Video</el-button></RouterLink>
      </template>
    </PageHeader>

    <section class="hero-panel">
      <div>
        <p class="eyebrow">Next Class</p>
        <h2>U12 Skills Development</h2>
        <p>Today 5:30 PM at Court A with Coach Miller. Bring water, indoor shoes, and last week's dribbling video.</p>
        <div class="quick-row">
          <span><CalendarDays :size="17" /> Homework due Friday</span>
          <span><MessageSquareText :size="17" /> 2 coach notes unread</span>
        </div>
      </div>
      <img :src="youthImage" alt="Youth basketball training" />
    </section>

    <MetricCards :metrics="metrics" />

    <div class="content-grid two">
      <el-card shadow="never">
        <template #header>Active Training Tasks</template>
        <div class="row-list">
          <div v-for="task in tasks" :key="task.title" class="data-row">
            <div>
              <strong>{{ task.title }}</strong>
              <span>{{ task.dueDate }} · {{ task.requirement }}</span>
            </div>
            <StatusTag :value="task.coachStatus" />
          </div>
        </div>
      </el-card>

      <el-card shadow="never">
        <template #header>Growth Snapshot</template>
        <TrendBars />
        <div class="row-list compact">
          <div v-for="report in reports" :key="report.title" class="data-row">
            <div>
              <strong>{{ report.title }}</strong>
              <span>{{ report.trend }}</span>
            </div>
            <StatusTag :value="report.coachStatus" />
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
