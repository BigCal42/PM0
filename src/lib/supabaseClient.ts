import { createClient } from '@supabase/supabase-js';
import { env } from './env';

type SupabaseClientType = ReturnType<typeof createClient>;

let cachedClient: SupabaseClientType | null = null;

export const getSupabaseClient = (): SupabaseClientType | null => {
  // Respect demo mode - return null to prevent any Supabase calls
  if (env.useDemoData) {
    return null;
  }

  // Return cached client if already initialized
  if (cachedClient) {
    return cachedClient;
  }

  // Get credentials from validated env
  const url = env.supabaseUrl;
  const anonKey = env.supabaseAnonKey;

  // Fail fast with clear error if credentials missing
  if (!url || !anonKey) {
    throw new Error(
      'Supabase credentials missing. Either set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, ' +
        'or set VITE_USE_DEMO_DATA=true to use demo mode.'
    );
  }

  // Create and cache the client
  cachedClient = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return cachedClient;
};
