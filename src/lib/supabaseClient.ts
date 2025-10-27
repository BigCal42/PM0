import { createClient } from '@supabase/supabase-js';

type SupabaseClientType = ReturnType<typeof createClient>;

let cachedClient: SupabaseClientType | null = null;

export const getSupabaseClient = (): SupabaseClientType => {
  if (cachedClient) {
    return cachedClient;
  }

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.warn(
      'Supabase URL or ANON key missing. Authenticated features will be disabled until environment variables are set.',
    );
  }

  cachedClient = createClient(url ?? '', anonKey ?? '', {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return cachedClient;
};
