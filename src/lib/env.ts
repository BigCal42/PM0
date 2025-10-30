/**
 * Runtime environment variable validation
 * Enforces configuration rules on every page load
 */

interface EnvConfig {
  useDemoData: boolean;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  sentryDsn?: string;
}

function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  return value.toLowerCase() === 'true';
}

function validateEnv(): EnvConfig {
  const useDemoData = parseBoolean(import.meta.env.VITE_USE_DEMO_DATA);

  if (useDemoData) {
    return {
      useDemoData: true,
      sentryDsn: import.meta.env.VITE_SENTRY_DSN,
    };
  }

  // When not using demo data, Supabase credentials are required
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required when VITE_USE_DEMO_DATA is false. ' +
        'Please set these environment variables or enable demo mode with VITE_USE_DEMO_DATA=true'
    );
  }

  return {
    useDemoData: false,
    supabaseUrl,
    supabaseAnonKey,
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  };
}

export const env = validateEnv();

