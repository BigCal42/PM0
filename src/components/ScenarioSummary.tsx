import { formatGap, formatNumber, formatPercent } from '@/lib/format';
import type { ScenarioPreset } from '@/features/scenario/presets';

interface ScenarioSummaryProps {
  totals: {
    demand: number;
    supply: number;
    gap: number;
  };
  multipliers: {
    demand: number;
    supply: number;
    preset: ScenarioPreset;
  };
}

export function ScenarioSummary({ totals, multipliers }: ScenarioSummaryProps) {
  const coverage = totals.demand === 0 ? 1 : totals.supply / totals.demand;

  return (
    <section className="grid gap-6 rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200 md:grid-cols-3">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Active scenario</p>
        <h2 className="text-xl font-semibold text-slate-900">{multipliers.preset.label}</h2>
        <p className="text-sm text-slate-600">{multipliers.preset.description}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
            <p className="font-medium text-slate-700">Demand</p>
            <p className="font-semibold text-indigo-600">× {multipliers.demand.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
            <p className="font-medium text-slate-700">Supply</p>
            <p className="font-semibold text-indigo-600">× {multipliers.supply.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total demand</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{formatNumber(totals.demand)}</p>
        <p className="mt-1 text-xs text-slate-500">FTE months across selected roles.</p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total supply</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{formatNumber(totals.supply)}</p>
        <p className="mt-1 text-xs text-slate-500">Gap {formatGap(totals.gap)} • Coverage {formatPercent(coverage)}.</p>
      </div>
    </section>
  );
}
