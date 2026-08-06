<script setup>
import PageHeader from '@/components/ui/PageHeader.vue'
import StatusTag from '@/components/ui/StatusTag.vue'
import { getCourses } from '@/services/mockApi'

const courses = getCourses()
</script>

<template>
  <div class="page-stack">
    <PageHeader eyebrow="Courses" title="Browse basketball training programs" text="Compare levels, schedules, coaches, capacity, and enrollment status." />
    <div class="filter-card">
      <el-input placeholder="Search courses" />
      <el-select model-value="All Levels"><el-option label="All Levels" value="All Levels" /></el-select>
      <el-button type="primary">Search</el-button>
    </div>
    <div class="course-grid">
      <el-card v-for="course in courses" :key="course.id" shadow="never" class="course-card">
        <div class="course-card-top">
          <StatusTag :value="course.status" />
          <strong>{{ course.price }}</strong>
        </div>
        <h3>{{ course.name }}</h3>
        <p>{{ course.level }} · {{ course.schedule }}</p>
        <div class="course-meta">
          <span>Coach</span><strong>{{ course.coach }}</strong>
          <span>Capacity</span><strong>{{ course.capacity }}</strong>
        </div>
        <el-button type="primary" plain>View Details</el-button>
      </el-card>
    </div>
  </div>
</template>
