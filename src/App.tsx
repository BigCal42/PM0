import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import AppShell from '@/layouts/AppShell';
import Sidebar, { type SidebarItem } from '@/components/Sidebar';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { ErrorMessage } from '@/components/ErrorMessage';
import { EstimationEngine } from '@/features/estimation/EstimationEngine';
import { HeatmapPlanner } from '@/features/heatmap/HeatmapPlanner';
import { ResourceManager } from '@/features/resources/ResourceManager';
import { ScenarioGenerator } from '@/features/scenarios/ScenarioGenerator';
import { ReadinessChecklist } from '@/features/readiness/ReadinessChecklist';
import { ExportCenter } from '@/features/exports/ExportCenter';
import { useProjectStore } from '@/store/useProjectStore';
import { useFeatureFlags } from '@/store/useFeatureFlags';
import { useResourceDataSource } from '@/features/resources/api';

type ViewId =
  | 'dashboard'
  | 'heatmap'
  | 'resources'
  | 'scenarios'
  | 'readiness'
  | 'export';

const navigationItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Program overview & KPIs.' },
  { id: 'heatmap', label: 'Heatmap', description: 'Staffing gaps across months.' },
  { id: 'resources', label: 'Resources', description: 'Manage roles and allocations.' },
  { id: 'scenarios', label: 'Scenarios', description: 'Model program trajectories.' },
  { id: 'readiness', label: 'Readiness Checklist', description: 'Track launch milestones.' },
  { id: 'export', label: 'Export Center', description: 'Download deliverables.' },
];

const viewTitles: Record<ViewId, string> = {
  dashboard: 'Dashboard',
  heatmap: 'Heatmap Planner',
  resources: 'Resource Management',
  scenarios: 'Scenario Studio',
  readiness: 'Readiness Checklist',
  export: 'Export Center',
};

export default function App(): JSX.Element {
  const [activeView, setActiveView] = useState<ViewId>('dashboard');
  const { setRoles, setResources, setHeatmap, setScenarios } = useProjectStore((state) => ({
    setRoles: state.setRoles,
    setResources: state.setResources,
    setHeatmap: state.setHeatmap,
    setScenarios: state.setScenarios,
  }));
  const { useDemoData } = useFeatureFlags();
  const { fetchRoles, fetchResources, fetchHeatmap, fetchScenarios } = useResourceDataSource();
  const modeKey = useDemoData ? 'demo' : 'live';

  const rolesQuery = useQuery({ queryKey: ['roles', modeKey], queryFn: fetchRoles });
  const resourcesQuery = useQuery({ queryKey: ['resources', modeKey], queryFn: fetchResources });
  const heatmapQuery = useQuery({ queryKey: ['heatmap', modeKey], queryFn: fetchHeatmap });
  const scenariosQuery = useQuery({ queryKey: ['scenarios', modeKey], queryFn: fetchScenarios });

  useEffect(() => {
    if (rolesQuery.data) {
      setRoles(rolesQuery.data);
    }
  }, [rolesQuery.data, setRoles]);

  useEffect(() => {
    if (resourcesQuery.data) {
      setResources(resourcesQuery.data);
    }
  }, [resourcesQuery.data, setResources]);

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

  const isLoading =
    rolesQuery.isLoading || resourcesQuery.isLoading || heatmapQuery.isLoading || scenariosQuery.isLoading;

  const queryError =
    rolesQuery.error || resourcesQuery.error || heatmapQuery.error || scenariosQuery.error || null;

  const errorMessage = useMemo(() => {
    if (!queryError) return null;
    if (queryError instanceof Error) return queryError.message;
    return 'Failed to load workspace data.';
  }, [queryError]);

  const handleSelectView = useCallback((id: string) => {
    setActiveView(id as ViewId);
  }, []);

  const viewContent = useMemo(() => {
    const heading = (
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-50">{viewTitles[activeView]}</h1>
        <p className="text-sm text-slate-300">
          Navigate between planning surfaces to configure staffing, scenarios, and delivery readiness.
        </p>
      </header>
    );

    if (isLoading) {
      return (
        <section className="flex h-full flex-col" aria-busy="true" data-testid={`${activeView}-view`}>
          {heading}
          <div className="flex flex-1 items-center justify-center">
            <LoadingOverlay label="Loading workspace data…" />
          </div>
        </section>
      );
    }

    switch (activeView) {
      case 'dashboard':
        return (
          <section className="space-y-6" data-testid="dashboard-view">
            {heading}
            <EstimationEngine />
          </section>
        );
      case 'heatmap':
        return (
          <section className="space-y-6" data-testid="heatmap-view">
            {heading}
            <HeatmapPlanner />
          </section>
        );
      case 'resources':
        return (
          <section className="space-y-6" data-testid="resources-view">
            {heading}
            <ResourceManager />
          </section>
        );
      case 'scenarios':
        return (
          <section className="space-y-6" data-testid="scenarios-view">
            {heading}
            <ScenarioGenerator />
          </section>
        );
      case 'readiness':
        return (
          <section className="space-y-6" data-testid="readiness-view">
            {heading}
            <ReadinessChecklist />
          </section>
        );
      case 'export':
        return (
          <section className="space-y-6" data-testid="export-view">
            {heading}
            <ExportCenter />
          </section>
        );
      default:
        return null;
    }
  }, [activeView, isLoading]);

  return (
    <AppShell
      sidebar={<Sidebar items={navigationItems} activeItemId={activeView} onSelect={handleSelectView} />}
    >
      <div className="flex flex-col gap-4">
        <ErrorMessage error={errorMessage} />
        {viewContent}
      </div>
    </AppShell>
  );
}
