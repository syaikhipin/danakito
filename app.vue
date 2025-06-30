<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useHead, onErrorCaptured } from '#imports'

// SEO Configuration
useHead({
  title: 'danakito - AI-Powered Investment Analysis',
  meta: [
    { name: 'description', content: 'Make data-driven investment decisions with AI-powered insights and interactive heatmaps' },
    { name: 'keywords', content: 'investment analysis, AI, heatmaps, ROI, real estate, agriculture' },
    { property: 'og:title', content: 'danakito - AI-Powered Investment Analysis' },
    { property: 'og:description', content: 'Make data-driven investment decisions with AI-powered insights' },
    { property: 'og:type', content: 'website' }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'stylesheet', href: '/override.css' }
  ]
})

// Initialize global error handling
onErrorCaptured((error) => {
  console.error('Global error:', error)
  alert('Something went wrong. Please try again.')
})
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
}

/* Force override any gray disabled states */
button[disabled] {
  background-color: inherit !important;
  color: inherit !important;
  cursor: pointer !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}

/* Ensure all buttons are clickable */
.cursor-not-allowed {
  cursor: pointer !important;
}

/* Override gray backgrounds */
.bg-gray-400 {
  background-color: rgb(59 130 246) !important; /* Use blue instead */
}

.bg-gray-100 {
  background-color: white !important;
}

.text-gray-400 {
  color: rgb(55 65 81) !important; /* Use dark gray instead of light gray */
}

/* Ensure pointer events work */
* {
  pointer-events: auto !important;
}

/* Override any disabled styling from external libraries */
[disabled] {
  opacity: 1 !important;
  pointer-events: auto !important;
  cursor: pointer !important;
}
</style> 