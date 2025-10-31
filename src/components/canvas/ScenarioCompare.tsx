/**
 * ScenarioCompare component
 * Compare Baseline vs Accelerated vs Lean scenarios with deltas
 */

import { Card } from '@/components/Card';
import {
  generateScenarioMetrics,
  calculateScenarioDelta,
  getScenarioTypeLabel,
  getScenarioTypeDescription,
  type ScenarioType,
} from '@/lib/derive/scenario';
import { strings } from '@/content/strings';

interface ScenarioCompareProps {
  projectId: string;
  baselineMetrics?: {
    timelineMonths: number;
    totalFTE: number;
    baseCostPerFTEMonth: number;
  };
}

export function ScenarioCompare({ projectId, baselineMetrics }: ScenarioCompareProps) {
  // Default baseline if not provided
  const baseline = baselineMetrics || {
    timelineMonths: 18,
    totalFTE: 12,
    baseCostPerFTEMonth: 15000, // $15K per FTE per month
  };

  const scenarios: ScenarioType[] = ['baseline', 'accelerated', 'lean'];
  const scenarioMetrics = scenarios.map(type => ({
    type,
    metrics: generateScenarioMetrics(baseline, type),
  }));

  const baselineMetricsObj = scenarioMetrics[0].metrics;

  return (
    <Card title={strings.canvas.scenarios.title}>
      <div className="space-y-4">
        {scenarioMetrics.map(({ type, metrics }) => {
          const delta = type !== 'baseline' 
            ? calculateScenarioDelta(baselineMetricsObj, metrics)
            : null;

          return (
            <div
              key={type}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {getScenarioTypeLabel(type)}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {getScenarioTypeDescription(type)}
                  </p>
                </div>
                {delta && (
                  <div className="text-right">
                    <span
                      className={`text-sm font-medium ${
                        delta.timelineDelta < 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {delta.timelineDelta < 0 ? '↓' : '↑'}{' '}
                      {Math.abs(delta.timelineDeltaPercent).toFixed(0)}% timeline
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <span className="text-xs text-gray-600">{strings.canvas.scenarios.timeline}</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {metrics.timelineMonths} months
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">{strings.canvas.scenarios.fte}</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {metrics.totalFTE.toFixed(1)} FTE
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-600">{strings.canvas.scenarios.cost}</span>
                  <p className="text-lg font-semibold text-gray-900">
                    ${(metrics.costEstimate / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">{strings.canvas.scenarios.risk}:</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    metrics.riskLevel === 'high'
                      ? 'bg-red-100 text-red-800'
                      : metrics.riskLevel === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {metrics.riskLevel.toUpperCase()}
                </span>
              </div>

              {delta && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    {strings.canvas.scenarios.whatChanged}:
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>
                      Timeline: {delta.timelineDelta > 0 ? '+' : ''}
                      {delta.timelineDelta.toFixed(1)} months (
                      {delta.timelineDeltaPercent > 0 ? '+' : ''}
                      {delta.timelineDeltaPercent.toFixed(0)}%)
                    </li>
                    <li>
                      FTE: {delta.fteDelta > 0 ? '+' : ''}
                      {delta.fteDelta.toFixed(1)} (
                      {delta.fteDeltaPercent > 0 ? '+' : ''}
                      {delta.fteDeltaPercent.toFixed(0)}%)
                    </li>
                    <li>
                      Cost: {delta.costDelta > 0 ? '+' : ''}
                      ${(delta.costDelta / 1000).toFixed(0)}K (
                      {delta.costDeltaPercent > 0 ? '+' : ''}
                      {delta.costDeltaPercent.toFixed(0)}%)
                    </li>
                    <li>Risk: {delta.riskChange}</li>
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
