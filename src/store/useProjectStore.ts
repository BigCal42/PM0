import { create } from 'zustand';

export type Role = {
  id: string;
  name: string;
  description?: string;
  monthlyCapacity: number;
};

export type Resource = {
  id: string;
  roleId: string;
  name: string;
  availability: number;
};

export type HeatmapCell = {
  id: string;
  roleId: string;
  month: string;
  severity: 'low' | 'medium' | 'high';
  gap: number;
};

export type ScenarioMultiplier = {
  id: string;
  label: string;
  effortMultiplier: number;
  durationMultiplier: number;
  costMultiplier: number;
};

export type Scenario = {
  id: string;
  name: string;
  multipliers: ScenarioMultiplier;
  assumptions: Record<string, unknown>;
  results: {
    totalCost: number;
    totalFte: number;
    riskScore: number;
  };
};

type ProjectState = {
  roles: Role[];
  resources: Resource[];
  heatmap: HeatmapCell[];
  scenarios: Scenario[];
  selectedScenarioId?: string;
  projectName: string | null;
  projectTemplateId: string | null;
  setRoles: (roles: Role[]) => void;
  setResources: (resources: Resource[]) => void;
  setHeatmap: (heatmap: HeatmapCell[]) => void;
  setScenarios: (scenarios: Scenario[]) => void;
  selectScenario: (id: string | undefined) => void;
  upsertScenario: (scenario: Scenario) => void;
  removeScenario: (id: string) => void;
  setProjectMetadata: (name: string | null, templateId: string | null) => void;
};

export const useProjectStore = create<ProjectState>((set) => ({
  roles: [],
  resources: [],
  heatmap: [],
  scenarios: [],
  selectedScenarioId: undefined,
  projectName: null,
  projectTemplateId: null,
  setRoles: (roles) => set({ roles }),
  setResources: (resources) => set({ resources }),
  setHeatmap: (heatmap) => set({ heatmap }),
  setScenarios: (scenarios) =>
    set({
      scenarios,
      selectedScenarioId: scenarios.length ? scenarios[0]?.id : undefined,
    }),
  selectScenario: (id) => set({ selectedScenarioId: id }),
  upsertScenario: (scenario) =>
    set((state) => {
      const existingIndex = state.scenarios.findIndex((item) => item.id === scenario.id);
      if (existingIndex >= 0) {
        const next = [...state.scenarios];
        next[existingIndex] = scenario;
        return { scenarios: next, selectedScenarioId: scenario.id };
      }
      return { scenarios: [...state.scenarios, scenario], selectedScenarioId: scenario.id };
    }),
  removeScenario: (id) =>
    set((state) => {
      const remaining = state.scenarios.filter((scenario) => scenario.id !== id);
      const nextSelected = state.selectedScenarioId === id ? remaining[0]?.id : state.selectedScenarioId;
      return {
        scenarios: remaining,
        selectedScenarioId: nextSelected,
      };
    }),
  setProjectMetadata: (name, templateId) =>
    set({
      projectName: name,
      projectTemplateId: templateId,
    }),
}));
