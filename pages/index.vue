<template>
  <div class="h-screen bg-gray-50 flex flex-col">
    <!-- Top Header Bar -->
    <div class="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center z-10">
      <h1 class="text-3xl font-bold text-gray-900">danakito</h1>
      <div class="text-sm text-gray-600">AI-Powered Investment Analysis Platform</div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar - Controls and Menu -->
      <div class="w-80 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
        <!-- Data Controls Section -->
        <div class="p-6 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            🎛️ Data Controls
          </h3>
          
          <!-- Heatmap Type Selector -->
          <div class="space-y-3">
            <label class="block text-sm font-medium text-gray-700">Data Layer:</label>
            <div class="space-y-2">
              <button 
                v-for="option in heatmapOptions" 
                :key="option.value"
                @click="selectHeatmapType(option.value)"
                :class="[
                  'w-full text-left px-4 py-3 text-sm rounded-lg border-2 transition-all duration-200',
                  currentHeatmapType === option.value 
                    ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm' 
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                ]"
              >
                <div class="flex items-center space-x-3">
                  <span class="text-lg">{{ option.icon }}</span>
                  <span class="font-medium">{{ option.label }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Loading Indicator -->
          <div v-if="isLoading" class="mt-4 flex items-center space-x-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span class="text-sm font-medium">Loading data...</span>
          </div>
        </div>

        <!-- Drawing Tools Section -->
        <div class="p-6 border-b border-gray-100 drawing-tools">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            ✏️ Drawing Tools
          </h3>
          <div class="space-y-2">
            <button 
              @click="selectDrawingTool('polygon')"
              class="w-full text-left px-4 py-3 text-sm rounded-lg transition-colors flex items-center space-x-3 bg-green-600 text-white hover:bg-green-700"
            >
              <span class="text-lg">📐</span>
              <span class="font-medium">Draw Polygon</span>
            </button>
            <button 
              @click="selectDrawingTool('rectangle')"
              class="w-full text-left px-4 py-3 text-sm rounded-lg transition-colors flex items-center space-x-3 bg-blue-600 text-white hover:bg-blue-700"
            >
              <span class="text-lg">⬜</span>
              <span class="font-medium">Draw Rectangle</span>
            </button>
            <button 
              @click="selectDrawingTool('circle')"
              class="w-full text-left px-4 py-3 text-sm rounded-lg transition-colors flex items-center space-x-3 bg-purple-600 text-white hover:bg-purple-700"
            >
              <span class="text-lg">⭕</span>
              <span class="font-medium">Draw Circle</span>
            </button>
            <button 
              @click="selectArea"
              class="w-full text-left px-4 py-3 text-sm rounded-lg transition-colors flex items-center space-x-3 bg-orange-600 text-white hover:bg-orange-700"
            >
              <span class="text-lg">🎯</span>
              <span class="font-medium">Select Area</span>
            </button>
          </div>
        </div>

        <!-- Investment Types Section -->
        <div class="p-6 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">💼 Investment Type</h3>
          <div class="grid grid-cols-2 gap-2">
            <button 
              v-for="type in investmentTypes" 
              :key="type.value"
              @click="selectInvestmentType(type.value)"
              :class="[
                'p-3 rounded-lg border-2 text-center transition-colors',
                selectedInvestmentType === type.value
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <div class="text-lg mb-1">{{ type.icon }}</div>
              <div class="text-xs font-medium">{{ type.label }}</div>
            </button>
          </div>
        </div>

                 <!-- AI Analysis Results Section -->
         <div v-if="analysisResults" class="p-6 border-b border-gray-100">
           <h3 class="text-lg font-semibold text-gray-900 mb-4">📈 Analysis Results</h3>
           
           <div class="bg-green-50 rounded-lg p-4 mb-4">
             <div class="flex justify-between items-center mb-2">
               <span class="font-medium text-green-900">Investment Score</span>
               <span class="text-2xl font-bold text-green-600">{{ analysisResults.score }}%</span>
             </div>
             <div class="w-full bg-green-200 rounded-full h-3">
               <div 
                 class="bg-green-600 h-3 rounded-full transition-all duration-1000" 
                 :style="{ width: analysisResults.score + '%' }"
               ></div>
             </div>
           </div>

           <div class="space-y-3 mb-4">
             <div class="flex justify-between">
               <span class="text-sm text-gray-600">📊 Market Potential:</span>
               <span class="font-medium text-green-700">{{ analysisResults.market }}</span>
             </div>
             <div class="flex justify-between">
               <span class="text-sm text-gray-600">⚠️ Risk Level:</span>
               <span class="font-medium text-orange-600">{{ analysisResults.risk }}</span>
             </div>
             <div class="flex justify-between">
               <span class="text-sm text-gray-600">💰 ROI Projection:</span>
               <span class="font-medium text-blue-600">{{ analysisResults.roi }}</span>
             </div>
           </div>

           <div class="bg-yellow-50 rounded-lg p-3">
             <h4 class="font-medium text-yellow-900 mb-2">🤖 AI Recommendation</h4>
             <p class="text-sm text-yellow-800">{{ analysisResults.recommendation }}</p>
           </div>
         </div>

         <!-- Selected Area Info -->
         <div v-if="showAnalysisPanel" class="p-6 border-b border-gray-100">
           <h3 class="text-lg font-semibold text-gray-900 mb-3">🎯 Selected Area</h3>
           <div class="bg-blue-50 rounded-lg p-3">
             <p class="text-sm text-blue-700 font-medium">New York City Region</p>
             <p class="text-xs text-blue-600 mt-1">Coordinates: 40.7128°N, 74.0060°W</p>
           </div>
         </div>

         <!-- Action Buttons Section -->
         <div class="p-6 space-y-3 mt-auto">
           <button
             @click="runDetailedAnalysis"
             :class="[
               'w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-lg shadow-lg transition-colors font-medium',
               !selectedAreaGeoJSON
                 ? 'bg-blue-600 hover:bg-blue-700 text-white'
                 : 'bg-green-600 hover:bg-green-700 text-white'
             ]"
           >
             <span>
               {{ !selectedAreaGeoJSON ? '🎯 Select Area First' : '🧠 Run AI Analysis' }}
             </span>
           </button>
           
           <!-- Help Text -->
           <div v-if="!selectedAreaGeoJSON" class="text-center">
             <p class="text-xs text-gray-500 mb-2">👆 Use drawing tools above to select an area on the map</p>
             <div class="flex justify-center space-x-2">
               <button 
                 @click="selectDrawingTool('polygon')"
                 class="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
               >
                 📐 Polygon
               </button>
               <button 
                 @click="selectDrawingTool('rectangle')"
                 class="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
               >
                 ⬜ Rectangle
               </button>
               <button 
                 @click="selectDrawingTool('circle')"
                 class="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
               >
                 ⭕ Circle
               </button>
             </div>
           </div>
         </div>
      </div>

      <!-- Right Side - Map Area -->
      <div class="flex-1 relative bg-gray-100">
        <!-- Map Component -->
        <InvestmentMap 
          :heatmapType="currentHeatmapType"
          :mobilityData="mockData?.mobility"
          :spendingData="mockData?.spending"
          :opportunityData="mockData?.opportunity"
          :demographicsData="mockData?.demographics"
          @area-selected="handleAreaSelected"
          @map-ready="onMapReady"
          class="absolute inset-0 w-full h-full"
        />
        
        <!-- Map Status Indicator -->
        <div class="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2 z-10">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-sm font-medium text-gray-700">New York City, USA</span>
          </div>
        </div>
      </div>
    </div>

    

    <!-- Welcome Modal -->
    <div v-if="showWelcome" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-8 max-w-md mx-4 shadow-2xl">
        <div class="text-center">
          <div class="text-6xl mb-4">🚀</div>
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Welcome to danakito</h1>
          <p class="text-gray-600 mb-6">
            AI-powered investment analysis platform for smart decision making. Analyze real estate, retail, and agricultural opportunities with advanced machine learning models.
          </p>
          <div class="space-y-3">
            <button
              @click="startDemo"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              🎯 Start Demo
            </button>
            <button
              @click="closeWelcome"
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors"
            >
              Skip Introduction
            </button>
          </div>
        </div>
      </div>
    </div>
    <footer class="bg-gray-800 text-white p-4">
      <div class="container mx-auto text-center">
        <a href="https://bolt.new" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center">
          <img src="/black_circle_360x360.png" alt="Logo" class="h-6 w-6 mr-2">
          <span>Powered by bolt.new</span>
        </a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useFetch } from 'nuxt/app'

