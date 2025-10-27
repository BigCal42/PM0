import { describe, expect, it } from 'vitest';
import {
  SCENARIO_LABELS,
  ScenarioType,
  applyScenarioMultiplier,
  getScenarioMultiplier,
  summariseScenario,
} from '../lib/scenario';

describe('scenario calculations', () => {
  it('returns deterministic multipliers for each scenario', () => {
    const order: ScenarioType[] = ['baseline', 'accelerated', 'lean', 'scope-lite', 'high-scope'];
    const multipliers = order.map((scenario) => getScenarioMultiplier(scenario));
    expect(multipliers).toEqual([1, 1.2, 0.85, 0.7, 1.4]);
  });

  it('applies multiplier and rounds to whole hours', () => {
    expect(applyScenarioMultiplier(100, 'accelerated')).toBe(120);
    expect(applyScenarioMultiplier(95, 'lean')).toBe(81);
  });

  it('summarises adjustments for UI hints', () => {
    expect(summariseScenario(60, 'scope-lite')).toBe(
      `${SCENARIO_LABELS['scope-lite']} scenario → 42 hrs`,
    );
  });

  it('rejects negative hour payloads', () => {
    expect(() => applyScenarioMultiplier(-1, 'baseline')).toThrowError('Hours cannot be negative');
  });
});
