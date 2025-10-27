import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '../../lib/supabaseClient';

const Supabase = getSupabaseClient();

type SupabaseAuthContextValue = {
  session: Session | null;
  loading: boolean;
};

const SupabaseAuthContext = createContext<SupabaseAuthContextValue | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const syncSession = async () => {
      const { data } = await Supabase.auth.getSession();
      if (active) {
        setSession(data.session ?? null);
        setLoading(false);
      }
    };

    syncSession();

    const { data: subscription } = Supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription?.subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseAuthContext.Provider value={{ session, loading }}>{children}</SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = (): SupabaseAuthContextValue => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within SupabaseAuthProvider');
  }
  return context;
};

export { Supabase };
