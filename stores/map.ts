import { defineStore } from 'pinia'

export const useMapStore = defineStore('map', {
  state: () => ({
    heatmapType: 'mobility' as 'mobility' | 'spending' | 'opportunity',
    timeRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date()
    },
    selectedArea: null as GeoJSON.Feature | null,
    heatmapData: [] as any[],
    isLoading: false,
    mapCenter: [40.7128, -74.0060] as [number, number], // New York City coordinates
    mapZoom: 12,
    drawnLayers: [] as any[]
  }),
  
  getters: {
    hasSelectedArea: (state) => state.selectedArea !== null,
    heatmapDataFiltered: (state) => {
      // Filter heatmap data based on time range
      return state.heatmapData.filter(point => {
        const pointDate = new Date(point.timestamp)
        return pointDate >= state.timeRange.start && pointDate <= state.timeRange.end
      })
    },
    selectedAreaBounds: (state) => {
      if (!state.selectedArea?.geometry) return null
      
      // Calculate bounds for the selected area
      const coords = state.selectedArea.geometry.coordinates[0]
      const lats = coords.map((coord: number[]) => coord[1])
      const lngs = coords.map((coord: number[]) => coord[0])
      
      return {
        north: Math.max(...lats),
        south: Math.min(...lats),
        east: Math.max(...lngs),
        west: Math.min(...lngs)
      }
    }
  },
  
  actions: {
    setHeatmapType(type: 'mobility' | 'spending' | 'opportunity') {
      this.heatmapType = type
      this.loadHeatmapData()
    },
    
    setTimeRange(start: Date, end: Date) {
      this.timeRange = { start, end }
      this.loadHeatmapData()
    },
    
    setSelectedArea(area: GeoJSON.Feature | null) {
      this.selectedArea = area
    },
    
    setMapView(center: [number, number], zoom: number) {
      this.mapCenter = center
      this.mapZoom = zoom
    },
    
    addDrawnLayer(layer: any) {
      this.drawnLayers.push(layer)
    },
    
    removeDrawnLayer(layerId: string) {
      this.drawnLayers = this.drawnLayers.filter(layer => layer.id !== layerId)
    },
    
    clearDrawnLayers() {
      this.drawnLayers = []
    },
    
    async loadHeatmapData() {
      this.isLoading = true
      
      try {
        const { data } = await $fetch('/api/heatmap/' + this.heatmapType, {
          query: {
            start: this.timeRange.start.toISOString(),
            end: this.timeRange.end.toISOString(),
            ...this.selectedAreaBounds
          }
        })
        
        this.heatmapData = data || []
      } catch (error) {
        console.error('Failed to load heatmap data:', error)
        this.heatmapData = []
      } finally {
        this.isLoading = false
      }
    },
    
    async generateMockData() {
      try {
        await $fetch('/api/mock-data/generate', {
          method: 'POST',
          body: {
            bounds: this.selectedAreaBounds || {
              north: this.mapCenter[0] + 0.1,
              south: this.mapCenter[0] - 0.1,
              east: this.mapCenter[1] + 0.1,
              west: this.mapCenter[1] - 0.1
            }
          }
        })
        
        // Reload data after generation
        await this.loadHeatmapData()
      } catch (error) {
        console.error('Failed to generate mock data:', error)
      }
    }
  }
})