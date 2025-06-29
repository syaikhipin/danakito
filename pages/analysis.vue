<template>
  <div>
    <div class="min-h-screen flex bg-gray-50">
      <!-- Sidebar -->
      <aside class="w-96 bg-white border-r shadow-lg flex flex-col p-8 space-y-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">AI Investment Analysis</h2>
          <p class="text-gray-600">Enter the amount you want to lend or invest. The AI will compare projected ROI with current bank rates and generate a detailed report.</p>
        </div>
        <form @submit.prevent="runAnalysis" class="space-y-6">
          <div>
            <label for="investmentAmount" class="block text-sm font-medium text-gray-700 mb-2">Loan Amount: <span class="font-bold text-blue-600">{{ formatCurrency(amount) }}</span></label>
            <input id="investmentAmount" v-model.number="amount" type="range" min="10000" max="10000000" step="1000" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div>
            <label for="investmentTenor" class="block text-sm font-medium text-gray-700 mb-2">Loan Tenor: <span class="font-bold text-blue-600">{{ tenor }} months</span></label>
            <input id="investmentTenor" v-model.number="tenor" type="range" min="12" max="120" step="12" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Investment Type</label>
            <select v-model="investmentType" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="retail">🏪 Retail Store</option>
              <option value="restaurant">🍽️ Restaurant</option>
              <option value="office">🏢 Office Space</option>
              <option value="residential">🏠 Residential</option>
              <option value="agricultural">🌾 Agricultural</option>
              <option value="industrial">🏭 Industrial</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input v-model="location" type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., New York City, NY" />
          </div>
          <button type="submit" :disabled="loading" class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
            <div v-if="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>{{ loading ? '🧠 Analyzing...' : '🚀 Run Analysis' }}</span>
          </button>
        </form>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-10 overflow-y-auto">
        <section v-if="mapCenter" class="h-[400px] mb-10 bg-white rounded-xl shadow-lg">
          <InvestmentMap
            :initialCenter="mapCenter"
            :initialZoom="14"
            :showCenterMarker="true"
            :mobilityData="mockData?.mobility"
            :spendingData="mockData?.spending"
            :opportunityData="mockData?.opportunity"
            class="w-full h-full rounded-xl"
          />
        </section>

        <div v-if="loading" class="flex flex-col items-center justify-center h-full">
          <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">🧠 Generating AI Analysis...</h3>
          <p class="text-gray-600">Processing your request...</p>
        </div>

        <div v-else-if="result" class="space-y-10">
          <!-- ROI vs Bank Rate Graph -->
          <section class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center"><span class="mr-3">📈</span> Projected ROI vs Bank Rate</h2>
            <div class="w-full max-w-2xl mx-auto">
              <canvas ref="roiChart"></canvas>
            </div>
          </section>

          <!-- Detailed Analysis -->
          <section class="bg-white rounded-xl shadow-lg p-8">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center"><span class="mr-3">🔍</span> Detailed Analysis</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div>
                  <h3 class="font-semibold text-lg mb-2">Mobility Insights</h3>
                  <p class="text-gray-700">{{ result.mobilityAnalysis.summary }}</p>
                  <canvas ref="mobilityChart" class="mt-4"></canvas>
                </div>
                <div>
                  <h3 class="font-semibold text-lg mb-2">Spending Insights</h3>
                  <p class="text-gray-700">{{ result.spendingAnalysis.summary }}</p>
                  <canvas ref="spendingChart" class="mt-4"></canvas>
                </div>
              </div>
              <div>
                <div>
                  <h3 class="font-semibold text-lg mb-2">Opportunity Insights</h3>
                  <p class="text-gray-700">{{ result.opportunityAnalysis.summary }}</p>
                  <canvas ref="opportunityChart" class="mt-4"></canvas>
                </div>
                <div v-if="result.riskFactors">
                  <h3 class="font-semibold text-lg mb-2">Risk Factor Analysis</h3>
                  <canvas ref="riskFactorsChart" class="mt-4"></canvas>
                </div>
                <div v-if="result.creditComparison">
                  <h3 class="font-semibold text-lg mb-2">Loan Cost Comparison</h3>
                  <canvas ref="loanComparisonChart" class="mt-4"></canvas>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div v-else class="flex flex-col items-center justify-center h-full text-gray-400">
          <div class="text-6xl mb-4">��</div>
          <h3 class="text-xl font-semibold mb-2">Ready for Analysis</h3>
          <p>Enter your investment details in the sidebar to begin.</p>
        </div>
      </main>
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
import { ref, onMounted, watch, nextTick } from 'vue'
import { useHead, useRoute } from 'nuxt/app'
import { useFetch } from 'nuxt/app'
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface MockData {
  mobility: Array<{ lat: number; lng: number; intensity: number }>;
  spending: Array<{ lat: number; lng: number; amount: number }>;
  opportunity: Array<{ lat: number; lng: number; score: number }>;
  demographics: Array<{ lat: number; lng: number; population: number; avgIncome: number }>;
}

