import React from 'react';
import Header from '@/components/Header';
import { AuthForm } from './AuthForm';
import { useSupabaseAuth } from './SupabaseAuthProvider';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { useFeatureFlags } from '../../store/useFeatureFlags';

export const AuthGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { session, loading } = useSupabaseAuth();
  const { useDemoData } = useFeatureFlags();

  if (useDemoData) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <LoadingOverlay label="Validating session…" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-slate-100 p-6">
          <AuthForm />
        </main>
      </div>
    );
  }

  return <>{children}</>;
};
