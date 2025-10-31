/**
 * HomeHub page
 * Portfolio snapshot + "3 questions to answer today"
 */

import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import { usePhaseGaps } from '@/hooks/useGaps';
import { KpiCard } from '@/components/cards/KpiCard';
import { QuickWhyThisPlan } from '@/components/ai/QuickWhyThisPlan';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import {
  calculateConfidenceIndex,
  identifyTopBlockers,
  calculateSavingsAtStake,
  getConfidenceColor,
} from '@/lib/derive/kpi';
import { strings, formatString } from '@/content/strings';

export function HomeHub() {
  const navigate = useNavigate();
  const { data: projects, isLoading: projectsLoading } = useProjects();

  // Get gaps for the first active project (if available)
  const activeProject = projects?.find(p => p.status === 'active');
  const { data: gaps, isLoading: gapsLoading } = usePhaseGaps(activeProject?.id || '');

  if (projectsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading message={strings.common.loading} />
      </div>
    );
  }

  const activeProjectsCount = projects?.filter(p => p.status === 'active').length || 0;
  const scenariosWithGaps = gaps && gaps.length > 0 ? 1 : 0; // Simplified for now

  // Calculate KPIs
  const confidenceIndex = gaps ? calculateConfidenceIndex(gaps) : null;
  const topBlockers = gaps ? identifyTopBlockers(gaps) : [];
  const savings = calculateSavingsAtStake(activeProjectsCount);

  // Calculate days to next stage-gate (mock for now)
  const daysToStageGate = 45; // Would come from actual project data

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {strings.hub.title}
        </h1>
        <p className="text-gray-600">{strings.hub.subtitle}</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KpiCard
          title={strings.hub.kpi.activeProjects}
          value={activeProjectsCount}
        />
        <KpiCard
          title={strings.hub.kpi.unresolvedGaps}
          value={scenariosWithGaps}
        />
        <KpiCard
          title={strings.hub.kpi.daysToStageGate}
          value={daysToStageGate}
          description="Estimated"
        />
      </div>

      {/* Insight Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title={strings.hub.insights.topBlockers}>
          {gapsLoading ? (
            <Loading message={strings.common.loading} />
          ) : topBlockers.length > 0 ? (
            <ul className="space-y-2">
              {topBlockers.map((blocker, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium text-gray-900">
                    {blocker.phaseName} / {blocker.roleName}
                  </span>
                  <span className="text-gray-600 ml-2">
                    ({blocker.gapPercent}% gap)
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{blocker.impact}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">{strings.common.noData}</p>
          )}
        </Card>

        <Card title={strings.hub.insights.savingsAtStake}>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-900">
              ${(savings.costSavings / 1000).toFixed(0)}K
            </p>
            <p className="text-sm text-gray-600">
              {formatString(strings.valueProps.savingsAtStake, {
                hours: savings.consultantHours.toString(),
              })}
            </p>
          </div>
        </Card>

        <Card title={strings.hub.insights.confidenceIndex}>
          {confidenceIndex ? (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {confidenceIndex.score}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(
                    confidenceIndex.score
                  )}`}
                >
                  {confidenceIndex.label}
                </span>
              </div>
              <p className="text-xs text-gray-600">{confidenceIndex.description}</p>
              <div className="text-xs text-gray-500 mt-2">
                Coverage: {confidenceIndex.breakdown.coverage}% | Gaps:{' '}
                {confidenceIndex.breakdown.gapSeverity}% | Staffing:{' '}
                {confidenceIndex.breakdown.staffing}%
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">{strings.common.noData}</p>
          )}
        </Card>
      </div>

      {/* CTA Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold mb-2">
            {strings.hub.cta.openCanvas}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {activeProject
              ? `Open "${activeProject.name}"`
              : 'No active project'}
          </p>
          <Button
            onClick={() => {
              if (activeProject) {
                navigate(`/project/${activeProject.id}/canvas`);
              }
            }}
            disabled={!activeProject}
          >
            Open Canvas
          </Button>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-2">
            {strings.hub.cta.startIntake}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Start a new project intake
          </p>
          <Button onClick={() => navigate('/discovery')}>
            Start Intake
          </Button>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-2">
            {strings.hub.cta.jumpToLab}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Experiment with scenario levers
          </p>
          <Button
            onClick={() => {
              if (activeProject) {
                navigate(`/project/${activeProject.id}/scenario-lab`);
              }
            }}
            disabled={!activeProject}
          >
            Open Lab
          </Button>
        </Card>
      </div>

      {/* AI Guidance (if enabled) */}
      {activeProject && (
        <div className="mb-8">
          <QuickWhyThisPlan projectId={activeProject.id} />
        </div>
      )}
    </div>
  );
}
