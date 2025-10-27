export type ScenarioType =
  | 'baseline'
  | 'accelerated'
  | 'lean'
  | 'scope-lite'
  | 'high-scope';

export const SCENARIO_LABELS: Record<ScenarioType, string> = {
  baseline: 'Baseline',
  accelerated: 'Accelerated',
  lean: 'Lean',
  'scope-lite': 'Scope-Lite',
  'high-scope': 'High-Scope',
};

const SCENARIO_MULTIPLIERS: Record<ScenarioType, number> = {
  baseline: 1,
  accelerated: 1.2,
  lean: 0.85,
  'scope-lite': 0.7,
  'high-scope': 1.4,
};

export function getScenarioMultiplier(scenario: ScenarioType): number {
  return SCENARIO_MULTIPLIERS[scenario];
}

export function applyScenarioMultiplier(hours: number, scenario: ScenarioType): number {
  if (hours < 0) {
    throw new RangeError('Hours cannot be negative');
  }
  const multiplier = getScenarioMultiplier(scenario);
  return Math.round(hours * multiplier);
}

export function summariseScenario(hours: number, scenario: ScenarioType): string {
  const adjusted = applyScenarioMultiplier(hours, scenario);
  const label = SCENARIO_LABELS[scenario];
  return `${label} scenario → ${adjusted} hrs`;
}

export { SCENARIO_MULTIPLIERS };
