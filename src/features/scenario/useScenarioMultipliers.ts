import { useMemo } from 'react';
import { scenarioPresets } from './presets';
import { useScenarioStore } from '@/store/scenarioStore';

export function useScenarioMultipliers() {
  const { selected, demandAdjustment, supplyAdjustment } = useScenarioStore();
  const preset = scenarioPresets[selected];

  return useMemo(
    () => ({
      demand: preset.multipliers.demand * demandAdjustment,
      supply: preset.multipliers.supply * supplyAdjustment,
      preset,
    }),
    [preset, demandAdjustment, supplyAdjustment],
  );
}
