import { getSupabaseClient } from './supabaseClient';
import { logger } from './logger';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

/**
 * Authentication utilities
 * Wraps Supabase Auth with PM0-specific helpers
 */
export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase client not available. Demo mode is enabled.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    logger.error('Sign in error:', error);
    throw error;
  }

  logger.info('User signed in:', { userId: data.user.id });
  return data;
}

export async function signUp(email: string, password: string, metadata?: { name?: string }) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Authentication is not available in demo mode. Please configure Supabase to enable authentication.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) {
    logger.error('Sign up error:', error);
    throw error;
  }

  logger.info('User signed up:', { userId: data.user?.id });
  return data;
}

export async function signOut() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return;
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    logger.error('Sign out error:', error);
    throw error;
  }

  logger.info('User signed out');
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name,
  };
}

export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    callback(null);
    return () => {};
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name,
      });
    } else {
      callback(null);
    }
  });

  return () => {
    subscription.unsubscribe();
  };
}

