<template>
  <div class="h-full w-full relative">
    <div id="map" ref="mapContainer" class="h-full w-full"></div>
    
    <!-- Layer Legend -->
    <div v-show="props.heatmapType" class="absolute top-4 right-16 bg-white/90 rounded-lg shadow-lg px-4 py-3 z-[1002] min-w-[240px]">
      <div v-if="props.heatmapType === 'mobility'">
        <div class="font-bold text-blue-700 mb-1">Mobility Data</div>
        <div class="flex items-center space-x-2 mb-1">
          <span class="inline-block w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs"><svg xmlns='http://www.w3.org/2000/svg' class='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 16V7a4 4 0 10-8 0v9m8 0a4 4 0 108 0V7a4 4 0 10-8 0v9z' /></svg></span>
          <span class="text-sm text-gray-700">High Foot Traffic</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="inline-block w-5 h-5 rounded bg-blue-200 border border-blue-400"></span>
          <span class="text-sm text-gray-700">Low Foot Traffic</span>
        </div>
      </div>
      <div v-else-if="props.heatmapType === 'spending'">
        <div class="font-bold text-orange-700 mb-1">Spending Patterns</div>
        <div class="flex items-center space-x-2 mb-1">
          <span class="inline-block w-5 h-5 bg-orange-500 flex items-center justify-center text-white text-xs"><svg xmlns='http://www.w3.org/2000/svg' class='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'><text x='2' y='15' font-size='14' font-family='Arial' fill='white'>$</text></svg></span>
          <span class="text-sm text-gray-700">High Transaction Volume</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="inline-block w-5 h-5 bg-orange-200 border border-orange-400"></span>
          <span class="text-sm text-gray-700">Low Transaction Volume</span>
        </div>
      </div>
      <div v-else-if="props.heatmapType === 'opportunity'">
        <div class="font-bold text-green-700 mb-1">Investment Opportunities</div>
        <div class="flex items-center space-x-2 mb-1">
          <span class="inline-block w-5 h-5 text-green-600 flex items-center justify-center"><svg xmlns='http://www.w3.org/2000/svg' class='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'><polygon points='10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8'/></svg></span>
          <span class="text-sm text-gray-700">High Opportunity Score</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="inline-block w-5 h-5 text-green-400 flex items-center justify-center"><svg xmlns='http://www.w3.org/2000/svg' class='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'><polygon points='10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8'/></svg></span>
          <span class="text-sm text-gray-700">Moderate Opportunity</span>
        </div>
      </div>
      <div v-else-if="props.heatmapType === 'demographics'">
        <div class="font-bold text-purple-700 mb-1">Demographics</div>
        <div class="flex items-center space-x-2 mb-1">
          <span class="inline-block w-5 h-5 bg-purple-500 rounded-sm"></span>
          <span class="text-sm text-gray-700">High Population Density</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="inline-block w-5 h-5 bg-purple-200 rounded-sm border border-purple-400"></span>
          <span class="text-sm text-gray-700">Low Population Density</span>
        </div>
      </div>
    </div>
    
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2 mx-auto"></div>
        <p class="text-sm text-gray-600">Loading map...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue'

// Props
const props = defineProps<{
  heatmapType?: 'mobility' | 'spending' | 'opportunity' | 'demographics',
  mobilityData?: Array<{ lat: number, lng: number, intensity: number }>,
  spendingData?: Array<{ lat: number, lng: number, amount: number }>,
  opportunityData?: Array<{ lat: number, lng: number, score: number }>,
  demographicsData?: Array<{ lat: number, lng: number, population: number, avgIncome: number }>,
  initialCenter?: [number, number],
  initialZoom?: number,
  showCenterMarker?: boolean
}>()

// Emits
const emit = defineEmits<{
  'area-selected': [area: any]
  'map-ready': []
}>()

// State
const mapContainer = ref<HTMLElement>()
const map = ref<any>()
const isLoading = ref(true)
const drawnItems = ref<any>()

// Type declaration for custom overlays on window
declare global {
  interface Window {
    _danakitoOverlays?: any[]
  }
}

// Initialize map when component mounts
onMounted(() => {
  nextTick(() => {
    initializeMap()
  })
})

