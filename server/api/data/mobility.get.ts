export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  const bounds = {
    north: Number(query.north) || 25.3,
    south: Number(query.south) || 25.1,
    east: Number(query.east) || 55.4,
    west: Number(query.west) || 55.1
  }
  
  // Generate mock mobility data
  const data: Array<{
    id: string
    location: { coordinates: [number, number] }
    foot_traffic: number
    dwell_time: number
    timestamp: string
    day_type: string
  }> = []
  
  for (let i = 0; i < 100; i++) {
    const lat = bounds.south + Math.random() * (bounds.north - bounds.south)
    const lng = bounds.west + Math.random() * (bounds.east - bounds.west)
    
    // Higher traffic in commercial areas (60% chance)
    const isCommercial = Math.random() > 0.4
    const footTraffic = isCommercial 
      ? 200 + Math.floor(Math.random() * 500)  // 200-700
      : 20 + Math.floor(Math.random() * 100)   // 20-120
    
    data.push({
      id: `mob_${i}`,
      location: { coordinates: [lng, lat] },
      foot_traffic: footTraffic,
      dwell_time: 5 + Math.floor(Math.random() * 120), // 5-125 minutes
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      day_type: Math.random() > 0.3 ? 'weekday' : 'weekend'
    })
  }
  
  return {
    success: true,
    data,
    count: data.length
  }
}) 