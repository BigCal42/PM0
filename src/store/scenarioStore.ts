import { create } from 'zustand';
import type { ScenarioKey } from '@/features/scenario/presets';

type ScenarioState = {
  selected: ScenarioKey;
  demandAdjustment: number;
  supplyAdjustment: number;
  setScenario: (key: ScenarioKey) => void;
  setDemandAdjustment: (value: number) => void;
  setSupplyAdjustment: (value: number) => void;
};

export const useScenarioStore = create<ScenarioState>((set) => ({
  selected: 'baseline',
  demandAdjustment: 1,
  supplyAdjustment: 1,
  setScenario: (key) =>
    set(() => ({
      selected: key,
      demandAdjustment: 1,
      supplyAdjustment: 1,
    })),
  setDemandAdjustment: (value) =>
    set(() => ({
      demandAdjustment: value,
    })),
  setSupplyAdjustment: (value) =>
    set(() => ({
      supplyAdjustment: value,
    })),
}));
