export type ScenarioKey = 'baseline' | 'accelerated' | 'lean' | 'scopeLite' | 'highScope';

export interface ScenarioPreset {
  key: ScenarioKey;
  label: string;
  description: string;
  multipliers: {
    demand: number;
    supply: number;
  };
}

export const scenarioPresets: Record<ScenarioKey, ScenarioPreset> = {
  baseline: {
    key: 'baseline',
    label: 'Baseline',
    description: 'Current plan with existing assumptions.',
    multipliers: { demand: 1, supply: 1 },
  },
  accelerated: {
    key: 'accelerated',
    label: 'Accelerated',
    description: 'Scope expansion with faster change cadence.',
    multipliers: { demand: 1.18, supply: 0.95 },
  },
  lean: {
    key: 'lean',
    label: 'Lean',
    description: 'Tighter staffing with productivity boosts.',
    multipliers: { demand: 0.92, supply: 1.02 },
  },
  scopeLite: {
    key: 'scopeLite',
    label: 'Scope-Lite',
    description: 'Reduced rollout footprint with targeted features.',
    multipliers: { demand: 0.78, supply: 0.98 },
  },
  highScope: {
    key: 'highScope',
    label: 'High Scope',
    description: 'Additional in-scope geographies and modules.',
    multipliers: { demand: 1.26, supply: 1.04 },
  },
};

export const scenarioList = Object.values(scenarioPresets);
