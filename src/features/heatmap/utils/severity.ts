import type { SeverityLevel } from '../types';

export function calculateSeverity(demand: number, supply: number): SeverityLevel {
  if (demand <= 0 && supply <= 0) {
    return 'balanced';
  }

  if (demand <= 0 && supply > 0) {
    return 'surplus';
  }

  const coverage = supply / Math.max(demand, 1);

  if (coverage >= 1.15) {
    return 'surplus';
  }

  if (coverage >= 0.95) {
    return 'balanced';
  }

  if (coverage >= 0.8) {
    return 'watch';
  }

  if (coverage >= 0.65) {
    return 'high';
  }

  return 'critical';
}

export const severityToClass: Record<SeverityLevel, string> = {
  surplus: 'bg-emerald-100/70 text-emerald-900',
  balanced: 'bg-emerald-50 text-emerald-900',
  watch: 'bg-amber-50 text-amber-900',
  high: 'bg-orange-50 text-orange-900',
  critical: 'bg-rose-100 text-rose-900',
};
