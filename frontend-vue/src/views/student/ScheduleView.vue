<script setup>
import PageHeader from '@/components/ui/PageHeader.vue'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
</script>

<template>
  <div class="page-stack">
    <PageHeader eyebrow="Schedule" title="Personal class schedule" text="Enrollment generates a personal timetable for students and parents." />
    <section class="calendar-grid">
      <el-card v-for="(day, index) in days" :key="day" shadow="never" class="day-card">
        <strong>{{ day }}</strong>
        <span>Aug {{ 10 + index }}</span>
        <div v-if="index === 1 || index === 3" class="calendar-event">
          <b>U12 Skills</b>
          <small>5:30 PM · Court A</small>
        </div>
        <div v-else-if="index === 5" class="calendar-event blue">
          <b>Shooting Lab</b>
          <small>10:00 AM · Court B</small>
        </div>
        <div v-else class="calendar-empty">Training window</div>
      </el-card>
    </section>
  </div>
</template>
