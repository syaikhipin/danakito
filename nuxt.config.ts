// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-06-29',
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/danakito/' : '/',
    buildAssetsDir: '/_nuxt/'
  },
  router: {
    base: process.env.NODE_ENV === 'production' ? '/danakito/' : '/'
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  css: [
    'leaflet/dist/leaflet.css',
    'leaflet-draw/dist/leaflet.draw.css',
    '~/public/override.css'
  ],
  runtimeConfig: {
    openrouterApiKey: process.env.OPENROUTER_API_KEY || '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      mapDefaultLat: process.env.NUXT_PUBLIC_MAP_DEFAULT_LAT || '40.7128',
      mapDefaultLng: process.env.NUXT_PUBLIC_MAP_DEFAULT_LNG || '-74.0060',
      mapDefaultZoom: process.env.NUXT_PUBLIC_MAP_DEFAULT_ZOOM || '12',
      enableMockData: process.env.NUXT_PUBLIC_ENABLE_MOCK_DATA || 'true',
      enableAgricultural: process.env.NUXT_PUBLIC_ENABLE_AGRICULTURAL || 'true'
    }
  },
  nitro: {
    preset: 'netlify',
    experimental: {
      wasm: true
    }
  },
  generate: {
    fallback: true
  },
  typescript: {
    strict: true
  }
}) 