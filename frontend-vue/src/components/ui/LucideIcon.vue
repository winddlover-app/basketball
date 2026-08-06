<script setup>
import * as icons from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 18 },
  strokeWidth: { type: [Number, String], default: 2 },
})

const Icon = computed(() => icons[props.name] || icons.Circle)
</script>

<template>
  <component :is="Icon" :size="size" :stroke-width="strokeWidth" aria-hidden="true" />
</template>
