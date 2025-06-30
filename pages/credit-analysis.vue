<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="flex items-center text-blue-600 hover:text-blue-800">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back to Map
            </NuxtLink>
            <h1 class="text-2xl font-bold text-gray-900">💳 Credit Analysis & Comparison</h1>
          </div>
          <div class="text-sm text-gray-600">AI-Powered Banking Analysis</div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Credit Input Section -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">📊 Investment & Credit Analysis</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <!-- Credit Amount Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Credit Amount ($)</label>
            <input
              v-model.number="creditAmount"
              type="number"
              min="10000"
              max="10000000"
              step="1000"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 250000"
            />
          </div>

          <!-- Investment Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Investment Type</label>
            <select
              v-model="investmentType"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="retail">🏪 Retail Store</option>
              <option value="restaurant">🍽️ Restaurant</option>
              <option value="office">🏢 Office Space</option>
              <option value="residential">🏠 Residential</option>
              <option value="agricultural">🌾 Agricultural</option>
              <option value="industrial">🏭 Industrial</option>
            </select>
          </div>

          <!-- Location -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              v-model="location"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., New York City, NY"
            />
          </div>
        </div>

        <button
          @click="runAnalysis"
          :disabled="analyzing || !creditAmount || creditAmount < 10000"
          class="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <div v-if="analyzing" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>{{ analyzing ? '🧠 Analyzing...' : '🚀 Run AI Analysis' }}</span>
        </button>
      </div>

      <!-- Analysis Results -->
      <div v-if="analysisResults" class="space-y-8">
        <!-- Investment Score Card -->
        <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-gray-900">📈 Investment Analysis</h3>
            <div class="text-3xl font-bold text-green-600">{{ analysisResults.score }}%</div>
          </div>
          
          <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              class="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-1000" 
              :style="{ width: analysisResults.score + '%' }"
            ></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-sm text-gray-600">Market Potential</div>
              <div class="font-semibold text-green-700">{{ analysisResults.market }}</div>
            </div>
            <div class="text-center">
              <div class="text-sm text-gray-600">Risk Level</div>
              <div class="font-semibold text-orange-600">{{ analysisResults.risk }}</div>
            </div>
            <div class="text-center">
              <div class="text-sm text-gray-600">ROI Projection</div>
              <div class="font-semibold text-blue-600">{{ analysisResults.roi }}</div>
            </div>
          </div>
        </div>

        <!-- Bank Comparison Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Interest Rate Comparison -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">📊 Interest Rate Comparison</h3>
            <div class="space-y-4">
              <div v-for="bank in analysisResults.creditComparison" :key="bank.bankName" class="flex items-center">
                <div class="w-32 text-sm font-medium text-gray-700">{{ bank.bankName }}</div>
                <div class="flex-1 mx-4">
                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      class="h-3 rounded-full transition-all duration-1000"
                      :class="bank.interestRate < 7 ? 'bg-green-500' : bank.interestRate < 8 ? 'bg-yellow-500' : 'bg-red-500'"
                      :style="{ width: (bank.interestRate / 10) * 100 + '%' }"
                    ></div>
                  </div>
                </div>
                <div class="w-16 text-right text-sm font-semibold">{{ bank.interestRate }}%</div>
              </div>
            </div>
          </div>

          <!-- Monthly Payment Comparison -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">💰 Monthly Payment Comparison</h3>
            <div class="space-y-4">
              <div v-for="bank in analysisResults.creditComparison" :key="bank.bankName" class="flex items-center">
                <div class="w-32 text-sm font-medium text-gray-700">{{ bank.bankName }}</div>
                <div class="flex-1 mx-4">
                  <div class="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      class="h-3 rounded-full transition-all duration-1000"
                      :class="bank.monthlyPayment < maxMonthlyPayment * 0.8 ? 'bg-green-500' : bank.monthlyPayment < maxMonthlyPayment * 0.9 ? 'bg-yellow-500' : 'bg-red-500'"
                      :style="{ width: (bank.monthlyPayment / maxMonthlyPayment) * 100 + '%' }"
                    ></div>
                  </div>
                </div>
                <div class="w-20 text-right text-sm font-semibold">${{ bank.monthlyPayment.toLocaleString() }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Bank Comparison Table -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">🏦 Detailed Bank Comparison</h3>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Payment</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Payment</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processing Fee</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="bank in sortedBanks" :key="bank.bankName" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-medium text-gray-900">{{ bank.bankName }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="bank.interestRate < 7 ? 'bg-green-100 text-green-800' : bank.interestRate < 8 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ bank.interestRate }}%
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ${{ bank.monthlyPayment.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${{ bank.totalPayment.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${{ bank.processingFee.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex space-x-1">
                        <span v-for="star in getBankRating(bank)" :key="star" class="text-yellow-400">⭐</span>
                      </div>
                      <span class="ml-2 text-sm text-gray-500">{{ getBankRating(bank) }}/5</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bank Details Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="bank in analysisResults.creditComparison.slice(0, 4)" :key="bank.bankName" class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-semibold text-gray-900">{{ bank.bankName }}</h4>
              <span 
                class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                :class="bank.interestRate < 7 ? 'bg-green-100 text-green-800' : bank.interestRate < 8 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'"
              >
                {{ bank.interestRate }}% APR
              </span>
            </div>

            <div class="space-y-3 mb-4">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Monthly Payment:</span>
                <span class="font-semibold">${{ bank.monthlyPayment.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Processing Fee:</span>
                <span class="font-semibold">${{ bank.processingFee.toLocaleString() }}</span>
              </div>
            </div>

            <div class="space-y-3">
              <div>
                <h5 class="text-sm font-medium text-green-700 mb-1">✅ Pros:</h5>
                <ul class="text-sm text-gray-600 space-y-1">
                  <li v-for="pro in bank.pros" :key="pro" class="flex items-start">
                    <span class="text-green-500 mr-2">•</span>
                    {{ pro }}
                  </li>
                </ul>
              </div>
              
              <div>
                <h5 class="text-sm font-medium text-red-700 mb-1">❌ Cons:</h5>
                <ul class="text-sm text-gray-600 space-y-1">
                  <li v-for="con in bank.cons" :key="con" class="flex items-start">
                    <span class="text-red-500 mr-2">•</span>
                    {{ con }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Recommendation -->
        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">🤖 AI Recommendation</h3>
          <p class="text-gray-700 leading-relaxed">{{ analysisResults.recommendation }}</p>
        </div>
      </div>

      <!-- No Results State -->
      <div v-else class="text-center py-12">
        <div class="text-6xl mb-4">📊</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Ready for Analysis</h3>
        <p class="text-gray-600">Enter your credit amount and investment details above to get started with AI-powered analysis.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Using Gemini API directly
import type { InvestmentAnalysisResponse } from '~/types/analysis'

// SEO
useHead({
  title: 'Credit Analysis & Banking Comparison - danakito',
  meta: [
    { name: 'description', content: 'Compare business credit options and investment analysis with AI-powered insights' }
  ]
})

// Reactive state
const creditAmount = ref(250000)
const investmentType = ref('retail')
const location = ref('New York City, NY')
const analyzing = ref(false)
const analysisResults = ref<InvestmentAnalysisResponse | null>(null)

// Computed properties
const maxMonthlyPayment = computed(() => {
  if (!analysisResults.value?.creditComparison) return 0
  return Math.max(...analysisResults.value.creditComparison.map(bank => bank.monthlyPayment))
})

const sortedBanks = computed(() => {
  if (!analysisResults.value?.creditComparison) return []
  return [...analysisResults.value.creditComparison].sort((a, b) => a.interestRate - b.interestRate)
})

// Methods
const runAnalysis = async () => {
  if (!creditAmount.value || creditAmount.value < 10000) return
  
  analyzing.value = true
  
  try {
    const result = await $fetch('/api/analysis/gemini', {
      method: 'POST',
      body: {
        location: location.value,
        investmentType: investmentType.value,
        creditAmount: creditAmount.value,
        tenor: 60, // Default 5 years
        mobilityData: [],
        spendingData: [],
        opportunityData: [],
        generateDetailedReport: false
      }
    })
    
    analysisResults.value = result
    
    console.log('✅ Analysis completed successfully:', result)
  } catch (error) {
    console.error('❌ Analysis failed:', error)
    // Instead of alert, set a user-friendly error message
    analysisResults.value = {
      score: 0,
      market: 'Error',
      risk: 'Unable to analyze',
      roi: '0',
      recommendation: 'Analysis failed. Please check your connection and try again.',
      detailedAnalysis: 'There was an error processing your request. Please try again with different parameters or check your internet connection.',
      source: 'error',
      creditComparison: []
    }
  } finally {
    analyzing.value = false
  }
}

const getBankRating = (bank: any) => {
  // Simple rating based on interest rate and fees
  const rate = bank.interestRate
  const feeRatio = bank.processingFee / creditAmount.value
  
  if (rate < 7 && feeRatio < 0.02) return 5
  if (rate < 7.5 && feeRatio < 0.025) return 4
  if (rate < 8 && feeRatio < 0.03) return 3
  if (rate < 8.5) return 2
  return 1
}

// Auto-run analysis with default values on mount
onMounted(() => {
  // Optional: Auto-run analysis with default values
  // runAnalysis()
})

// Load mock-data.json for overlays (for future map integration)
const { data: mockData, pending: loadingMockData } = await useFetch('/mock-data.json')
</script>

<style scoped>
/* Custom animations for charts */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out;
}
</style> 