import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { Supabase } from './SupabaseAuthProvider';
import { ErrorMessage } from '../../components/ErrorMessage';
import { useFeatureFlags } from '../../store/useFeatureFlags';

const authSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthMode = 'signIn' | 'signUp';

export const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [formError, setFormError] = useState<string | null>(null);
  const { useDemoData, setUseDemoData } = useFeatureFlags();

  const mutation = useMutation({
    mutationFn: async (form: { email: string; password: string }) => {
      const parsed = authSchema.safeParse(form);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? 'Validation error');
      }

      if (mode === 'signIn') {
        const { error } = await Supabase.auth.signInWithPassword(form);
        if (error) throw error;
      } else {
        const { error } = await Supabase.auth.signUp(form);
        if (error) throw error;
      }
    },
    onError: (error) => {
      setFormError(error instanceof Error ? error.message : 'Unexpected error');
    },
    onSuccess: () => setFormError(null),
  });

  const handleUseDemoMode = () => {
    setUseDemoData(true);
  };

  const handleUseLiveData = () => {
    setUseDemoData(false);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    mutation.mutate({ email, password });
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow">
      <div className="space-y-2 text-center">
        <h1 className="text-lg font-semibold text-slate-900">Sign in to PM0</h1>
        <p className="text-sm text-slate-600">
          Use your enterprise email and password. New users can create an account via the sign-up tab.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-sm font-medium">
          <button
            type="button"
            onClick={handleUseDemoMode}
            className="rounded-md border border-slate-200 px-3 py-1 text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            Use demo mode
          </button>
          {useDemoData && (
            <button
              type="button"
              onClick={handleUseLiveData}
              className="rounded-md border border-slate-200 px-3 py-1 text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
            >
              Use live data
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-center gap-2 text-sm">
        <button
          type="button"
          className={`rounded-md px-3 py-1 font-medium ${mode === 'signIn' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setMode('signIn')}
        >
          Sign In
        </button>
        <button
          type="button"
          className={`rounded-md px-3 py-1 font-medium ${mode === 'signUp' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          onClick={() => setMode('signUp')}
        >
          Sign Up
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-left text-sm font-medium text-slate-700">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 focus:border-slate-500 focus:outline-none focus:ring"
          />
        </label>
        <label className="block text-left text-sm font-medium text-slate-700">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 focus:border-slate-500 focus:outline-none focus:ring"
          />
        </label>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {mutation.isPending ? 'Processing…' : mode === 'signIn' ? 'Sign In' : 'Create Account'}
        </button>
      </form>
      <ErrorMessage error={formError} />
    </div>
  );
};
