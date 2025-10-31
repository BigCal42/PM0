/**
 * Scenario derivation utilities
 * Deterministic multipliers for baseline/accelerated/lean scenarios
 */

export type ScenarioType = 'baseline' | 'accelerated' | 'lean';

export interface ScenarioMetrics {
  timelineMonths: number;
  totalFTE: number;
  effortMultiplier: number;
  costEstimate: number;
  riskLevel: 'low' | 'medium' | 'high';
  scopeReduction?: number;
}

export interface BaselineMetrics {
  timelineMonths: number;
  totalFTE: number;
  baseCostPerFTEMonth: number; // Base cost per FTE per month
}

/**
 * Generate scenario metrics from baseline
 * Uses deterministic multipliers for each scenario type
 */
export function generateScenarioMetrics(
  baseline: BaselineMetrics,
  type: ScenarioType
): ScenarioMetrics {
  switch (type) {
    case 'baseline':
      return {
        timelineMonths: baseline.timelineMonths,
        totalFTE: baseline.totalFTE,
        effortMultiplier: 1.0,
        costEstimate: baseline.timelineMonths * baseline.totalFTE * baseline.baseCostPerFTEMonth,
        riskLevel: 'medium',
      };

    case 'accelerated':
      // Accelerated: timeline -25%, effort +25–30%, risk ↑
      const acceleratedTimeline = baseline.timelineMonths * 0.75;
      const acceleratedFTE = baseline.totalFTE * 1.28; // ~28% increase
      return {
        timelineMonths: Math.ceil(acceleratedTimeline),
        totalFTE: Math.ceil(acceleratedFTE),
        effortMultiplier: 1.28,
        costEstimate: Math.ceil(acceleratedTimeline) * Math.ceil(acceleratedFTE) * baseline.baseCostPerFTEMonth,
        riskLevel: 'high',
      };

    case 'lean':
      // Lean: timeline -15%, scope -15%, risk ↔/↑, cost ↓
      const leanTimeline = baseline.timelineMonths * 0.85;
      const leanFTE = baseline.totalFTE * 0.85; // Reduced scope = reduced FTE
      return {
        timelineMonths: Math.ceil(leanTimeline),
        totalFTE: Math.ceil(leanFTE),
        effortMultiplier: 0.85,
        costEstimate: Math.ceil(leanTimeline) * Math.ceil(leanFTE) * baseline.baseCostPerFTEMonth,
        riskLevel: 'medium',
        scopeReduction: 15,
      };

    default:
      throw new Error(`Unknown scenario type: ${type}`);
  }
}

/**
 * Calculate delta between two scenarios
 */
export function calculateScenarioDelta(
  baseline: ScenarioMetrics,
  compare: ScenarioMetrics
): {
  timelineDelta: number;
  timelineDeltaPercent: number;
  fteDelta: number;
  fteDeltaPercent: number;
  costDelta: number;
  costDeltaPercent: number;
  riskChange: string;
} {
  return {
    timelineDelta: compare.timelineMonths - baseline.timelineMonths,
    timelineDeltaPercent: ((compare.timelineMonths - baseline.timelineMonths) / baseline.timelineMonths) * 100,
    fteDelta: compare.totalFTE - baseline.totalFTE,
    fteDeltaPercent: ((compare.totalFTE - baseline.totalFTE) / baseline.totalFTE) * 100,
    costDelta: compare.costEstimate - baseline.costEstimate,
    costDeltaPercent: ((compare.costEstimate - baseline.costEstimate) / baseline.costEstimate) * 100,
    riskChange: getRiskChange(baseline.riskLevel, compare.riskLevel),
  };
}

function getRiskChange(from: ScenarioMetrics['riskLevel'], to: ScenarioMetrics['riskLevel']): string {
  const riskOrder = { low: 1, medium: 2, high: 3 };
  const delta = riskOrder[to] - riskOrder[from];
  if (delta === 0) return 'unchanged';
  if (delta > 0) return `+${delta} level${delta > 1 ? 's' : ''}`;
  return `${delta} level${delta < -1 ? 's' : ''}`;
}

/**
 * Get scenario type label
 */
export function getScenarioTypeLabel(type: ScenarioType): string {
  switch (type) {
    case 'baseline':
      return 'Baseline';
    case 'accelerated':
      return 'Accelerated';
    case 'lean':
      return 'Lean';
  }
}

/**
 * Get scenario type description
 */
export function getScenarioTypeDescription(type: ScenarioType): string {
  switch (type) {
    case 'baseline':
      return 'Standard timeline with balanced risk';
    case 'accelerated':
      return '25% faster timeline with increased effort and risk';
    case 'lean':
      return '15% reduced scope and timeline with optimized cost';
  }
}