// Initialize map
const initializeMap = async () => {
  if (!mapContainer.value) return

  try {
    // Dynamic import of Leaflet for client-side only
    const L = await import('leaflet')
    const leafletDraw = await import('leaflet-draw')

    // Fix default marker icons
    delete (L.default.Icon.Default.prototype as any)._getIconUrl
    L.default.Icon.Default.mergeOptions({
      iconRetinaUrl: '/marker-icon-2x.png',
      iconUrl: '/marker-icon.png',
      shadowUrl: '/marker-shadow.png',
    })

    // Create map instance centered on New York City
    map.value = L.default.map(mapContainer.value, {
      center: props.initialCenter || [40.7128, -74.0060], // NYC coordinates
      zoom: props.initialZoom || 12,
      zoomControl: false
    })

    // Add tile layer (OpenStreetMap)
    L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map.value)

    // Add zoom control in bottom right
    L.default.control.zoom({
      position: 'bottomright'
    }).addTo(map.value)

    // Add a marker for the initial center if requested
    if (props.showCenterMarker && props.initialCenter) {
      L.default.marker(props.initialCenter)
        .addTo(map.value)
        .bindPopup('Analysis Location')
        .openPopup()
    }

    // Initialize drawing functionality
    initializeDrawing(L.default)

    isLoading.value = false
    emit('map-ready')
    
    console.log('🗺️ Map initialized successfully at NYC coordinates')
  } catch (error) {
    console.error('Error initializing map:', error)
    isLoading.value = false
  }
}

// Initialize drawing controls
const initializeDrawing = (L: any) => {
  if (!map.value) return

  try {
    // Create feature group for drawn items
    drawnItems.value = new L.FeatureGroup()
    map.value.addLayer(drawnItems.value)

    // Drawing control options
    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false,
          drawError: {
            color: '#e1e100',
            message: '<strong>Error:</strong> shape edges cannot cross!'
          },
          shapeOptions: {
            color: '#3b82f6',
            weight: 2,
            fillOpacity: 0.2
          }
        },
        rectangle: {
          shapeOptions: {
            color: '#3b82f6',
            weight: 2,
            fillOpacity: 0.2
          }
        },
        circle: {
          shapeOptions: {
            color: '#3b82f6',
            weight: 2,
            fillOpacity: 0.2
          }
        },
        marker: {
          icon: new L.Icon({
            iconUrl: '/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41]
          })
        },
        polyline: false,
        circlemarker: false
      },
      edit: {
        featureGroup: drawnItems.value,
        remove: true
      }
    })

    map.value.addControl(drawControl)

    // Handle drawing events
    map.value.on(L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer
      drawnItems.value?.addLayer(layer)
      
      // Convert to GeoJSON and emit
      const geoJSON = layer.toGeoJSON()
      emit('area-selected', geoJSON)
      console.log('✏️ Area drawn and selected')
    })

    map.value.on(L.Draw.Event.EDITED, (event: any) => {
      const layers = event.layers
      layers.eachLayer((layer: any) => {
        const geoJSON = layer.toGeoJSON()
        emit('area-selected', geoJSON)
      })
    })

    map.value.on(L.Draw.Event.DELETED, () => {
      console.log('🗑️ Drawing deleted')
    })

    console.log('✏️ Drawing tools initialized')
  } catch (error) {
    console.error('Error initializing drawing tools:', error)
  }
}

// Add sample heatmap points for demonstration
const addSampleHeatmap = () => {
  if (!map.value) return

  try {
    const L = window.L || (window as any).leaflet
    if (!L) return

    // Sample data points around NYC
    const samplePoints = [
      { lat: 40.7589, lng: -73.9851, intensity: 0.8 }, // Times Square
      { lat: 40.7505, lng: -73.9934, intensity: 0.9 }, // Empire State
      { lat: 40.7061, lng: -74.0087, intensity: 0.7 }, // Wall Street
      { lat: 40.7829, lng: -73.9654, intensity: 0.6 }, // Central Park
      { lat: 40.6892, lng: -74.0445, intensity: 0.5 }, // Statue of Liberty area
    ]

    samplePoints.forEach(point => {
      const circle = L.circleMarker([point.lat, point.lng], {
        radius: Math.max(8, point.intensity * 20),
        fillColor: getHeatmapColor(point.intensity),
        color: getHeatmapColor(point.intensity),
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.5
      })

      circle.bindPopup(`
        <div class="p-2">
          <h4 class="font-semibold text-sm">Investment Opportunity</h4>
          <p class="text-xs">Score: ${(point.intensity * 100).toFixed(1)}%</p>
          <p class="text-xs">Location: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</p>
        </div>
      `)

      circle.addTo(map.value)
    })

    console.log('📊 Sample heatmap data added')
  } catch (error) {
    console.error('Error adding sample heatmap:', error)
  }
}

