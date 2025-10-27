import React from 'react';
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
