import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthGate } from './features/auth/AuthGate';
import { ResourceManager } from './features/resources/ResourceManager';
import { HeatmapPlanner } from './features/heatmap/HeatmapPlanner';
import { ScenarioGenerator } from './features/scenarios/ScenarioGenerator';
import { EstimationEngine } from './features/estimation/EstimationEngine';
import { ExportCenter } from './features/exports/ExportCenter';
import { ReadinessChecklist } from './features/readiness/ReadinessChecklist';
import { useResourceDataSource } from './features/resources/api';
import { useProjectStore } from './store/useProjectStore';
import { LoadingOverlay } from './components/LoadingOverlay';
import { Supabase, useSupabaseAuth } from './features/auth/SupabaseAuthProvider';
import { useFeatureFlags } from './store/useFeatureFlags';

const heatmapQueryKey = ['heatmap'];
const scenariosQueryKey = ['scenarios'];

const DashboardShell: React.FC = () => {
  const { setHeatmap, setScenarios } = useProjectStore((state) => ({
    setHeatmap: state.setHeatmap,
    setScenarios: state.setScenarios,
  }));
  const { fetchHeatmap, fetchScenarios } = useResourceDataSource();
  const heatmapQuery = useQuery({ queryKey: heatmapQueryKey, queryFn: fetchHeatmap });
  const scenariosQuery = useQuery({ queryKey: scenariosQueryKey, queryFn: fetchScenarios });
  const { useDemoData } = useFeatureFlags();

  useEffect(() => {
    if (heatmapQuery.data) {
      setHeatmap(heatmapQuery.data);
    }
  }, [heatmapQuery.data, setHeatmap]);

  useEffect(() => {
    if (scenariosQuery.data) {
      setScenarios(scenariosQuery.data);
    }
  }, [scenariosQuery.data, setScenarios]);

  if ((heatmapQuery.isLoading || scenariosQuery.isLoading) && !useDemoData) {
    return <LoadingOverlay label="Loading portfolio data…" />;
  }

  if (heatmapQuery.error || scenariosQuery.error) {
    return (
      <div className="p-6 text-sm text-rose-600">
        Failed to load data. Verify Supabase credentials and RLS policies.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <HeatmapPlanner />
          <ReadinessChecklist />
        </div>
        <EstimationEngine />
        <ScenarioGenerator />
        <ResourceManager />
        <ExportCenter />
      </main>
    </div>
  );
};

const Header: React.FC = () => {
  const { session } = useSupabaseAuth();
  const { useDemoData } = useFeatureFlags();

  const handleSignOut = () => {
    if (useDemoData) return;
    Supabase.auth.signOut();
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">PM0 Planning Workspace</h1>
          <p className="text-xs text-slate-500">
            Heatmap-driven staffing, scenario modeling, and export center built on Supabase and Vercel.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600">
          {useDemoData ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-800">Demo Mode</span>
          ) : (
            <>
              <span>{session?.user.email}</span>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  return (
    <AuthGate>
      <DashboardShell />
    </AuthGate>
  );
};

export default App;
