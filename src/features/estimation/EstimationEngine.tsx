import React, { useMemo } from 'react';
import { Section } from '../../components/Section';
import { useProjectStore } from '../../store/useProjectStore';

const KPI_LABELS = {
  costPerFte: 'Cost per FTE',
  readinessScore: 'Readiness Score',
  totalVendors: 'Vendor Partners',
  projectedTimeline: 'Projected Timeline',
};

type KpiKey = keyof typeof KPI_LABELS;

type KpiCard = {
  key: KpiKey;
  value: string;
  trend: 'up' | 'down' | 'flat';
  description: string;
};

const formatCurrency = (value: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value);

export const EstimationEngine: React.FC = () => {
  const { roles, resources, scenarios } = useProjectStore((state) => ({
    roles: state.roles,
    resources: state.resources,
    scenarios: state.scenarios,
  }));

  const kpis = useMemo<KpiCard[]>(() => {
    const totalCapacity = roles.reduce((sum, role) => sum + role.monthlyCapacity, 0);
    const totalAvailability = resources.reduce((sum, resource) => sum + resource.availability, 0);
    const activeScenario = scenarios[0];
    const totalCost = activeScenario?.results.totalCost ?? totalCapacity * 480;
    const costPerFte = totalCost / Math.max(totalAvailability, 1);
    const readinessScore = activeScenario?.results.riskScore ? 1 - activeScenario.results.riskScore : 0.58;

    return [
      {
        key: 'costPerFte',
        value: formatCurrency(costPerFte),
        trend: costPerFte > 150000 ? 'up' : 'down',
        description: 'Blended program cost normalized by active FTE capacity.',
      },
      {
        key: 'readinessScore',
        value: `${Math.round(readinessScore * 100)}%`,
        trend: readinessScore > 0.65 ? 'up' : readinessScore < 0.45 ? 'down' : 'flat',
        description: 'Composite change readiness index derived from scenario risk modeling.',
      },
      {
        key: 'totalVendors',
        value: `${Math.max(Math.round(totalAvailability / 3), 1)}`,
        trend: totalAvailability > 5 ? 'up' : 'flat',
        description: 'Estimated vendor partner pods needed to maintain coverage.',
      },
      {
        key: 'projectedTimeline',
        value: `${Math.round((activeScenario?.multipliers.durationMultiplier ?? 1) * 12)} months`,
        trend: (activeScenario?.multipliers.durationMultiplier ?? 1) > 1 ? 'up' : 'down',
        description: 'Projected transformation timeline incorporating scope multipliers.',
      },
    ];
  }, [resources, roles, scenarios]);

  return (
    <Section title="Estimation Engine" actions={<span className="text-xs text-slate-500">KPI snapshot</span>}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <article key={kpi.key} className="space-y-2 rounded-md border border-slate-200 p-4">
            <header className="flex items-center justify-between text-xs text-slate-500">
              <span>{KPI_LABELS[kpi.key]}</span>
              <span className={kpi.trend === 'up' ? 'text-emerald-600' : kpi.trend === 'down' ? 'text-rose-600' : 'text-slate-400'}>
                {kpi.trend === 'up' ? '▲' : kpi.trend === 'down' ? '▼' : '■'}
              </span>
            </header>
            <p className="text-2xl font-semibold text-slate-900">{kpi.value}</p>
            <p className="text-xs text-slate-500">{kpi.description}</p>
          </article>
        ))}
      </div>
    </Section>
  );
};
