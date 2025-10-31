/**
 * RiskCallouts component
 * Displays risk warnings based on lever adjustments
 */

import { Card } from '@/components/Card';
import { strings } from '@/content/strings';
import type { LeverValues } from './LeversPanel';

interface RiskCalloutsProps {
  levers: LeverValues;
}

export function RiskCallouts({ levers }: RiskCalloutsProps) {
  const risks: string[] = [];

  if (levers.timelinePercent < 70) {
    risks.push(`Aggressive timeline reduction (${100 - levers.timelinePercent}%) may require parallel workstreams and increase coordination overhead.`);
  }

  if (levers.scopePercent < 70) {
    risks.push(`Scope reduction (${100 - levers.scopePercent}%) may impact core functionality or require later phases to address gaps.`);
  }

  if (levers.fteParallelization > 1.5) {
    risks.push(`High FTE parallelization (${(levers.fteParallelization * 100).toFixed(0)}%) increases communication overhead and may reduce individual productivity.`);
  }

  if (levers.testingCompression < 0.7) {
    risks.push(`Testing compression (${(levers.testingCompression * 100).toFixed(0)}%) may reduce quality assurance coverage and increase post-go-live defects.`);
  }

  if (levers.timelinePercent < 75 && levers.scopePercent < 80) {
    risks.push('Combined timeline and scope reductions significantly increase delivery risk.');
  }

  if (risks.length === 0) {
    risks.push(strings.lab.risks.noRisks);
  }

  return (
    <Card title={strings.lab.risks.title}>
      <ul className="space-y-2">
        {risks.map((risk, index) => (
          <li key={index} className="text-sm text-gray-700 flex items-start">
            <span className="text-red-500 mr-2">•</span>
            <span>{risk}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
