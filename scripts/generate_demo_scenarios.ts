#!/usr/bin/env ts-node
/*
 * Recomputes demo scenario metrics and heatmap cells based on the assumptions
 * stored in `/data/scenarios.json`. The script keeps demo fixtures aligned with
 * Supabase seed data so local/dev mode mirrors production calculations.
 */
import { promises as fs } from 'fs';
import path from 'path';

interface ScenarioAssumptions {
  estimated_hours: number;
  vendor_mix_pct: number;
  duration_months: number;
  blended_rate: number;
  readiness_weight: number;
}

interface ScenarioMetrics {
  total_hours: number;
  total_cost: number;
  peak_fte: number;
  vendor_spend_pct: number;
  readiness_score: number;
}

interface ScenarioFixture {
  id: string;
  projectId: string;
  name: string;
  template: string;
  assumptions: ScenarioAssumptions;
  metrics?: ScenarioMetrics;
}

interface HeatmapCell {
  projectId: string;
  scenarioId: string;
  month: string;
  demandHours: number;
  supplyHours: number;
  severity: 'on_track' | 'watch' | 'at_risk' | 'critical';
}

const DATA_DIR = path.resolve(process.cwd(), 'data');

async function loadJson<T>(file: string): Promise<T> {
  const fullPath = path.join(DATA_DIR, file);
  const raw = await fs.readFile(fullPath, 'utf8');
  return JSON.parse(raw) as T;
}

async function writeJson<T>(file: string, data: T) {
  const fullPath = path.join(DATA_DIR, file);
  const payload = `${JSON.stringify(data, null, 2)}\n`;
  await fs.writeFile(fullPath, payload, 'utf8');
}

function computeMetrics(assumptions: ScenarioAssumptions): ScenarioMetrics {
  const { estimated_hours, vendor_mix_pct, duration_months, blended_rate, readiness_weight } = assumptions;
  const safeDuration = Math.max(duration_months, 1);
  const total_cost = Number((estimated_hours * blended_rate).toFixed(2));
  const peak_fte = Number((estimated_hours / (safeDuration * 160)).toFixed(2));
  return {
    total_hours: Number(estimated_hours.toFixed(2)),
    total_cost,
    peak_fte,
    vendor_spend_pct: Number(vendor_mix_pct.toFixed(2)),
    readiness_score: Number(readiness_weight.toFixed(2))
  };
}

function deriveHeatmapCells(scenarios: ScenarioFixture[]): HeatmapCell[] {
  const baselineMonths = ['2024-01-01', '2024-02-01', '2024-03-01'];
  const cells: HeatmapCell[] = [];
  for (const scenario of scenarios) {
    const metrics = scenario.metrics ?? computeMetrics(scenario.assumptions);
    const monthlyDemand = metrics.total_hours / baselineMonths.length;
    baselineMonths.forEach((month, index) => {
      const decay = 1 - index * 0.08;
      const demand = Math.round(monthlyDemand * Math.max(decay, 0.6));
      const supply = Math.round(demand * (1 - (metrics.vendor_spend_pct / 200)));
      const gapRatio = demand === 0 ? 0 : (demand - supply) / demand;
      let severity: HeatmapCell['severity'] = 'on_track';
      if (gapRatio > 0.4) severity = 'critical';
      else if (gapRatio > 0.25) severity = 'at_risk';
      else if (gapRatio > 0.1) severity = 'watch';
      cells.push({
        projectId: scenario.projectId,
        scenarioId: scenario.id,
        month,
        demandHours: demand,
        supplyHours: supply,
        severity
      });
    });
  }
  return cells;
}

async function main() {
  const scenarios = await loadJson<ScenarioFixture[]>('scenarios.json');
  const enriched = scenarios.map((scenario) => ({
    ...scenario,
    metrics: computeMetrics(scenario.assumptions)
  }));
  await writeJson('scenarios.json', enriched);

  const heatmap = deriveHeatmapCells(enriched);
  await writeJson('heatmap.json', heatmap);

  console.log(`Updated ${enriched.length} scenarios and ${heatmap.length} heatmap cells.`);
}

main().catch((error) => {
  console.error('Failed to generate demo scenarios', error);
  process.exitCode = 1;
});

