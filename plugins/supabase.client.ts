import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // Kiểm tra environment variables
  if (!config.public.supabaseUrl || !config.public.supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Please check your .env file.')
    return {
      provide: {
        supabase: null
      }
    }
  }
  
  try {
    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    )

    return {
      provide: {
        supabase
      }
    }
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    return {
      provide: {
        supabase: null
      }
    }
  }
})

