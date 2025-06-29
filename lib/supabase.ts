import { createClient } from '@supabase/supabase-js'

export interface Database {
  public: {
    Tables: {
      analysis_areas: {
        Row: {
          id: string
          user_id: string
          name: string
          geometry: any
          investment_type: 'shop' | 'restaurant' | 'service' | 'agricultural'
          investment_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          geometry: any
          investment_type: 'shop' | 'restaurant' | 'service' | 'agricultural'
          investment_amount: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          geometry?: any
          investment_type?: 'shop' | 'restaurant' | 'service' | 'agricultural'
          investment_amount?: number
          created_at?: string
        }
      }
      mobility_data: {
        Row: {
          id: string
          location: any
          timestamp: string
          foot_traffic: number
          dwell_time: number
          day_type: 'weekday' | 'weekend' | 'holiday'
        }
        Insert: {
          id?: string
          location: any
          timestamp: string
          foot_traffic: number
          dwell_time: number
          day_type: 'weekday' | 'weekend' | 'holiday'
        }
        Update: {
          id?: string
          location?: any
          timestamp?: string
          foot_traffic?: number
          dwell_time?: number
          day_type?: 'weekday' | 'weekend' | 'holiday'
        }
      }
      ewallet_transactions: {
        Row: {
          id: string
          location: any
          amount: number
          category: string
          merchant_type: string
          timestamp: string
        }
        Insert: {
          id?: string
          location: any
          amount: number
          category: string
          merchant_type: string
          timestamp: string
        }
        Update: {
          id?: string
          location?: any
          amount?: number
          category?: string
          merchant_type?: string
          timestamp?: string
        }
      }
      agricultural_data: {
        Row: {
          id: string
          geometry: any
          soil_quality: any
          crop_history: any
          yield_data: any
          climate_zone: string
        }
        Insert: {
          id?: string
          geometry: any
          soil_quality: any
          crop_history: any
          yield_data: any
          climate_zone: string
        }
        Update: {
          id?: string
          geometry?: any
          soil_quality?: any
          crop_history?: any
          yield_data?: any
          climate_zone?: string
        }
      }
    }
  }
}

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export const useSupabase = () => {
  if (!supabaseClient) {
    const config = useRuntimeConfig()
    supabaseClient = createClient<Database>(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )
  }
  return supabaseClient
} 