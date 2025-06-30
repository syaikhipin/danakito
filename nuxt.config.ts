// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-06-29',
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  css: [
    'leaflet/dist/leaflet.css',
    'leaflet-draw/dist/leaflet.draw.css'
  ],
  runtimeConfig: {
    openrouterApiKey: process.env.OPENROUTER_API_KEY || '',
    geminiApiKey: process.env.GEMINI_API_KEY,
    geminiModel: process.env.GEMINI_MODEL,
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
  ssr: false,
  target: 'static',
  nitro: {
    experimental: {
      wasm: true
    },
    output: {
      dir: 'dist'
    },
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/analysis',
        '/analysis-report',
        '/credit-analysis'
      ]
    }
  },
  generate: {
    fallback: true
  },
  typescript: {
    strict: true
  }
}) 