interface ChartInstances {
  roi: Chart | null;
  mobility: Chart | null;
  spending: Chart | null;
  opportunity: Chart | null;
  riskFactors: Chart | null;
  loanComparison: Chart | null;
}

interface AnalysisData {
  label: string;
  value: number;
}

interface BankData {
  bankName: string;
  interestRate: number;
  monthlyPayment: number;
  totalPayment: number;
  processingFee: number;
  requirements: string[];
  pros: string[];
  cons: string[];
}

interface RiskFactor {
  factor: string;
  level: 'Low' | 'Medium' | 'High';
  description: string;
}

interface MitigationStrategy {
  title: string;
  description: string;
}

interface AnalysisSection {
  summary: string;
  data: AnalysisData[];
}

interface AnalysisResult {
  score: number;
  market: string;
  risk: string;
  roi: string;
  recommendation: string;
  detailedAnalysis: string;
  mobilityAnalysis?: AnalysisSection;
  spendingAnalysis?: AnalysisSection;
  opportunityAnalysis?: AnalysisSection;
  riskFactors?: RiskFactor[];
  mitigationStrategies?: MitigationStrategy[];
  creditComparison?: BankData[];
}

useHead({
  title: 'AI Investment Analysis - danakito',
  meta: [
    { name: 'description', content: 'AI-powered investment and loan analysis with ROI vs bank rate comparison.' }
  ]
})

const route = useRoute()
const lat = route.query.lat ? Number(route.query.lat) : null
const lng = route.query.lng ? Number(route.query.lng) : null
const type = (route.query.type as string) || 'retail'

const mapCenter = ref(lat && lng ? [lat, lng] : null)
const amount = ref(250000)
const tenor = ref(36) // Default tenor of 36 months (3 years)
const investmentType = ref(type)
const location = ref(lat && lng ? `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}` : 'New York City, NY')
const loading = ref(false)
const result = ref<AnalysisResult | null>(null)

// Chart references
const roiChart = ref<HTMLCanvasElement | null>(null)
const mobilityChart = ref<HTMLCanvasElement | null>(null)
const spendingChart = ref<HTMLCanvasElement | null>(null)
const opportunityChart = ref<HTMLCanvasElement | null>(null)
const riskFactorsChart = ref<HTMLCanvasElement | null>(null)
const loanComparisonChart = ref<HTMLCanvasElement | null>(null)

const chartInstances = ref<ChartInstances>({
  roi: null,
  mobility: null,
  spending: null,
  opportunity: null,
  riskFactors: null,
  loanComparison: null
})

// Watch for changes in result and re-render charts
watch(result, () => {
  if (result.value) {
    nextTick(() => {
      renderAllCharts()
    })
  }
}, { deep: true })

// Load mock-data.json for overlays (for future map integration)
const { data: mockData, pending: loadingMockData } = await useFetch<MockData>('/mock-data.json')

