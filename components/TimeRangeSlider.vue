<template>
  <div class="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-gray-900">Time Range</h3>
      <div class="flex items-center space-x-2">
        <UButton
          v-for="preset in presets"
          :key="preset.value"
          @click="selectPreset(preset)"
          :variant="selectedPreset === preset.value ? 'solid' : 'outline'"
          :color="selectedPreset === preset.value ? 'primary' : 'gray'"
          size="xs"
        >
          {{ preset.label }}
        </UButton>
      </div>
    </div>
    
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
          <input
            v-model="startDateInput"
            type="date"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @change="updateTimeRange"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">End Date</label>
          <input
            v-model="endDateInput"
            type="date"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @change="updateTimeRange"
          />
        </div>
      </div>
      
      <div class="flex items-center justify-between text-xs text-gray-600">
        <span>{{ formatDate(mapStore.timeRange.start) }}</span>
        <span>{{ daysDifference }} days</span>
        <span>{{ formatDate(mapStore.timeRange.end) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from '~/stores/map'

const mapStore = useMapStore()

const presets = [
  { value: '7d', label: '7D', days: 7 },
  { value: '30d', label: '30D', days: 30 },
  { value: '90d', label: '90D', days: 90 }
]

const selectedPreset = ref('30d')
const startDateInput = ref('')
const endDateInput = ref('')

// Computed
const daysDifference = computed(() => {
  const diffTime = mapStore.timeRange.end.getTime() - mapStore.timeRange.start.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Methods
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const selectPreset = (preset: { value: string, label: string, days: number }) => {
  selectedPreset.value = preset.value
  const end = new Date()
  const start = new Date(end.getTime() - (preset.days * 24 * 60 * 60 * 1000))
  
  mapStore.setTimeRange(start, end)
  updateInputs()
}

const updateTimeRange = () => {
  if (startDateInput.value && endDateInput.value) {
    const start = new Date(startDateInput.value)
    const end = new Date(endDateInput.value)
    
    if (start <= end) {
      mapStore.setTimeRange(start, end)
      selectedPreset.value = ''
    }
  }
}

const updateInputs = () => {
  startDateInput.value = mapStore.timeRange.start.toISOString().split('T')[0]
  endDateInput.value = mapStore.timeRange.end.toISOString().split('T')[0]
}

// Initialize
onMounted(() => {
  updateInputs()
})

// Watch for external changes
watch(() => mapStore.timeRange, () => {
  updateInputs()
}, { deep: true })
</script> 