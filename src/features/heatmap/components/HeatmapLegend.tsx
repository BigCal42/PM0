import { severityToClass } from '../utils/severity';

const LEGEND_ITEMS = [
  { label: 'Surplus (≥115%)', key: 'surplus' },
  { label: 'Balanced (95-115%)', key: 'balanced' },
  { label: 'Watch (80-95%)', key: 'watch' },
  { label: 'High Risk (65-80%)', key: 'high' },
  { label: 'Critical (<65%)', key: 'critical' },
] as const;

export function HeatmapLegend() {
  return (
    <div className="flex flex-wrap gap-2 text-xs text-slate-600">
      {LEGEND_ITEMS.map((item) => (
        <span key={item.key} className={`flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm`}>
          <span className={`${severityToClass[item.key]} inline-flex h-3 w-3 items-center justify-center rounded-full border border-slate-300`}></span>
          {item.label}
        </span>
      ))}
    </div>
  );
}