interface AnalysisResult {
  score: number;
  market: string;
  risk: string;
  roi: string;
  recommendation: string;
}

interface MockData {
  mobility: any[];
  spending: any[];
  opportunity: any[];
  demographics: any[];
}

const { data: mockData, pending: loadingMockData } = await useFetch<MockData>('/mock-data.json')

// Reactive state
const showWelcome = ref(false) // Set to false to avoid modal blocking
const showAnalysisPanel = ref(false)
const generatingData = ref(false)
const analyzing = ref(false)
const isLoading = ref(false)
const currentHeatmapType = ref('mobility')
const selectedInvestmentType = ref('retail')
const analysisResults = ref<AnalysisResult | null>(null)
const selectedAreaGeoJSON = ref(null)

// Data options
const heatmapOptions = [
  { value: 'mobility', label: 'Mobility Data', icon: '🚶' },
  { value: 'spending', label: 'Spending Patterns', icon: '💳' },
  { value: 'opportunity', label: 'Investment Opportunities', icon: '💎' },
  { value: 'demographics', label: 'Demographics', icon: '👥' }
]

const investmentTypes = [
  { value: 'retail', label: 'Retail', icon: '🏪' },
  { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { value: 'office', label: 'Office', icon: '🏢' },
  { value: 'residential', label: 'Residential', icon: '🏠' },
  { value: 'agricultural', label: 'Agriculture', icon: '🌾' },
  { value: 'industrial', label: 'Industrial', icon: '🏭' }
]

// Methods
const handleAreaSelected = (area: any) => {
  showAnalysisPanel.value = true
  selectedAreaGeoJSON.value = area
  console.log('Area selected for analysis:', area)
}

const onMapReady = () => {
  console.log('Map is ready - New York City, USA')
}

const selectHeatmapType = (type: string) => {
  currentHeatmapType.value = type
  isLoading.value = true
  
  console.log(`Loading ${type} data...`)
  setTimeout(() => {
    isLoading.value = false
    console.log(`${type} data loaded successfully`)
  }, 1500)
}

const selectDrawingTool = (tool: string) => {
  console.log(`Selected drawing tool: ${tool}`)
  // Simulate area selection after drawing
  setTimeout(() => {
    selectArea()
  }, 1000)
}

const selectArea = () => {
  showAnalysisPanel.value = true
  console.log('Area selected for analysis')
}

const selectInvestmentType = (type: string) => {
  selectedInvestmentType.value = type
  console.log(`Selected investment type: ${type}`)
}

const generateMockData = async () => {
  generatingData.value = true
  
  try {
    console.log('Generating mock data...')
    await new Promise(resolve => setTimeout(resolve, 3000))
    console.log('Mock data generated successfully! 🎉')
    alert('✅ Demo data generated successfully!\n\n📊 Generated:\n• 500+ mobility data points\n• 1000+ spending transactions\n• 200+ investment opportunities\n• Demographic analysis')
  } catch (error) {
    console.error('Error generating mock data:', error)
    alert('❌ Error generating demo data')
  } finally {
    generatingData.value = false
  }
}

const runAnalysis = () => {
  if (!showAnalysisPanel.value) {
    selectArea()
  } else {
    runDetailedAnalysis()
  }
}

const runDetailedAnalysis = async () => {
  if (!selectedAreaGeoJSON.value) {
    // Instead of showing an alert, guide the user to select an area
    console.log('No area selected - guiding user to select area')
    // Scroll to drawing tools or highlight them
    const drawingSection = document.querySelector('.drawing-tools')
    if (drawingSection) {
      drawingSection.scrollIntoView({ behavior: 'smooth' })
    }
    return
  }
  
  try {
    const center = getGeoJSONCenter(selectedAreaGeoJSON.value)
    const url = `/analysis?lat=${center.lat}&lng=${center.lng}&type=${selectedInvestmentType.value}`
    // Open the new analysis workflow page
    window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')
  } catch (error) {
    console.error('Error running analysis:', error)
    alert('❌ Error running analysis. Please try again.')
  }
}

const startDemo = () => {
  showWelcome.value = false
  setTimeout(() => {
    selectArea()
  }, 1000)
}

const closeWelcome = () => {
  showWelcome.value = false
}

function getGeoJSONCenter(geoJSON: any) {
  if (!geoJSON || !geoJSON.geometry) return { lat: 40.7128, lng: -74.0060 } // Default to NYC

  const { type, coordinates } = geoJSON.geometry

  if (type === 'Point') {
    return { lat: coordinates[1], lng: coordinates[0] }
  }

  if (type === 'Polygon') {
    const points = coordinates[0]
    const avg = points.reduce((acc: any, point: any) => {
      acc.lng += point[0]
      acc.lat += point[1]
      return acc
    }, { lat: 0, lng: 0 })

    avg.lat /= points.length
    avg.lng /= points.length
    return avg
  }
  
  return { lat: 40.7128, lng: -74.0060 } // Default fallback
}

// Function to force fix any gray panels
const forceFixGrayPanels = () => {
  // Force all buttons to be enabled and clickable
  const fixButtons = () => {
    const buttons = document.querySelectorAll('button')
    buttons.forEach(button => {
      button.style.pointerEvents = 'auto'
      button.style.cursor = 'pointer'
      button.style.opacity = '1'
      
      // Remove disabled attribute but keep click handlers
      if (button.hasAttribute('disabled')) {
        button.removeAttribute('disabled')
      }
      
      // Override gray backgrounds
      if (button.classList.contains('bg-gray-400')) {
        button.style.backgroundColor = 'rgb(59 130 246)' // Blue
        button.style.color = 'white'
      }
      
      if (button.classList.contains('cursor-not-allowed')) {
        button.style.cursor = 'pointer'
      }
    })
  }
  
  // Run immediately and on any DOM changes
  fixButtons()
  
  // Set up mutation observer to fix any dynamically added buttons
  const observer = new MutationObserver(() => {
    fixButtons()
  })
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['disabled', 'class', 'style']
  })
  
  // Also run after a short delay to catch any late-loading elements
  setTimeout(fixButtons, 100)
  setTimeout(fixButtons, 500)
  setTimeout(fixButtons, 1000)
}

