/**
 * ProjectCanvas page
 * Intake + Complexity + Gaps + Scenarios in one adaptive workspace
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '@/hooks/useProjects';
import { Loading } from '@/components/Loading';
import { Button } from '@/components/Button';
import { IntakeSummary } from '@/components/canvas/IntakeSummary';
import { ComplexityDial } from '@/components/canvas/ComplexityDial';
import { GapsMatrix } from '@/components/canvas/GapsMatrix';
import { ScenarioCompare } from '@/components/canvas/ScenarioCompare';
import { strings } from '@/content/strings';
import type { ComplexityFactors } from '@/lib/derive/complexity';

export function ProjectCanvas() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading } = useProject(id || '');

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

  // Mock complexity factors (would come from project intake data)
  const complexityFactors: ComplexityFactors = {
    systemCount: 3,
    integrationCount: 5,
    userCount: 5000,
    regulatoryRequirements: ['HIPAA', 'Joint Commission'],
    legacySystemCount: 2,
    geographicLocations: 3,
    customizations: 8,
  };

  // Mock baseline metrics (would come from project data)
  const baselineMetrics = {
    timelineMonths: 18,
    totalFTE: 12,
    baseCostPerFTEMonth: 15000,
  };

  // Mock assumptions (would come from project data)
  const assumptions = {
    goLiveDate: '2025-12-31',
    budget: 5000000,
    scope: 'Epic implementation Phase 1',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {strings.canvas.title}
          </h1>
          <p className="text-gray-600">{project.name}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/project/${id}/scenario-lab`)}
          >
            Open Scenario Lab
          </Button>
          <Button variant="secondary" onClick={() => navigate('/hub')}>
            Back to Hub
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Rail: Intake Summary + Complexity */}
        <div className="space-y-6">
          <IntakeSummary
            projectId={id || ''}
            assumptions={assumptions}
            onAssumptionsChange={(newAssumptions) => {
              // Would save to backend
              console.log('Assumptions updated:', newAssumptions);
            }}
          />
          <ComplexityDial factors={complexityFactors} />
        </div>

        {/* Center: Gaps Matrix */}
        <div>
          <GapsMatrix projectId={id || ''} />
        </div>

        {/* Right Rail: Scenario Compare */}
        <div>
          <ScenarioCompare projectId={id || ''} baselineMetrics={baselineMetrics} />
        </div>
      </div>
    </div>
  );
}
