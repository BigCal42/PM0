import React, { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Section } from '../../components/Section';
import { useProjectStore, type Scenario, type ScenarioMultiplier } from '../../store/useProjectStore';
import { useFeatureFlags } from '../../store/useFeatureFlags';
import { useResourceDataSource } from '../resources/api';
import { nanoid } from '../../utils/nanoid';

const BASELINE_KPIS = {
  totalHours: 5200,
  vendorSpendPct: 35,
  totalCost: 962000,
  readinessScore: 82,
  durationMonths: 12,
} as const;

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const calculateScenarioResults = (multipliers: ScenarioMultiplier) => {
  const totalHours = Math.round(BASELINE_KPIS.totalHours * multipliers.effortMultiplier);
  const totalCost = Math.round(BASELINE_KPIS.totalCost * multipliers.costMultiplier);
  const vendorSpendPct = Math.min(100, Math.round(BASELINE_KPIS.vendorSpendPct * multipliers.costMultiplier));
  const durationMonths = Math.max(1, Math.round(BASELINE_KPIS.durationMonths * multipliers.durationMultiplier));
  const totalFte = Number((totalHours / Math.max(1, durationMonths * 160)).toFixed(1));
  const readinessScore = Math.max(
    0,
    Math.min(100, Math.round(BASELINE_KPIS.readinessScore - (multipliers.effortMultiplier - 1) * 15)),
  );
  const riskScore = Number((1 - readinessScore / 100).toFixed(2));

  return {
    totalCost,
    totalFte,
    riskScore,
    totalHours,
    vendorSpendPct,
    readinessScore,
    durationMonths,
  } satisfies Scenario['results'];
};

const buildScenarioAssumptions = (results: Scenario['results']) => {
  const estimatedHours = results.totalHours ?? BASELINE_KPIS.totalHours;
  const vendorMixPct = results.vendorSpendPct ?? BASELINE_KPIS.vendorSpendPct;
  const durationMonths = results.durationMonths ?? BASELINE_KPIS.durationMonths;
  const readinessWeight = results.readinessScore ?? BASELINE_KPIS.readinessScore;
  const blendedRateBase = BASELINE_KPIS.totalHours ? Math.round(BASELINE_KPIS.totalCost / BASELINE_KPIS.totalHours) : 0;
  const blendedRate =
    estimatedHours > 0 ? Math.round(results.totalCost / estimatedHours) : blendedRateBase;

  return {
    estimatedHours,
    vendorMixPct,
    durationMonths,
    blendedRate,
    readinessWeight,
  } satisfies Scenario['assumptions'];
};

const normalizeScenario = (scenario: Scenario): Scenario => {
  const multipliers: ScenarioMultiplier = {
    ...scenario.multipliers,
    label: scenario.multipliers.label ?? scenario.name,
  };
  const defaults = calculateScenarioResults(multipliers);

  return {
    ...scenario,
    multipliers,
    results: {
      ...defaults,
      ...scenario.results,
      totalCost: scenario.results.totalCost ?? defaults.totalCost,
    },
  };
};

const scenarioDefinitions: ScenarioMultiplier[] = [
  { id: 'baseline', label: 'Baseline', effortMultiplier: 1, durationMultiplier: 1, costMultiplier: 1 },
  { id: 'accelerated', label: 'Accelerated', effortMultiplier: 1.15, durationMultiplier: 0.85, costMultiplier: 1.2 },
  { id: 'lean', label: 'Lean', effortMultiplier: 0.92, durationMultiplier: 1, costMultiplier: 0.88 },
  { id: 'scope-lite', label: 'Scope-Lite', effortMultiplier: 0.75, durationMultiplier: 0.9, costMultiplier: 0.8 },
  { id: 'high-scope', label: 'High Scope', effortMultiplier: 1.35, durationMultiplier: 1.1, costMultiplier: 1.4 },
];

type DuplicateFormState = {
  name: string;
  effortMultiplier: string;
  durationMultiplier: string;
  costMultiplier: string;
};

