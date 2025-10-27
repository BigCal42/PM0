import { Suspense, lazy } from 'react';
import { ScenarioSelector } from './components/ScenarioSelector';
import { ScenarioSummary } from './components/ScenarioSummary';
import { HeatmapLegend } from './features/heatmap/components/HeatmapLegend';
import { useHeatmapMatrix } from './features/heatmap/hooks/useHeatmapMatrix';
import { demoPlans } from './features/heatmap/data/demo';

const HeatmapGrid = lazy(() => import('./features/heatmap/components/HeatmapGrid'));

function App() {
  const { matrix, totals, months, multipliers } = useHeatmapMatrix(demoPlans);

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">PM0 Workforce Planner</p>
        <h1 className="text-3xl font-semibold text-slate-900">Scenario optimizer</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Toggle scenarios and fine-tune multipliers to project staffing coverage across practices. Rows are virtualized to keep
          large portfolios responsive and the heatmap recalculates gaps using memoized matrix math.
        </p>
      </header>

      <ScenarioSelector multipliers={multipliers} />
      <ScenarioSummary totals={totals} multipliers={multipliers} />

      <section className="space-y-4 rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Heatmap</h2>
            <p className="text-sm text-slate-600">Virtualized rows, memoized calculations, severity-scaled color stops.</p>
          </div>
          <HeatmapLegend />
        </div>
        <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-slate-100" /> }>
          <HeatmapGrid matrix={matrix} months={months} />
        </Suspense>
      </section>
    </div>
  );
}

export default App;
