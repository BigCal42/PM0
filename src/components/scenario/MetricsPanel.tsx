/**
 * MetricsPanel component
 * Displays derived metrics from lever adjustments
 */

import { Card } from '@/components/Card';
import { strings } from '@/content/strings';
import type { LeverValues } from './LeversPanel';

interface MetricsPanelProps {
  levers: LeverValues;
  baselineMetrics: {
    timelineMonths: number;
    totalFTE: number;
    baseCostPerFTEMonth: number;
  };
}

export function MetricsPanel({ levers, baselineMetrics }: MetricsPanelProps) {
  // Calculate derived metrics
  const timelineMonths = Math.ceil(
    (baselineMetrics.timelineMonths * levers.timelinePercent) / 100
  );
  const totalFTE = Math.ceil(
    baselineMetrics.totalFTE * levers.fteParallelization * (levers.scopePercent / 100)
  );
  const costEstimate = timelineMonths * totalFTE * baselineMetrics.baseCostPerFTEMonth;

  // Determine risk level based on aggressive levers
  let riskLevel: 'low' | 'medium' | 'high' = 'medium';
  if (levers.timelinePercent < 70 || levers.scopePercent < 70 || levers.fteParallelization > 1.5) {
    riskLevel = 'high';
  } else if (levers.timelinePercent >= 85 && levers.scopePercent >= 85 && levers.fteParallelization <= 1.2) {
    riskLevel = 'low';
  }

  return (
    <Card title={strings.lab.metrics.title}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-gray-600">{strings.lab.metrics.months}</span>
            <p className="text-2xl font-bold text-gray-900">{timelineMonths}</p>
          </div>
          <div>
            <span className="text-xs text-gray-600">{strings.lab.metrics.avgFte}</span>
            <p className="text-2xl font-bold text-gray-900">{totalFTE.toFixed(1)}</p>
          </div>
        </div>

        <div>
          <span className="text-xs text-gray-600">{strings.lab.metrics.costEstimate}</span>
          <p className="text-2xl font-bold text-gray-900">
            ${(costEstimate / 1000).toFixed(0)}K
          </p>
        </div>

        <div>
          <span className="text-xs text-gray-600">{strings.lab.metrics.riskLevel}</span>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
              riskLevel === 'high'
                ? 'bg-red-100 text-red-800'
                : riskLevel === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {riskLevel.toUpperCase()}
          </span>
        </div>
      </div>
    </Card>
  );
}
