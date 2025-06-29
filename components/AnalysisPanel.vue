<template>
  <div class="h-full flex flex-col bg-white analysis-panel">
    <!-- Header -->
    <div class="p-6 border-b bg-gray-50">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Investment Analysis</h2>
        <UButton
          @click="$emit('close')"
          icon="i-heroicons-x-mark"
          variant="ghost"
          color="gray"
          size="sm"
        />
      </div>
      <p class="text-sm text-gray-600 mt-1">AI-powered investment insights</p>
    </div>
    
    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Analysis Form -->
      <div v-if="!analysisStore.hasAnalysis" class="p-6 space-y-6">
        <!-- Investment Type Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Investment Type
          </label>
          <div class="grid grid-cols-1 gap-3">
            <UButton
              v-for="type in investmentTypes"
              :key="type.value"
              @click="selectInvestmentType(type.value)"
              :variant="selectedInvestmentType === type.value ? 'solid' : 'outline'"
              :color="selectedInvestmentType === type.value ? 'primary' : 'gray'"
              class="justify-start"
              size="lg"
            >
              <UIcon :name="type.icon" class="mr-2" />
              <div class="text-left">
                <div class="font-medium">{{ type.label }}</div>
                <div class="text-xs opacity-75">{{ type.description }}</div>
              </div>
            </UButton>
          </div>
        </div>
        
        <!-- Investment Amount -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Investment Amount ($)
          </label>
          <UInput
            v-model.number="investmentAmount"
            type="number"
            placeholder="Enter investment amount"
            :min="1000"
            :max="10000000"
            size="lg"
          />
          <p class="text-xs text-gray-500 mt-1">
            Minimum: $1,000 | Maximum: $10,000,000
          </p>
        </div>
        
        <!-- Additional Options for Agricultural -->
        <div v-if="selectedInvestmentType === 'agricultural'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Crops
            </label>
            <div class="space-y-2">
              <UCheckbox
                v-for="crop in availableCrops"
                :key="crop.value"
                v-model="selectedCrops"
                :value="crop.value"
                :label="crop.label"
              />
            </div>
          </div>
        </div>
        
        <!-- Error Message -->
        <UAlert
          v-if="analysisStore.analysisError"
          color="red"
          variant="soft"
          :title="analysisStore.analysisError"
          @close="analysisStore.clearError()"
        />
        
        <!-- Analyze Button -->
        <UButton
          @click="runAnalysis"
          :disabled="!canAnalyze"
          :loading="analysisStore.isAnalyzing"
          color="primary"
          size="lg"
          class="w-full"
          icon="i-heroicons-chart-bar"
        >
          {{ analysisStore.isAnalyzing ? 'Analyzing...' : 'Run AI Analysis' }}
        </UButton>
      </div>
      
      <!-- Analysis Results -->
      <div v-else class="p-6 space-y-6">
        <!-- Overall Score Card -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div class="text-center">
            <div class="text-4xl font-bold mb-2" :class="scoreColorClass">
              {{ (analysisStore.overallScore * 100).toFixed(1) }}%
            </div>
            <p class="text-sm text-gray-600 mb-2">Overall Investment Score</p>
            <div class="flex items-center justify-center space-x-1">
              <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
              <span class="text-sm text-gray-600">
                {{ (analysisStore.confidenceLevel * 100).toFixed(1) }}% confidence
              </span>
            </div>
          </div>
        </div>
        
        <!-- Score Breakdown -->
        <div class="space-y-4">
          <h3 class="font-semibold text-gray-900">Score Breakdown</h3>
          <div class="space-y-3">
            <div v-for="(score, key) in analysisStore.currentAnalysis?.scores" :key="key" class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 capitalize">{{ key }}</span>
              <div class="flex items-center space-x-2">
                <div class="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-500"
                    :class="getScoreColor(score)"
                    :style="{ width: `${score * 100}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900 w-12">
                  {{ (score * 100).toFixed(0) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- ROI Projections -->
        <div class="space-y-4">
          <h3 class="font-semibold text-gray-900">ROI Projections</h3>
          <div class="grid grid-cols-3 gap-3">
            <div 
              v-for="(projection, scenario) in analysisStore.currentAnalysis?.roiProjections" 
              :key="scenario"
              class="bg-gray-50 rounded-lg p-3 text-center"
            >
              <div class="text-xs font-medium text-gray-500 uppercase mb-1">
                {{ scenario }}
              </div>
              <div class="text-lg font-bold text-gray-900">
                {{ (projection.annualROI * 100).toFixed(1) }}%
              </div>
              <div class="text-xs text-gray-600">
                {{ projection.breakevenMonths }}mo breakeven
              </div>
            </div>
          </div>
        </div>
        
        <!-- Risk Factors -->
        <div v-if="analysisStore.currentAnalysis?.riskFactors?.length" class="space-y-4">
          <h3 class="font-semibold text-gray-900">Risk Factors</h3>
          <div class="space-y-2">
            <div 
              v-for="risk in analysisStore.currentAnalysis.riskFactors" 
              :key="risk"
              class="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
            >
              <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span class="text-sm text-yellow-800">{{ risk }}</span>
            </div>
          </div>
        </div>
        
        <!-- Recommendations -->
        <div v-if="analysisStore.currentAnalysis?.recommendations?.length" class="space-y-4">
          <h3 class="font-semibold text-gray-900">AI Recommendations</h3>
          <div class="space-y-2">
            <div 
              v-for="recommendation in analysisStore.currentAnalysis.recommendations" 
              :key="recommendation"
              class="flex items-start space-x-2 p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <UIcon name="i-heroicons-light-bulb" class="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span class="text-sm text-green-800">{{ recommendation }}</span>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex space-x-3 pt-4 border-t">
          <UButton
            @click="generateReport"
            color="green"
            variant="solid"
            size="lg"
            icon="i-heroicons-document-text"
            class="flex-1"
          >
            Generate Report
          </UButton>
          <UButton
            @click="startNewAnalysis"
            color="gray"
            variant="outline"
            size="lg"
            icon="i-heroicons-arrow-path"
            class="flex-1"
          >
            New Analysis
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnalysisStore } from '~/stores/analysis'

// Props
const props = defineProps<{
  selectedArea: GeoJSON.Feature | null
}>()

// Emits
const emit = defineEmits<{
  close: []
  'analysis-complete': [result: any]
}>()

// Store
const analysisStore = useAnalysisStore()
const toast = useToast()

// State
const selectedInvestmentType = ref('')
const investmentAmount = ref(100000)
const selectedCrops = ref<string[]>([])

// Investment types
const investmentTypes = [
  {
    value: 'shop',
    label: 'Retail Shop',
    description: 'Physical retail store',
    icon: 'i-heroicons-shopping-bag'
  },
  {
    value: 'restaurant',
    label: 'Restaurant',
    description: 'Food & beverage service',
    icon: 'i-heroicons-building-storefront'
  },
  {
    value: 'service',
    label: 'Service Business',
    description: 'Professional services',
    icon: 'i-heroicons-briefcase'
  },
  {
    value: 'agricultural',
    label: 'Agriculture',
    description: 'Crop farming investment',
    icon: 'i-heroicons-cpu-chip'
  }
]

const availableCrops = [
  { value: 'wheat', label: 'Wheat' },
  { value: 'corn', label: 'Corn' },
  { value: 'rice', label: 'Rice' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'fruits', label: 'Fruits' }
]

// Computed
const canAnalyze = computed(() => {
  if (!selectedInvestmentType.value || !investmentAmount.value || !props.selectedArea) {
    return false
  }
  
  if (selectedInvestmentType.value === 'agricultural') {
    return selectedCrops.value.length > 0
  }
  
  return true
})

const scoreColorClass = computed(() => {
  const score = analysisStore.overallScore
  if (score >= 0.8) return 'text-green-600'
  if (score >= 0.6) return 'text-yellow-600'
  return 'text-red-600'
})

// Methods
const selectInvestmentType = (type: string) => {
  selectedInvestmentType.value = type
  analysisStore.setInvestmentType(type)
}

const getScoreColor = (score: number): string => {
  if (score >= 0.8) return 'bg-green-500'
  if (score >= 0.6) return 'bg-yellow-500'
  return 'bg-red-500'
}

const runAnalysis = async () => {
  if (!props.selectedArea || !canAnalyze.value) return

  try {
    if (selectedInvestmentType.value === 'agricultural') {
      await analysisStore.runAgriculturalAnalysis({
        geometry: props.selectedArea,
        cropTypes: selectedCrops.value,
        investmentAmount: investmentAmount.value
      })
    } else {
      await analysisStore.runUrbanAnalysis({
        geometry: props.selectedArea,
        investmentType: selectedInvestmentType.value as 'shop' | 'restaurant' | 'service',
        investmentAmount: investmentAmount.value
      })
    }

    if (analysisStore.currentAnalysis) {
      emit('analysis-complete', analysisStore.currentAnalysis)
    }
  } catch (error) {
    console.error('Analysis failed:', error)
    toast.add({
      title: 'Analysis Failed',
      description: 'Unable to complete the analysis. Please try again.',
      color: 'red'
    })
  }
}

const generateReport = async () => {
  try {
    // This would integrate with a PDF generation service
    toast.add({
      title: 'Report Generated',
      description: 'Investment report is being prepared',
      color: 'green'
    })
  } catch (error) {
    toast.add({
      title: 'Report Error',
      description: 'Failed to generate report',
      color: 'red'
    })
  }
}

const startNewAnalysis = () => {
  selectedInvestmentType.value = ''
  investmentAmount.value = 100000
  selectedCrops.value = []
  analysisStore.clearAnalysis()
}

// Watch for changes
watch(() => investmentAmount.value, (newAmount) => {
  analysisStore.setInvestmentAmount(newAmount)
})

watch(() => selectedCrops.value, (newCrops) => {
  analysisStore.setSelectedCrops(newCrops)
})
</script> 