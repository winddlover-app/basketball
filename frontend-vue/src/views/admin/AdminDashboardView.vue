<script setup>
import { RouterLink } from 'vue-router'
import { CalendarRange, CreditCard } from 'lucide-vue-next'
import PageHeader from '@/components/ui/PageHeader.vue'
import MetricCards from '@/components/ui/MetricCards.vue'
import TrendBars from '@/components/ui/TrendBars.vue'
import StatusTag from '@/components/ui/StatusTag.vue'
import { getDashboardMetrics, getEnrollments, getVideoQueue } from '@/services/mockApi'

const metrics = getDashboardMetrics('admin')
const enrollments = getEnrollments()
const videoQueue = getVideoQueue()
</script>

<template>
  <div class="page-stack">
    <PageHeader eyebrow="Admin Dashboard" title="Operate courses, coaches, students, and service quality" text="Monitor enrollment conversion, class utilization, payment status, coach workload, and AI report publishing.">
      <template #actions>
        <RouterLink to="/admin/enrollment-management"><el-button type="primary"><CreditCard :size="18" />Resolve Payments</el-button></RouterLink>
        <RouterLink to="/admin/class-management"><el-button><CalendarRange :size="18" />Review Schedule</el-button></RouterLink>
      </template>
    </PageHeader>
    <MetricCards :metrics="metrics" />
    <div class="content-grid two">
      <el-card shadow="never">
        <template #header>Operations Health</template>
        <TrendBars />
      </el-card>
      <el-card shadow="never">
        <template #header>Admin Alerts</template>
        <div class="row-list">
          <div v-for="order in enrollments" :key="order.orderId" class="data-row">
            <div>
              <strong>{{ order.orderId }} · {{ order.family }}</strong>
              <span>{{ order.course }} · {{ order.amount }}</span>
            </div>
            <StatusTag :value="order.status" />
          </div>
          <div v-for="item in videoQueue" :key="item.id" class="data-row">
            <div>
              <strong>{{ item.id }} · {{ item.student }}</strong>
              <span>{{ item.drill }} · {{ item.reviewer }}</span>
            </div>
            <StatusTag :value="item.aiStatus" />
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
