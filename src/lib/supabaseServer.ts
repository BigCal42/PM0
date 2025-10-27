import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client factory.
 *
 * Never bundle SUPABASE_SERVICE_ROLE_KEY into client code.
 */
export function createServerClient() {
  const url = process.env.VITE_SUPABASE_URL!;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
