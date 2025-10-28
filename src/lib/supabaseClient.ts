import { createClient } from '@supabase/supabase-js';
import { env } from './env';

type SupabaseClientType = ReturnType<typeof createClient>;

const createDemoSupabaseClient = (): SupabaseClientType => {
  const unavailable = (operation: string) =>
    new Error(`${operation} is not available when VITE_USE_DEMO_DATA=true.`);

  const authStub = {
    async getSession() {
      return { data: { session: null }, error: null };
    },
    onAuthStateChange() {
      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
        error: null,
      };
    },
    async signInWithPassword() {
      return {
        data: { user: null, session: null },
        error: unavailable('supabase.auth.signInWithPassword'),
      };
    },
    async signUp() {
      return {
        data: { user: null, session: null },
        error: unavailable('supabase.auth.signUp'),
      };
    },
    async signOut() {
      return { error: null };
    },
  };

  return new Proxy({ auth: authStub } as Record<string, unknown>, {
    get(target, prop) {
      if (prop === 'auth') {
        return target.auth;
      }

      return () => {
        throw unavailable(`supabase.${String(prop)}`);
      };
    },
  }) as SupabaseClientType;
};

let cachedClient: SupabaseClientType | null = null;
const demoClient = createDemoSupabaseClient();

export const getSupabaseClient = (): SupabaseClientType => {
  // Respect demo mode by returning a guarded stub client
  if (env.useDemoData) {
    return demoClient;
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
