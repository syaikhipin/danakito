<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
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
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
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
</style> 