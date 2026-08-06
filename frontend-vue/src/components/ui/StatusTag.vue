<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: String, required: true },
})

const tagType = computed(() => {
  const value = props.value.toLowerCase()
  if (value.includes('failed') || value.includes('alert') || value.includes('absent')) return 'danger'
  if (value.includes('pending') || value.includes('wait') || value.includes('draft') || value.includes('late')) return 'warning'
  if (value.includes('paid') || value.includes('published') || value.includes('active') || value.includes('present') || value.includes('open')) return 'success'
  return 'info'
})
</script>

<template>
  <el-tag :type="tagType" effect="light" round>{{ value }}</el-tag>
</template>
