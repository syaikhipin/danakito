export const useMockData = () => {
  const generateMobilityData = (bounds: any, count: number = 1000) => {
    const data = []
    
    for (let i = 0; i < count; i++) {
      const lat = bounds.south + Math.random() * (bounds.north - bounds.south)
      const lng = bounds.west + Math.random() * (bounds.east - bounds.west)
      
      // Higher traffic in commercial zones (60% chance)
      const isCommercial = Math.random() > 0.4
      const footTraffic = isCommercial 
        ? 200 + Math.floor(Math.random() * 500)  // 200-700
        : 20 + Math.floor(Math.random() * 100)   // 20-120
      
      data.push({
        location: { coordinates: [lng, lat] },
        foot_traffic: footTraffic,
        dwell_time: 5 + Math.floor(Math.random() * 120), // 5-125 minutes
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        day_type: Math.random() > 0.3 ? 'weekday' : 'weekend'
      })
    }
    
    return data
  }
  
  const generateEwalletData = (bounds: any, count: number = 500) => {
    const categories = ['Food & Dining', 'Shopping', 'Entertainment', 'Services', 'Transport']
    const merchantTypes = ['restaurant', 'cafe', 'retail', 'grocery', 'service']
    
    const data = []
    
    for (let i = 0; i < count; i++) {
      const lat = bounds.south + Math.random() * (bounds.north - bounds.south)
      const lng = bounds.west + Math.random() * (bounds.east - bounds.west)
      
      data.push({
        location: { coordinates: [lng, lat] },
        amount: 10 + Math.random() * 490, // $10-500
        category: categories[Math.floor(Math.random() * categories.length)],
        merchant_type: merchantTypes[Math.floor(Math.random() * merchantTypes.length)],
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      })
    }
    
    return data
  }
  
  const generateAgriculturalData = (polygon: any) => {
    const soilTypes = ['clay', 'sandy', 'loam', 'silt']
    
    return {
      geometry: polygon,
      soil_quality: {
        type: soilTypes[Math.floor(Math.random() * soilTypes.length)],
        pH: 5.5 + Math.random() * 2.5, // 5.5-8.0
        organic_matter: Math.random() * 5, // 0-5%
        nitrogen: Math.random() * 100, // 0-100 kg/ha
        phosphorus: Math.random() * 50, // 0-50 kg/ha
        potassium: Math.random() * 200 // 0-200 kg/ha
      },
      crop_history: {
        wheat: 3 + Math.random() * 7, // 3-10 tons/ha
        corn: 4 + Math.random() * 8,
        rice: 3.5 + Math.random() * 6.5
      },
      yield_data: {
        last_year: 5 + Math.random() * 3,
        average_5_year: 4.5 + Math.random() * 2.5
      },
      climate_zone: ['tropical', 'subtropical', 'temperate', 'arid'][Math.floor(Math.random() * 4)]
    }
  }
  
  return {
    generateMobilityData,
    generateEwalletData,
    generateAgriculturalData
  }
} 