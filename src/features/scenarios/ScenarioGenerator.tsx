import React, { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Section } from '../../components/Section';
import { useProjectStore, type Scenario, type ScenarioMultiplier } from '../../store/useProjectStore';
import { useResourceDataSource } from '../resources/api';

const scenarioDefinitions: ScenarioMultiplier[] = [
  { id: 'baseline', label: 'Baseline', effortMultiplier: 1, durationMultiplier: 1, costMultiplier: 1 },
  { id: 'accelerated', label: 'Accelerated', effortMultiplier: 1.15, durationMultiplier: 0.85, costMultiplier: 1.2 },
  { id: 'lean', label: 'Lean', effortMultiplier: 0.92, durationMultiplier: 1, costMultiplier: 0.88 },
  { id: 'scope-lite', label: 'Scope-Lite', effortMultiplier: 0.75, durationMultiplier: 0.9, costMultiplier: 0.8 },
  { id: 'high-scope', label: 'High Scope', effortMultiplier: 1.35, durationMultiplier: 1.1, costMultiplier: 1.4 },
];

const scenariosQueryKey = ['scenarios'];

export const ScenarioGenerator: React.FC = () => {
  const queryClient = useQueryClient();
  const { scenarios, upsertScenario, removeScenario } = useProjectStore((state) => ({
    scenarios: state.scenarios,
    upsertScenario: state.upsertScenario,
    removeScenario: state.removeScenario,
  }));
  const { persistScenario, removeScenario: removeScenarioFromSource } = useResourceDataSource();

  const createScenarioMutation = useMutation({
    mutationFn: persistScenario,
    onSuccess: (scenario) => {
      queryClient.setQueryData<Scenario[]>(scenariosQueryKey, (current = []) => {
        const idx = current.findIndex((item) => item.id === scenario.id);
        if (idx >= 0) {
          const next = [...current];
          next[idx] = scenario;
          return next;
        }
        return [...current, scenario];
      });
      upsertScenario(scenario);
    },
  });

  const deleteScenarioMutation = useMutation({
    mutationFn: removeScenarioFromSource,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Scenario[]>(scenariosQueryKey, (current = []) => current.filter((item) => item.id !== id));
      removeScenario(id);
    },
  });

  const handleGenerateScenario = (definition: ScenarioMultiplier) => {
    const assumptions = {
      recruitmentLeadTimeWeeks: Math.round(8 * definition.durationMultiplier),
      changeReadinessScore: definition.effortMultiplier > 1 ? 'Elevated risk' : 'Moderate risk',
      vendorAlignment: definition.costMultiplier > 1 ? 'Premium partners' : 'Standard partners',
    };

    const results = {
      totalCost: Number((1250000 * definition.costMultiplier).toFixed(0)),
      totalFte: Number((18.4 * definition.effortMultiplier).toFixed(1)),
      riskScore: Number((0.45 * definition.effortMultiplier).toFixed(2)),
    };

    const scenario: Scenario = {
      id: definition.id,
      name: definition.label,
      multipliers: definition,
      assumptions,
      results,
    };

    createScenarioMutation.mutate(scenario);
  };

  const handleDeleteScenario = (scenarioId: string) => {
    deleteScenarioMutation.mutate(scenarioId);
  };

  const scenarioCards = useMemo(
    () =>
      scenarioDefinitions.map((definition) => {
        const isGenerated = scenarios.some((scenario) => scenario.id === definition.id);
        return (
          <div key={definition.id} className="space-y-3 rounded-md border border-slate-200 p-4 text-sm">
            <div>
              <h3 className="text-base font-semibold text-slate-900">{definition.label}</h3>
              <p className="mt-1 text-xs text-slate-500">
                Effort ×{definition.effortMultiplier.toFixed(2)} • Duration ×
                {definition.durationMultiplier.toFixed(2)} • Cost ×{definition.costMultiplier.toFixed(2)}
              </p>
            </div>
            <button
              type="button"
              className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              onClick={() => handleGenerateScenario(definition)}
              disabled={createScenarioMutation.isPending}
            >
              {isGenerated ? 'Regenerate Scenario' : 'Generate Scenario'}
            </button>
          </div>
        );
      }),
    [createScenarioMutation.isPending, scenarios],
  );

  return (
    <Section title="Scenario Generator" actions={<span className="text-xs text-slate-500">{scenarios.length} saved</span>}>
      <div className="grid gap-4 md:grid-cols-3">{scenarioCards}</div>
      <div className="rounded-md border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Saved Scenarios</h3>
        <ul className="mt-2 space-y-2 text-sm">
          {scenarios.map((scenario) => (
            <li key={scenario.id} className="flex items-start justify-between rounded-md border border-slate-200 p-3">
              <div>
                <p className="font-medium text-slate-900">{scenario.name}</p>
                <p className="text-xs text-slate-500">Total cost: ${scenario.results.totalCost.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Risk score: {scenario.results.riskScore}</p>
              </div>
              <button
                type="button"
                className="rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                onClick={() => handleDeleteScenario(scenario.id)}
              >
                Delete
              </button>
            </li>
          ))}
          {!scenarios.length && <p className="text-xs text-slate-500">Generate scenarios to compare assumptions.</p>}
        </ul>
      </div>
    </Section>
  );
};
