import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client factory.
 *
 * Never bundle SUPABASE_SERVICE_ROLE_KEY into client code.
 */
export function createServerClient() {
  const url =
    process.env.VITE_SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error(
      'Missing Supabase URL. Set VITE_SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL) on the server.'
    );
  }

  if (!serviceRole) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY on the server environment.');
  }

  return createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
