<script setup>
import { heroImage } from '@/mocks/campData'
</script>

<template>
  <main class="auth-page">
    <section class="auth-visual" :style="{ backgroundImage: `url(${heroImage})` }">
      <div class="auth-overlay" />
      <div class="auth-brand">
        <span class="brand-mark">BC</span>
        <strong>Basketball Camp</strong>
      </div>
      <div class="auth-copy">
        <p class="eyebrow">Youth training platform</p>
        <h1>Train smarter. Track every step.</h1>
        <p>Course enrollment, video analysis, coach feedback, and growth reporting in one focused portal.</p>
      </div>
    </section>

    <section class="auth-panel">
      <RouterView />
    </section>
  </main>
</template>
