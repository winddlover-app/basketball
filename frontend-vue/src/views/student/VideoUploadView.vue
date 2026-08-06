<script setup>
import { shallowRef } from 'vue'
import { UploadCloud, Video } from 'lucide-vue-next'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatusTag from '@/components/ui/StatusTag.vue'

const uploadProgress = shallowRef(68)
</script>

<template>
  <div class="content-grid two">
    <section class="page-stack">
      <PageHeader eyebrow="Video Upload" title="Submit training video" text="Upload a drill video for async AI analysis and coach review." />
      <el-upload drag action="#" :auto-upload="false">
        <UploadCloud class="upload-icon" :size="56" />
        <div class="el-upload__text">Drop video here or <em>click to upload</em></div>
        <template #tip><div class="el-upload__tip">MP4 or MOV, keep full body visible.</div></template>
      </el-upload>
      <el-card shadow="never">
        <template #header>Upload Status</template>
        <el-progress :percentage="uploadProgress" />
        <div class="status-line">
          <StatusTag value="Processing" />
          <span>AI analysis starts after upload completes.</span>
        </div>
      </el-card>
    </section>
    <el-card shadow="never" class="guidance-card">
      <Video :size="42" />
      <h3>Recording Guidance</h3>
      <p>Record from the side and front when possible. Keep feet, hips, shoulders, and shooting hand visible.</p>
      <el-checkbox checked>Parent video consent is active</el-checkbox>
      <el-checkbox checked>AI draft hidden until coach approval</el-checkbox>
    </el-card>
  </div>
</template>