const formatCurrency = (value: number) => {
  if (!value) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Haversine distance function
const haversineDistance = (coords1: any, coords2: any) => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lng - coords1.lng);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const getNearbyData = () => {
  if (!mapCenter.value || !mockData.value) return {}
  const center = { lat: mapCenter.value[0], lng: mapCenter.value[1] };
  
  const sortAndSlice = (data: any[]) => {
    if (!data) return []
    return data
      .map(p => ({ ...p, distance: haversineDistance(center, p) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)
  }

  return {
    mobilityData: sortAndSlice(mockData.value.mobility),
    spendingData: sortAndSlice(mockData.value.spending),
    opportunityData: sortAndSlice(mockData.value.opportunity),
  }
}

const runAnalysis = async () => {
  loading.value = true
  result.value = null
  try {
    const nearbyData = getNearbyData();
    const response = await $fetch('/api/analysis/gemini', {
      method: 'POST',
      body: {
        location: location.value,
        investmentType: investmentType.value,
        creditAmount: amount.value,
        tenor: tenor.value,
        generateDetailedReport: true,
        ...nearbyData
      }
    })
    result.value = response
    await nextTick()
    renderAllCharts()
  } catch (e) {
    console.error(e)
    alert('Analysis failed. Please try again.')
  } finally {
    loading.value = false
  }
}

const renderAllCharts = () => {
  if (!result.value) return;
  
  // Destroy all existing chart instances
  Object.values(chartInstances.value).forEach(chart => {
    if (chart) chart.destroy();
  });
  
  // Reset chart instances
  chartInstances.value = {
    roi: null,
    mobility: null,
    spending: null,
    opportunity: null,
    riskFactors: null,
    loanComparison: null
  };

  // Wait for the next tick to ensure canvas elements are mounted
  nextTick(() => {
    try {
      if (result.value) {
        renderRoiChart();
        if (result.value.mobilityAnalysis) renderMobilityChart();
        if (result.value.spendingAnalysis) renderSpendingChart();
        if (result.value.opportunityAnalysis) renderOpportunityChart();
        if (result.value.riskFactors) renderRiskFactorsChart();
        if (result.value.creditComparison) renderLoanComparisonChart();
      }
    } catch (error) {
      console.error('Error rendering charts:', error);
    }
  });
}

function renderRoiChart() {
  try {
    if (!result.value || !roiChart.value) {
      console.warn('ROI chart dependencies not ready');
      return;
    }
    const ctx = roiChart.value.getContext('2d');
    if (!ctx) {
      console.warn('Could not get ROI chart context');
      return;
    }

    if (chartInstances.value.roi) {
      chartInstances.value.roi.destroy();
    }

    // Prepare data
    const bankRates = result.value.creditComparison || [];
    const labels = bankRates.map((b: any) => b.bankName);
    const bankInterest = bankRates.map((b: any) => b.interestRate);
    const projectedROI = parseFloat(result.value.roi);
    
    // Calculate ROI projection with trend
    const roiTrend = bankInterest.map(() => projectedROI);
    const roiRange = {
      upper: roiTrend.map(val => val * 1.1), // 10% above projection
      lower: roiTrend.map(val => val * 0.9)  // 10% below projection
    };

    chartInstances.value.roi = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Bank Interest Rates',
            data: bankInterest,
            type: 'bar',
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            order: 2
          },
          {
            label: 'Projected ROI',
            data: roiTrend,
            type: 'line',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.4,
            order: 0
          },
          {
            label: 'ROI Range',
            data: roiRange.upper,
            type: 'line',
            borderColor: 'rgba(16, 185, 129, 0.1)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 1,
            pointRadius: 0,
            fill: '+1',
            tension: 0.4,
            order: 1
          },
          {
            label: 'ROI Range',
            data: roiRange.lower,
            type: 'line',
            borderColor: 'rgba(16, 185, 129, 0.1)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
            tension: 0.4,
            order: 1
          }
        ]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              filter: function(item) {
                // Hide the duplicate ROI Range label
                return item.text !== 'ROI Range' || item.datasetIndex === 2;
              }
            }
          },
          title: {
            display: true,
            text: 'Projected ROI vs. Bank Interest Rates'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.parsed.y;
                return `${context.dataset.label}: ${value.toFixed(1)}%`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Rate (%)'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error rendering ROI chart:', error);
  }
}

function renderMobilityChart() {
  try {
    if (!result.value?.mobilityAnalysis?.data || !mobilityChart.value) {
      console.warn('Mobility chart dependencies not ready');
      return;
    }
    const ctx = mobilityChart.value.getContext('2d');
    if (!ctx) {
      console.warn('Could not get mobility chart context');
      return;
    }

    if (chartInstances.value.mobility) {
      chartInstances.value.mobility.destroy();
    }

    chartInstances.value.mobility = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: result.value.mobilityAnalysis.data.map((d:any) => d.label),
        datasets: [{
          label: 'Mobility Intensity',
          data: result.value.mobilityAnalysis.data.map((d:any) => d.value),
          backgroundColor: ['#3b82f6', '#10b981', '#f97316', '#ef4444', '#8b5cf6'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Mobility Hotspots' }
        }
      }
    });
  } catch (error) {
    console.error('Error rendering mobility chart:', error);
  }
}

