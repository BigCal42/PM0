import React, { useEffect } from 'react';
import { AuthForm } from './AuthForm';
import { useSupabaseAuth } from './SupabaseAuthProvider';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { useFeatureFlags } from '../../store/useFeatureFlags';

export const AuthGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { session, loading } = useSupabaseAuth();
  const { useDemoData, setUseDemoData } = useFeatureFlags();

  useEffect(() => {
    if (session && useDemoData) {
      setUseDemoData(false);
    }
  }, [session, useDemoData, setUseDemoData]);

  if (useDemoData) {
    return (
      <>
        <div className="fixed bottom-4 right-4 z-50 flex max-w-xs items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-lg">
          <div className="flex-1">
            <p className="font-semibold">Demo mode enabled</p>
            <p className="text-xs text-amber-800">Switch back to live data to sign in with your account.</p>
          </div>
          <button
            type="button"
            onClick={() => setUseDemoData(false)}
            className="rounded-md border border-amber-300 px-3 py-1 text-xs font-medium text-amber-900 transition hover:border-amber-400 hover:bg-amber-100"
          >
            Use live data
          </button>
        </div>
        {children}
      </>
    );
  }

  if (loading) {
    return <LoadingOverlay label="Validating session…" />;
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <AuthForm />
      </div>
    );
  }

  return <>{children}</>;
};
