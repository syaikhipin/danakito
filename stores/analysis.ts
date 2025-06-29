import { defineStore } from 'pinia'
import { DanakitoAnalyzer, type AnalysisResult, type UrbanAnalysisParams, type AgriculturalAnalysisParams } from '~/utils/analysisEngine'

export const useAnalysisStore = defineStore('analysis', {
  state: () => ({
    currentAnalysis: null as AnalysisResult | null,
    isAnalyzing: false,
    analysisHistory: [] as AnalysisResult[],
    selectedInvestmentType: '' as string,
    investmentAmount: 100000,
    selectedCrops: [] as string[],
    analysisError: null as string | null
  }),
  
  getters: {
    hasAnalysis: (state) => state.currentAnalysis !== null,
    overallScore: (state) => state.currentAnalysis?.scores.overall || 0,
    roiProjection: (state) => state.currentAnalysis?.roiProjections.realistic || null,
    confidenceLevel: (state) => state.currentAnalysis?.confidence || 0,
    scoreColor: (state) => {
      const score = state.currentAnalysis?.scores.overall || 0
      if (score >= 0.8) return 'green'
      if (score >= 0.6) return 'yellow'
      return 'red'
    }
  },
  
  actions: {
    setInvestmentType(type: string) {
      this.selectedInvestmentType = type
    },
    
    setInvestmentAmount(amount: number) {
      this.investmentAmount = amount
    },
    
    setSelectedCrops(crops: string[]) {
      this.selectedCrops = crops
    },
    
    async runUrbanAnalysis(params: {
      geometry: GeoJSON.Feature
      investmentType: 'shop' | 'restaurant' | 'service'
      investmentAmount: number
    }) {
      this.isAnalyzing = true
      this.analysisError = null
      
      try {
        // Fetch relevant data for analysis
        const [mobilityResponse, ewalletResponse] = await Promise.all([
          $fetch('/api/data/mobility', {
            query: this.getBoundsFromGeometry(params.geometry)
          }),
          $fetch('/api/data/ewallet', {
            query: this.getBoundsFromGeometry(params.geometry)
          })
        ])
        
        const analyzer = new DanakitoAnalyzer()
        const analysisParams: UrbanAnalysisParams = {
          geometry: params.geometry,
          investmentType: params.investmentType,
          investmentAmount: params.investmentAmount,
          mobilityData: mobilityResponse.data || [],
          ewalletData: ewalletResponse.data || []
        }
        
        const result = await analyzer.analyzeUrbanInvestment(analysisParams)
        
        this.currentAnalysis = result
        this.analysisHistory.push(result)
        
        // Store analysis in database
        await $fetch('/api/analysis/save', {
          method: 'POST',
          body: {
            geometry: params.geometry,
            investmentType: params.investmentType,
            investmentAmount: params.investmentAmount,
            result
          }
        })
        
      } catch (error) {
        console.error('Urban analysis failed:', error)
        this.analysisError = 'Failed to analyze urban investment. Please try again.'
      } finally {
        this.isAnalyzing = false
      }
    },
    
    async runAgriculturalAnalysis(params: {
      geometry: GeoJSON.Feature
      cropTypes: string[]
      investmentAmount: number
    }) {
      this.isAnalyzing = true
      this.analysisError = null
      
      try {
        // Fetch agricultural data
        const agriculturalResponse = await $fetch('/api/data/agricultural', {
          query: this.getBoundsFromGeometry(params.geometry)
        })
        
        const analyzer = new DanakitoAnalyzer()
        const analysisParams: AgriculturalAnalysisParams = {
          geometry: params.geometry,
          cropTypes: params.cropTypes,
          investmentAmount: params.investmentAmount,
          soilData: agriculturalResponse.data?.soil_quality || {},
          climateData: { zone: agriculturalResponse.data?.climate_zone || 'temperate' }
        }
        
        const result = await analyzer.analyzeAgriculturalInvestment(analysisParams)
        
        // Convert agricultural result to standard format
        this.currentAnalysis = this.convertAgriculturalResult(result)
        this.analysisHistory.push(this.currentAnalysis)
        
        // Store analysis in database
        await $fetch('/api/analysis/save', {
          method: 'POST',
          body: {
            geometry: params.geometry,
            investmentType: 'agricultural',
            investmentAmount: params.investmentAmount,
            cropTypes: params.cropTypes,
            result: this.currentAnalysis
          }
        })
        
      } catch (error) {
        console.error('Agricultural analysis failed:', error)
        this.analysisError = 'Failed to analyze agricultural investment. Please try again.'
      } finally {
        this.isAnalyzing = false
      }
    },
    
    clearAnalysis() {
      this.currentAnalysis = null
      this.analysisError = null
    },
    
    clearError() {
      this.analysisError = null
    },
    
    getBoundsFromGeometry(geometry: GeoJSON.Feature): Record<string, number> {
      if (geometry.geometry.type === 'Polygon') {
        const coords = geometry.geometry.coordinates[0]
        const lats = coords.map((coord: number[]) => coord[1])
        const lngs = coords.map((coord: number[]) => coord[0])
        
        return {
          north: Math.max(...lats),
          south: Math.min(...lats),
          east: Math.max(...lngs),
          west: Math.min(...lngs)
        }
      }
      
      // Default bounds if not a polygon
      return {
        north: 25.3,
        south: 25.1,
        east: 55.4,
        west: 55.1
      }
    },
    
    convertAgriculturalResult(result: any): AnalysisResult {
      // Convert agricultural analysis to standard format
      return {
        scores: {
          mobility: 0,
          spending: 0,
          competition: 1 - Math.random() * 0.3, // Less competition in agricultural
          overall: result.sustainabilityScore || 0.8
        },
        roiProjections: result.roiAnalysis || {
          pessimistic: { annualROI: 0.08, breakevenMonths: 36, fiveYearReturn: 0 },
          realistic: { annualROI: 0.12, breakevenMonths: 24, fiveYearReturn: 0 },
          optimistic: { annualROI: 0.18, breakevenMonths: 18, fiveYearReturn: 0 }
        },
        riskFactors: Object.values(result.yieldForecasts || {}).flatMap((f: any) => f.riskFactors || []),
        recommendations: result.recommendations || [],
        confidence: Object.values(result.yieldForecasts || {}).reduce((avg: number, f: any) => avg + (f.confidence || 0), 0) / Object.keys(result.yieldForecasts || {}).length || 0.9
      }
    }
  }
}) 