function renderSpendingChart() {
  try {
    if (!result.value?.spendingAnalysis?.data || !spendingChart.value) {
      console.warn('Spending chart dependencies not ready');
      return;
    }
    const ctx = spendingChart.value.getContext('2d');
    if (!ctx) {
      console.warn('Could not get spending chart context');
      return;
    }

    if (chartInstances.value.spending) {
      chartInstances.value.spending.destroy();
    }

    chartInstances.value.spending = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: result.value.spendingAnalysis.data.map((d:any) => d.label),
        datasets: [{
          label: 'Average Spending',
          data: result.value.spendingAnalysis.data.map((d:any) => d.value),
          backgroundColor: '#f59e0b',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Spending Patterns' }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => formatCurrency(Number(value))
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error rendering spending chart:', error);
  }
}

function renderOpportunityChart() {
  try {
    if (!result.value?.opportunityAnalysis?.data || !opportunityChart.value) {
      console.warn('Opportunity chart dependencies not ready');
      return;
    }
    const ctx = opportunityChart.value.getContext('2d');
    if (!ctx) {
      console.warn('Could not get opportunity chart context');
      return;
    }

    if (chartInstances.value.opportunity) {
      chartInstances.value.opportunity.destroy();
    }

    chartInstances.value.opportunity = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: result.value.opportunityAnalysis.data.map((d:any) => d.label),
        datasets: [{
          label: 'Opportunity Score',
          data: result.value.opportunityAnalysis.data.map((d:any) => d.value),
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          borderColor: 'rgba(139, 92, 246, 1)',
          pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Investment Opportunity Scores' }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  } catch (error) {
    console.error('Error rendering opportunity chart:', error);
  }
}

function renderRiskFactorsChart() {
  try {
    if (!result.value?.riskFactors || !riskFactorsChart.value) {
      console.warn('Risk factors chart dependencies not ready');
      return;
    }
    const ctx = riskFactorsChart.value.getContext('2d');
    if (!ctx) {
      console.warn('Could not get risk factors chart context');
      return;
    }

    if (chartInstances.value.riskFactors) {
      chartInstances.value.riskFactors.destroy();
    }

    const riskToValue = { 'Low': 1, 'Medium': 2, 'High': 3 };
    const valueToColor = { 1: 'rgba(74, 222, 128, 0.7)', 2: 'rgba(251, 191, 36, 0.7)', 3: 'rgba(239, 68, 68, 0.7)' };

    chartInstances.value.riskFactors = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: result.value.riskFactors.map((d: any) => d.factor),
        datasets: [{
          label: 'Risk Level',
          data: result.value.riskFactors.map((d: any) => riskToValue[d.level] || 0),
          backgroundColor: result.value.riskFactors.map((d: any) => valueToColor[riskToValue[d.level]] || '#ccc'),
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Risk Factor Severity' }
        },
        scales: {
          x: {
            ticks: {
              callback: function(value) {
                return { 1: 'Low', 2: 'Medium', 3: 'High' }[value] || '';
              }
            },
            max: 3,
            min: 0,
          }
        }
      }
    });
  } catch (error) {
    console.error('Error rendering risk factors chart:', error);
  }
}

function renderLoanComparisonChart() {
  try {
    if (!result.value?.creditComparison || !loanComparisonChart.value) {
      console.warn('Loan comparison chart dependencies not ready');
      return;
    }
    const ctx = loanComparisonChart.value.getContext('2d');
    if (!ctx) {
      console.warn('Could not get loan comparison chart context');
      return;
    }

    if (chartInstances.value.loanComparison) {
      chartInstances.value.loanComparison.destroy();
    }

    chartInstances.value.loanComparison = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: result.value.creditComparison.map((d: any) => d.bankName),
        datasets: [
          {
            label: 'Monthly Payment',
            data: result.value.creditComparison.map((d: any) => d.monthlyPayment),
            backgroundColor: '#3b82f6',
            yAxisID: 'y',
          },
          {
            label: 'Total Payment',
            data: result.value.creditComparison.map((d: any) => d.totalPayment),
            backgroundColor: '#1d4ed8',
            yAxisID: 'y1',
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Loan Payment Comparison' }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { display: true, text: 'Monthly Payment' },
            ticks: { callback: (value) => formatCurrency(Number(value)) }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: { display: true, text: 'Total Payment' },
            grid: { drawOnChartArea: false },
            ticks: { callback: (value) => formatCurrency(Number(value)) }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error rendering loan comparison chart:', error);
  }
}
</script>

<style scoped>
.prose {
  max-width: 100%;
}
</style> 