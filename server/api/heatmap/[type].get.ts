export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, 'type')
  const query = getQuery(event)
  
  // Validate type parameter
  if (!['mobility', 'spending', 'opportunity'].includes(type || '')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid heatmap type'
    })
  }
  
  // Parse bounds from query
  const bounds = {
    north: Number(query.north) || 25.3,
    south: Number(query.south) || 25.1,
    east: Number(query.east) || 55.4,
    west: Number(query.west) || 55.1
  }
  
  // Generate mock heatmap data
  const data = generateMockHeatmapData(type, bounds, 500)
  
  return {
    success: true,
    type,
    data,
    bounds,
    timestamp: new Date().toISOString()
  }
})

function generateMockHeatmapData(
  type: string, 
  bounds: { north: number, south: number, east: number, west: number }, 
  count: number
) {
  const data = []
  
  for (let i = 0; i < count; i++) {
    const lat = bounds.south + Math.random() * (bounds.north - bounds.south)
    const lng = bounds.west + Math.random() * (bounds.east - bounds.west)
    
    let intensity = Math.random()
    
    // Adjust intensity based on type
    switch (type) {
      case 'mobility':
        // Higher intensity in commercial areas (simulated)
        if (Math.random() > 0.6) {
          intensity = 0.6 + Math.random() * 0.4 // 60-100%
        } else {
          intensity = Math.random() * 0.5 // 0-50%
        }
        break
        
      case 'spending':
        // Clustered around business districts
        if (Math.random() > 0.7) {
          intensity = 0.5 + Math.random() * 0.5 // 50-100%
        } else {
          intensity = Math.random() * 0.4 // 0-40%
        }
        break
        
      case 'opportunity':
        // More varied distribution
        intensity = 0.3 + Math.random() * 0.7 // 30-100%
        break
    }
    
    data.push({
      lat,
      lng,
      intensity,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  
  return data
} 