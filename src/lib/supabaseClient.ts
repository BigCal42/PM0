import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '@/types/database'
import { env } from './env'

let cachedClient: SupabaseClient<Database> | null = null

export function getSupabaseClient(): SupabaseClient<Database> {
  if (env.useDemoData) {
    throw new Error('Supabase client is not available in demo mode. Disable VITE_USE_DEMO_DATA to connect to the backend.')
  }

  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error('Supabase environment variables are missing. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  }

  if (!cachedClient) {
    cachedClient = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        persistSession: true
      }
    })
  }

  return cachedClient
}

export const isDemoMode = env.useDemoData
export const sentryDsn = env.sentryDsn
