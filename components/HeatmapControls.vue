<template>
  <div class="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-48">
    <div class="space-y-4">
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Data Layer</h3>
        <div class="space-y-2">
          <UButton
            v-for="option in heatmapOptions"
            :key="option.value"
            @click="selectHeatmapType(option.value)"
            :variant="mapStore.heatmapType === option.value ? 'solid' : 'outline'"
            :color="mapStore.heatmapType === option.value ? 'primary' : 'gray'"
            size="sm"
            class="w-full justify-start"
          >
            <UIcon :name="option.icon" class="mr-2" />
            {{ option.label }}
          </UButton>
        </div>
      </div>
      
      <div class="pt-2 border-t border-gray-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-gray-600">Data Points</span>
          <span class="text-xs font-medium text-gray-900">
            {{ mapStore.heatmapDataFiltered.length }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-600">Last Updated</span>
          <span class="text-xs text-gray-500">
            {{ lastUpdated }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from '~/stores/map'

const mapStore = useMapStore()

const heatmapOptions = [
  {
    value: 'mobility',
    label: 'Foot Traffic',
    icon: 'i-heroicons-users',
    description: 'Pedestrian movement patterns'
  },
  {
    value: 'spending',
    label: 'Spending',
    icon: 'i-heroicons-credit-card',
    description: 'E-wallet transaction data'
  },
  {
    value: 'opportunity',
    label: 'Opportunities',
    icon: 'i-heroicons-star',
    description: 'Investment opportunities'
  }
]

const lastUpdated = computed(() => {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
})

const selectHeatmapType = (type: 'mobility' | 'spending' | 'opportunity') => {
  mapStore.setHeatmapType(type)
}
</script> 