export const ScenarioGenerator: React.FC = () => {
  const { useDemoData } = useFeatureFlags();
  const modeKey = useDemoData ? 'demo' : 'live';
  const scenariosQueryKey = ['scenarios', modeKey] as const;
  const queryClient = useQueryClient();
  const { scenarios, upsertScenario, removeScenario, selectedScenarioId, selectScenario } = useProjectStore((state) => ({
    scenarios: state.scenarios,
    upsertScenario: state.upsertScenario,
    removeScenario: state.removeScenario,
    selectedScenarioId: state.selectedScenarioId,
    selectScenario: state.selectScenario,
  }));
  const { persistScenario, removeScenario: removeScenarioFromSource } = useResourceDataSource();

  const createScenarioMutation = useMutation({
    mutationFn: persistScenario,
    onSuccess: (scenario) => {
      const normalized = normalizeScenario(scenario);
      queryClient.setQueryData<Scenario[]>(scenariosQueryKey, (current = []) => {
        const idx = current.findIndex((item) => item.id === normalized.id);
        if (idx >= 0) {
          const next = [...current];
          next[idx] = normalized;
          return next;
        }
        return [...current, normalized];
      });
      upsertScenario(normalized);
    },
  });

  const deleteScenarioMutation = useMutation({
    mutationFn: removeScenarioFromSource,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Scenario[]>(scenariosQueryKey, (current = []) => current.filter((item) => item.id !== id));
      removeScenario(id);
    },
  });

  const [isDuplicateOpen, setDuplicateOpen] = useState(false);
  const [duplicateForm, setDuplicateForm] = useState<DuplicateFormState>({
    name: '',
    effortMultiplier: '',
    durationMultiplier: '',
    costMultiplier: '',
  });

  const activeScenario = useMemo(() => {
    if (!scenarios.length) return undefined;
    return scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? scenarios[0];
  }, [scenarios, selectedScenarioId]);

  const handleOpenDuplicate = () => {
    if (!activeScenario) return;
    setDuplicateForm({
      name: `${activeScenario.name} Copy`,
      effortMultiplier: activeScenario.multipliers.effortMultiplier.toString(),
      durationMultiplier: activeScenario.multipliers.durationMultiplier.toString(),
      costMultiplier: activeScenario.multipliers.costMultiplier.toString(),
    });
    setDuplicateOpen(true);
  };

  const handleDuplicateChange = (field: keyof DuplicateFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setDuplicateForm((current) => ({ ...current, [field]: value }));
    };

  const handleDuplicateScenario: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!activeScenario) return;

    const name = duplicateForm.name.trim();
    if (!name) return;

    const effortMultiplier =
      Number.parseFloat(duplicateForm.effortMultiplier) || activeScenario.multipliers.effortMultiplier;
    const durationMultiplier =
      Number.parseFloat(duplicateForm.durationMultiplier) || activeScenario.multipliers.durationMultiplier;
    const costMultiplier = Number.parseFloat(duplicateForm.costMultiplier) || activeScenario.multipliers.costMultiplier;

    const multipliers: ScenarioMultiplier = {
      id: nanoid(),
      label: name,
      effortMultiplier,
      durationMultiplier,
      costMultiplier,
    };

    const newScenario: Scenario = {
      ...activeScenario,
      id: nanoid(),
      name,
      multipliers,
      results: calculateScenarioResults(multipliers),
    };

    createScenarioMutation.mutate(newScenario, {
      onSuccess: () => {
        setDuplicateOpen(false);
      },
    });
  };

  const handleSelectScenario = (scenarioId: string) => {
    selectScenario(scenarioId);
  };

  const handleDeleteScenario = (scenarioId: string) => {
    deleteScenarioMutation.mutate(scenarioId);
  };

  const scenarioCards = useMemo(
    () =>
      scenarioDefinitions.map((definition) => {
        const projectedResults = calculateScenarioResults(definition);

        const handleGenerateScenario = () => {
          const multipliers: ScenarioMultiplier = {
            id: nanoid(),
            label: definition.label,
            effortMultiplier: definition.effortMultiplier,
            durationMultiplier: definition.durationMultiplier,
            costMultiplier: definition.costMultiplier,
          };

          const results = calculateScenarioResults(multipliers);

          const scenario: Scenario = {
            id: nanoid(),
            name: definition.label,
            multipliers,
            assumptions: buildScenarioAssumptions(results),
            results,
          };

          createScenarioMutation.mutate(scenario);
        };

        return (
          <div key={definition.id} className="flex flex-col justify-between rounded-md border border-slate-200 p-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{definition.label}</h3>
              <dl className="mt-3 space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <dt>Effort</dt>
                  <dd>x{definition.effortMultiplier.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Duration</dt>
                  <dd>x{definition.durationMultiplier.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Cost</dt>
                  <dd>x{definition.costMultiplier.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Total Cost</dt>
                  <dd>{currencyFormatter.format(projectedResults.totalCost)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Risk Score</dt>
                  <dd>{projectedResults.riskScore}</dd>
                </div>
              </dl>
            </div>
            <button
              type="button"
              className="mt-4 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              onClick={handleGenerateScenario}
              disabled={createScenarioMutation.isPending}
            >
              Generate Scenario
            </button>
          </div>
        );
      }),
    [createScenarioMutation],
  );

  return (
    <Section
      title="Scenario Generator"
      actions={
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">{scenarios.length} saved</span>
          <button
            type="button"
            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            onClick={handleOpenDuplicate}
            disabled={!activeScenario || createScenarioMutation.isPending}
          >
            Duplicate Scenario
          </button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">{scenarioCards}</div>
      <div className="overflow-hidden rounded-md border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm" data-testid="scenario-list">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th scope="col" className="px-4 py-3">
                Scenario
              </th>
              <th scope="col" className="px-4 py-3">
                Total hours
              </th>
              <th scope="col" className="px-4 py-3">
                Vendor spend
              </th>
              <th scope="col" className="px-4 py-3">
                Total cost
              </th>
              <th scope="col" className="px-4 py-3">
                Readiness score
              </th>
              <th scope="col" className="px-4 py-3">
                Duration
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {scenarios.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-sm text-slate-500">
                  Generate or duplicate a scenario to start comparing KPIs.
                </td>
              </tr>
            )}
            {scenarios.map((scenario) => {
              const isActive = scenario.id === activeScenario?.id;

              return (
                <tr
                  key={scenario.id}
                  className={`border-t border-slate-200 ${isActive ? 'bg-slate-50' : 'bg-white'}`}
                  aria-selected={isActive}
                >
                  <th scope="row" className="whitespace-nowrap p-4 align-top">
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => handleSelectScenario(scenario.id)}
                    >
                      <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Scenario</span>
                      <span className="block text-sm font-semibold text-slate-900">{scenario.name}</span>
                    </button>
                  </th>
                  <td className="whitespace-nowrap p-4 align-top">
                    <span className="block text-xs font-medium uppercase text-slate-500">Total hours</span>
                    <span className="block text-sm text-slate-900">
                      {scenario.results.totalHours ? scenario.results.totalHours.toLocaleString() : '—'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap p-4 align-top">
                    <span className="block text-xs font-medium uppercase text-slate-500">Vendor spend</span>
                    <span className="block text-sm text-slate-900">
                      {scenario.results.vendorSpendPct !== undefined ? `${scenario.results.vendorSpendPct}%` : '—'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap p-4 align-top">
                    <span className="block text-xs font-medium uppercase text-slate-500">Total cost</span>
                    <span className="block text-sm text-slate-900">
                      {scenario.results.totalCost ? currencyFormatter.format(scenario.results.totalCost) : '—'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap p-4 align-top">
                    <span className="block text-xs font-medium uppercase text-slate-500">Readiness score</span>
                    <span className="block text-sm text-slate-900">
                      {scenario.results.readinessScore !== undefined ? `${scenario.results.readinessScore}` : '—'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap p-4 align-top">
                    <span className="block text-xs font-medium uppercase text-slate-500">Duration</span>
                    <span className="block text-sm text-slate-900">
                      {scenario.results.durationMonths !== undefined ? `${scenario.results.durationMonths} mo` : '—'}
                    </span>
                  </td>
                  <td className="p-4 align-top">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteScenario(scenario.id)}
                        disabled={deleteScenarioMutation.isPending}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isDuplicateOpen && activeScenario && (
        <form className="mt-6 space-y-3 rounded-md border border-slate-200 p-4" onSubmit={handleDuplicateScenario}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">Duplicate Scenario</h3>
            <button
              type="button"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              onClick={() => setDuplicateOpen(false)}
            >
              Cancel
            </button>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Scenario Name
            <input
              type="text"
              value={duplicateForm.name}
              onChange={handleDuplicateChange('name')}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block text-sm font-medium text-slate-700">
              Effort multiplier
              <input
                type="number"
                step="0.01"
                min="0"
                value={duplicateForm.effortMultiplier}
                onChange={handleDuplicateChange('effortMultiplier')}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Duration multiplier
              <input
                type="number"
                step="0.01"
                min="0"
                value={duplicateForm.durationMultiplier}
                onChange={handleDuplicateChange('durationMultiplier')}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Cost multiplier
              <input
                type="number"
                step="0.01"
                min="0"
                value={duplicateForm.costMultiplier}
                onChange={handleDuplicateChange('costMultiplier')}
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              disabled={createScenarioMutation.isPending}
            >
              Save
            </button>
          </div>
        </form>
      )}
    </Section>
  );
};
