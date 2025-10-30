/**
 * Conditional Supabase client initialization
 * Disabled when VITE_USE_DEMO_DATA=true to avoid accidental network traffic
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';
import { logger } from './logger';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (env.useDemoData) {
    logger.debug('Demo mode enabled: Supabase client disabled');
    return null;
  }

  if (!supabaseClient) {
    if (!env.supabaseUrl || !env.supabaseAnonKey) {
      logger.error('Supabase credentials missing but demo mode is disabled');
      return null;
    }

    supabaseClient = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

    logger.info('Supabase client initialized');
  }

  return supabaseClient;
}

export const supabase = getSupabaseClient();

