/**
 * ScenarioLab page
 * Tweak levers (timeline/scope/FTE) with live deltas to cost, risk, and dates
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '@/hooks/useProjects';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { Loading } from '@/components/Loading';
import { Button } from '@/components/Button';
import { useToast } from '@/hooks/useToast';
import { LeversPanel, type LeverValues } from '@/components/scenario/LeversPanel';
import { MetricsPanel } from '@/components/scenario/MetricsPanel';
import { RiskCallouts } from '@/components/scenario/RiskCallouts';
import { strings } from '@/content/strings';
import { logger } from '@/lib/logger';

export function ScenarioLab() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: project, isLoading } = useProject(id || '');

  // Initial lever values (baseline)
  const [levers, setLevers] = useState<LeverValues>({
    timelinePercent: 100,
    scopePercent: 100,
    fteParallelization: 1.0,
    testingCompression: 1.0,
  });

  // Baseline metrics (would come from project data)
  const baselineMetrics = {
    timelineMonths: 18,
    totalFTE: 12,
    baseCostPerFTEMonth: 15000,
  };

  const handleSnapshot = async () => {
    const scenarioName = prompt(strings.lab.snapshot.placeholder);
    if (!scenarioName) return;

    const supabase = getSupabaseClient();
    if (!supabase) {
      toast.warning(strings.lab.snapshot.error, 'Database connection required');
      return;
    }

    try {
      // Try to call RPC if available
      const { data, error } = await supabase.rpc('store_scenario_from_gaps', {
        project_id: id,
        name: scenarioName,
        levers: levers,
      });

      if (error) {
        logger.warn('RPC not available', error);
        toast.warning(strings.lab.snapshot.error, 'Scenario RPC not available');
        return;
      }

      toast.success(strings.lab.snapshot.success);
    } catch (err) {
      logger.error('Error saving scenario', err);
      toast.error('Failed to save scenario', 'Please try again');
    }
  };

  const handleReset = () => {
    setLevers({
      timelinePercent: 100,
      scopePercent: 100,
      fteParallelization: 1.0,
      testingCompression: 1.0,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading message={strings.common.loading} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Project not found</p>
        <Button onClick={() => navigate('/hub')} className="mt-4">
          Back to Hub
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {strings.lab.title}
          </h1>
          <p className="text-gray-600">{project.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate(`/project/${id}/canvas`)}>
            Back to Canvas
          </Button>
          <Button variant="secondary" onClick={() => navigate('/hub')}>
            Back to Hub
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-600">{strings.lab.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Levers Panel */}
        <div>
          <LeversPanel values={levers} onChange={setLevers} />
          <div className="mt-4 flex gap-2">
            <Button onClick={handleReset} variant="secondary" className="w-full">
              {strings.lab.levers.reset}
            </Button>
            <Button onClick={handleSnapshot} variant="primary" className="w-full">
              {strings.lab.snapshot.button}
            </Button>
          </div>
        </div>

        {/* Center: Metrics Panel */}
        <div>
          <MetricsPanel levers={levers} baselineMetrics={baselineMetrics} />
        </div>

        {/* Right: Risk Callouts */}
        <div>
          <RiskCallouts levers={levers} />
        </div>
      </div>
    </div>
  );
}
