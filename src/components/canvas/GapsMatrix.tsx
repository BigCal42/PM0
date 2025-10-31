/**
 * GapsMatrix component
 * Phase × Role table showing gaps with severity coloring
 */

import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { usePhaseGaps } from '@/hooks/useGaps';
import { calculateGapSummary } from '@/lib/derive/kpi';
import { strings } from '@/content/strings';
import type { PhaseGap } from '@/lib/derive/kpi';

interface GapsMatrixProps {
  projectId: string;
}

function getGapSeverityColor(gapPercent: number): string {
  if (gapPercent > 20) return 'bg-red-100 text-red-800';
  if (gapPercent >= 10) return 'bg-orange-100 text-orange-800';
  if (gapPercent > 0) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
}

function getGapSeverityLabel(gapPercent: number): string {
  if (gapPercent > 20) return 'Critical';
  if (gapPercent >= 10) return 'Moderate';
  if (gapPercent > 0) return 'Minor';
  return 'None';
}

export function GapsMatrix({ projectId }: GapsMatrixProps) {
  const { data: gaps, isLoading, error } = usePhaseGaps(projectId);

  if (isLoading) {
    return (
      <Card title={strings.canvas.gaps.title}>
        <Loading message={strings.common.loading} />
      </Card>
    );
  }

  if (error || !gaps || gaps.length === 0) {
    return (
      <Card title={strings.canvas.gaps.title}>
        <p className="text-gray-600">{strings.common.noData}</p>
      </Card>
    );
  }

  // Group gaps by phase
  const gapsByPhase = gaps.reduce((acc, gap) => {
    if (!acc[gap.phaseId]) {
      acc[gap.phaseId] = [];
    }
    acc[gap.phaseId].push(gap);
    return acc;
  }, {} as Record<string, PhaseGap[]>);

  const phases = Object.keys(gapsByPhase);
  const allRoles = Array.from(new Set(gaps.map(g => g.roleId)));

  const summary = calculateGapSummary(gaps);

  return (
    <Card title={strings.canvas.gaps.title}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                {strings.canvas.gaps.phase}
              </th>
              {allRoles.map((roleId) => {
                const role = gaps.find(g => g.roleId === roleId);
                return (
                  <th
                    key={roleId}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase"
                  >
                    {role?.roleName || roleId}
                  </th>
                );
              })}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                {strings.canvas.gaps.totals}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {phases.map((phaseId) => {
              const phaseGaps = gapsByPhase[phaseId];
              const phaseName = phaseGaps[0]?.phaseName || phaseId;
              const phaseTotal = phaseGaps.reduce((sum, g) => sum + g.gap, 0);

              return (
                <tr key={phaseId}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {phaseName}
                  </td>
                  {allRoles.map((roleId) => {
                    const gap = phaseGaps.find(g => g.roleId === roleId);
                    if (!gap) {
                      return <td key={roleId} className="px-4 py-3 text-sm text-gray-400">—</td>;
                    }

                    const gapPercent =
                      gap.requiredCapacity > 0
                        ? (gap.gap / gap.requiredCapacity) * 100
                        : 0;

                    return (
                      <td key={roleId} className="px-4 py-3 text-sm">
                        <div className="flex flex-col">
                          <span className="text-gray-900">
                            {gap.gap.toFixed(1)}
                          </span>
                          <span
                            className={`text-xs px-1 py-0.5 rounded ${getGapSeverityColor(gapPercent)}`}
                          >
                            {getGapSeverityLabel(gapPercent)}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {phaseTotal.toFixed(1)}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-gray-50 font-medium">
              <td className="px-4 py-3 text-sm text-gray-900">Totals</td>
              {allRoles.map((roleId) => {
                const roleTotal = gaps
                  .filter(g => g.roleId === roleId)
                  .reduce((sum, g) => sum + g.gap, 0);
                return (
                  <td key={roleId} className="px-4 py-3 text-sm text-gray-900">
                    {roleTotal.toFixed(1)}
                  </td>
                );
              })}
              <td className="px-4 py-3 text-sm text-gray-900">
                {gaps.reduce((sum, g) => sum + g.gap, 0).toFixed(1)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex gap-4 text-sm">
          <span>
            <span className="font-medium">Total Gaps:</span> {summary.totalGaps}
          </span>
          <span>
            <span className="font-medium">Critical:</span>{' '}
            <span className="text-red-600">{summary.criticalGaps}</span>
          </span>
          <span>
            <span className="font-medium">Moderate:</span>{' '}
            <span className="text-orange-600">{summary.moderateGaps}</span>
          </span>
          <span>
            <span className="font-medium">Minor:</span>{' '}
            <span className="text-yellow-600">{summary.minorGaps}</span>
          </span>
        </div>
      </div>
    </Card>
  );
}
