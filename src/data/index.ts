import { DataAdapter } from './types';
import { demoAdapter } from './demoAdapter';
import { supabaseAdapter } from './supabaseAdapter';
import { env } from '@/lib/env';

/**
 * Get the appropriate data adapter based on environment
 */
export function getDataAdapter(): DataAdapter {
  return env.useDemoData ? demoAdapter : supabaseAdapter;
}

export { demoAdapter, supabaseAdapter };
export type { Project, Scenario } from './types';

