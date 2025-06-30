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
      console.error('Something went wrong. Please try again.')
})
</script>

<style>
/* Force body and html to allow scrolling */
html,
body {
  font-family: 'Inter', sans-serif;
  overflow-x: auto !important;
  overflow-y: auto !important;
  height: auto !important;
  min-height: 100vh !important;
}

/* Force override any gray disabled states */
button[disabled],
button:disabled,
.disabled,
input[disabled],
select[disabled],
textarea[disabled] {
  background-color: inherit !important;
  color: inherit !important;
  cursor: pointer !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  border: inherit !important;
}

/* Ensure all buttons are clickable */
.cursor-not-allowed {
  cursor: pointer !important;
}

/* Override gray backgrounds */
.bg-gray-400 {
  background-color: rgb(59 130 246) !important; /* Use blue instead */
}

.bg-gray-300 {
  background-color: rgb(147 197 253) !important; /* Light blue */
}

.bg-gray-100 {
  background-color: white !important;
}

.bg-gray-200 {
  background-color: rgb(243 244 246) !important;
}

.text-gray-400 {
  color: rgb(55 65 81) !important; /* Use dark gray instead of light gray */
}

.text-gray-200 {
  color: rgb(31 41 55) !important;
}

/* Ensure pointer events work */
button,
input,
select,
textarea,
.clickable,
[role="button"] {
  pointer-events: auto !important;
}

/* Override any disabled styling from external libraries */
[disabled],
[aria-disabled="true"],
.is-disabled {
  opacity: 1 !important;
  pointer-events: auto !important;
  cursor: pointer !important;
  background-color: inherit !important;
}

/* Override Tailwind disabled utilities */
.disabled\:bg-gray-400 {
  background-color: rgb(59 130 246) !important;
}

.disabled\:text-gray-200 {
  color: white !important;
}

.disabled\:cursor-not-allowed {
  cursor: pointer !important;
}

.disabled\:opacity-50 {
  opacity: 1 !important;
}

/* Ensure all containers allow scrolling */
.overflow-hidden {
  overflow: auto !important;
}

/* Make sure drawing tools and data layer buttons work */
.drawing-tools button,
.data-layer-button,
.leaflet-control button {
  opacity: 1 !important;
  pointer-events: auto !important;
  cursor: pointer !important;
  background-color: white !important;
  color: black !important;
}

/* Force specific elements to be interactive */
.border-gray-300 {
  border-color: rgb(59 130 246) !important;
}
</style> 