// Get color based on intensity (0-1)
const getHeatmapColor = (intensity: number): string => {
  if (intensity < 0.2) return '#3b82f6' // Blue
  if (intensity < 0.4) return '#06b6d4' // Cyan
  if (intensity < 0.6) return '#10b981' // Green
  if (intensity < 0.8) return '#f59e0b' // Yellow
  return '#ef4444' // Red
}

// Add sample data when map is ready
watch(() => isLoading.value, (newValue) => {
  if (!newValue && map.value) {
    setTimeout(() => {
      addSampleHeatmap()
    }, 1000)
  }
})

// Cleanup
onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})

watch(() => props.heatmapType, (newType, oldType) => {
  if (!map.value) return
  clearAllOverlays()
  if (newType === 'mobility') addMobilityOverlay()
  else if (newType === 'spending') addSpendingOverlay()
  else if (newType === 'opportunity') addOpportunityOverlay()
  else if (newType === 'demographics') addDemographicsOverlay()
})

function clearAllOverlays() {
  // Remove all custom overlays from the map
  if (map.value && map.value._overlays) {
    map.value._overlays.forEach((layer: any) => map.value.removeLayer(layer))
    map.value._overlays = []
  }
  // Remove legacy overlays if any
  if (window._danakitoOverlays) {
    window._danakitoOverlays.forEach((layer: any) => map.value.removeLayer(layer))
    window._danakitoOverlays = []
  }
}

function addMobilityOverlay() {
  if (!map.value) return
  const L = window.L || (window as any).leaflet
  if (!L) return
  // Use mobilityData from props, fallback to empty array
  const points = props.mobilityData || []
  window._danakitoOverlays = points.map(point => {
    const circle = L.circleMarker([point.lat, point.lng], {
      radius: Math.max(8, point.intensity * 20),
      fillColor: '#3b82f6',
      color: '#3b82f6',
      weight: 2,
      opacity: 0.7,
      fillOpacity: 0.5
    }).addTo(map.value)
    circle.on('click', () => {
      circle.bindPopup(`<b>Foot Traffic:</b> ${point.intensity}`).openPopup()
    })
    return circle
  })
}

function addSpendingOverlay() {
  if (!map.value) return
  const L = window.L || (window as any).leaflet
  if (!L) return
  // Use spendingData from props, fallback to empty array
  const points = props.spendingData || []
  window._danakitoOverlays = points.map(point => {
    const rect = L.rectangle([
      [point.lat - 0.002, point.lng - 0.002],
      [point.lat + 0.002, point.lng + 0.002]
    ], {
      color: '#f59e42',
      weight: 2,
      fillColor: '#f59e42',
      fillOpacity: 0.5
    }).addTo(map.value)
    rect.on('click', () => {
      rect.bindPopup(`<b>Transaction Volume:</b> $${point.amount}`).openPopup()
    })
    return rect
  })
}

function addOpportunityOverlay() {
  if (!map.value) return
  const L = window.L || (window as any).leaflet
  if (!L) return
  // Use opportunityData from props, fallback to empty array
  const points = props.opportunityData || []
  window._danakitoOverlays = points.map(point => {
    const marker = L.marker([point.lat, point.lng], {
      title: `Opportunity Score: ${point.score}`
    }).addTo(map.value)
    marker.on('click', () => {
      marker.bindPopup(`<b>Opportunity Score:</b> ${point.score}`).openPopup()
    })
    return marker
  })
}

function addDemographicsOverlay() {
  if (!map.value) return
  const L = window.L || (window as any).leaflet
  if (!L) return
  const points = props.demographicsData || []
  window._danakitoOverlays = points.map(point => {
    const intensity = point.population / 5000 // Normalize population for styling
    const marker = L.circleMarker([point.lat, point.lng], {
      radius: Math.max(6, intensity * 15),
      fillColor: intensity > 0.6 ? '#8b5cf6' : '#c4b5fd',
      color: '#6d28d9',
      weight: 1,
      opacity: 0.8,
      fillOpacity: 0.6
    }).addTo(map.value)
    marker.on('click', () => {
      marker.bindPopup(`<b>Population:</b> ${point.population}<br><b>Avg. Income:</b> $${point.avgIncome.toLocaleString()}`).openPopup()
    })
    return marker
  })
}
</script>

<style scoped>
/* Import Leaflet CSS */
@import 'leaflet/dist/leaflet.css';
@import 'leaflet-draw/dist/leaflet.draw.css';

/* Ensure map fills container properly */
.h-full {
  height: 100% !important;
}

.w-full {
  width: 100% !important;
}

/* Fix z-index for map controls */
:deep(.leaflet-control-container) {
  z-index: 1000;
}

:deep(.leaflet-draw-toolbar) {
  z-index: 1001;
}
</style> 