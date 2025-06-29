import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
})

// Make Leaflet globally available for components
if (process.client) {
  (window as any).L = L
}

// Initialize Leaflet plugins
export default defineNuxtPlugin(() => {
  // Leaflet is now ready for use
  console.log('🗺️ Leaflet with drawing tools initialized on client-side')
}) 