// Initialize when component mounts
onMounted(() => {
  console.log('🚀 danakito Investment Analysis Platform loaded')
  console.log('📍 Location: New York City, USA')
  
  // Check if user has seen welcome before
  const hasSeenWelcome = localStorage.getItem('danakito-welcome-seen')
  if (hasSeenWelcome) {
    showWelcome.value = false
  }
  
  // Force fix gray panel issues on mount
  forceFixGrayPanels()
})

// Save welcome state when closing
watch(showWelcome, (newValue) => {
  if (!newValue) {
    localStorage.setItem('danakito-welcome-seen', 'true')
  }
})
</script>

<style scoped>
/* Custom transitions and animations */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* Pulse animation for buttons */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Force override any gray disabled states on Netlify */
:deep(button[disabled]),
:deep(button:disabled),
:deep(.disabled) {
  background-color: inherit !important;
  color: inherit !important;
  cursor: pointer !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  border: inherit !important;
}

:deep(.cursor-not-allowed) {
  cursor: pointer !important;
}

:deep(.bg-gray-400) {
  background-color: rgb(59 130 246) !important; /* Blue instead of gray */
}

:deep(.bg-gray-300) {
  background-color: rgb(147 197 253) !important; /* Light blue */
}

:deep(.bg-gray-100) {
  background-color: white !important;
}

:deep(.text-gray-400) {
  color: rgb(55 65 81) !important;
}

:deep(.text-gray-200) {
  color: rgb(31 41 55) !important;
}

/* Ensure all elements are interactive */
:deep(*) {
  pointer-events: auto !important;
}

/* Override disabled utilities */
:deep(.disabled\:bg-gray-400) {
  background-color: rgb(59 130 246) !important;
}

:deep(.disabled\:text-gray-200) {
  color: white !important;
}

:deep(.disabled\:cursor-not-allowed) {
  cursor: pointer !important;
}

/* Make sure drawing tools are always clickable */
:deep(.drawing-tools button) {
  opacity: 1 !important;
  pointer-events: auto !important;
  cursor: pointer !important;
}

/* Force data layer buttons to be clickable */
:deep(.border-gray-300) {
  border-color: rgb(59 130 246) !important;
}
</style> 