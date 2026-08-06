<script setup>
const bars = [44, 62, 58, 72, 69, 84, 91]
</script>

<template>
  <div class="trend-bars" aria-label="Progress trend chart">
    <span v-for="(bar, index) in bars" :key="index" :style="{ height: `${bar}%` }" />
  </div>
</template>
