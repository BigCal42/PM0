import type { HeatmapCell, Resource, Role, Scenario } from '../store/useProjectStore';

export const demoRoles: Role[] = [
  { id: 'role-architect', name: 'Solution Architect', description: 'Owns Workday architecture decisions', monthlyCapacity: 140 },
  { id: 'role-pm', name: 'Program Manager', description: 'Oversees delivery cadence', monthlyCapacity: 160 },
  { id: 'role-hcm', name: 'HCM Analyst', description: 'Configures Workday HCM modules', monthlyCapacity: 150 },
];

export const demoResources: Resource[] = [
  { id: 'res-1', roleId: 'role-architect', name: 'Alex Johnson', availability: 0.9 },
  { id: 'res-2', roleId: 'role-pm', name: 'Jordan Smith', availability: 1.0 },
  { id: 'res-3', roleId: 'role-hcm', name: 'Taylor Brown', availability: 0.8 },
];

const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'];

export const demoHeatmap: HeatmapCell[] = months.flatMap((month) => [
  { id: `${month}-architect`, roleId: 'role-architect', month, severity: 'medium', gap: 0.35 },
  { id: `${month}-pm`, roleId: 'role-pm', month, severity: 'low', gap: 0.12 },
  { id: `${month}-hcm`, roleId: 'role-hcm', month, severity: 'high', gap: 0.62 },
]);

export const demoScenarios: Scenario[] = [
  {
    id: 'baseline',
    name: 'Baseline FY24',
    multipliers: {
      id: 'baseline',
      label: 'Baseline FY24',
      effortMultiplier: 1,
      durationMultiplier: 1,
      costMultiplier: 1,
    },
    assumptions: {
      estimatedHours: 5200,
      vendorMixPct: 35,
      durationMonths: 12,
      blendedRate: 185,
      readinessWeight: 82,
    },
    results: {
      totalCost: 962000,
      totalFte: 2.7,
      riskScore: 0.18,
      totalHours: 5200,
      vendorSpendPct: 35,
      readinessScore: 82,
      durationMonths: 12,
    },
  },
  {
    id: 'accelerated',
    name: 'Accelerated',
    multipliers: {
      id: 'accelerated',
      label: 'Accelerated',
      effortMultiplier: 1.15,
      durationMultiplier: 0.85,
      costMultiplier: 1.2,
    },
    assumptions: {
      estimatedHours: 6100,
      vendorMixPct: 40,
      durationMonths: 9,
      blendedRate: 192,
      readinessWeight: 76,
    },
    results: {
      totalCost: 1171200,
      totalFte: 3.4,
      riskScore: 0.24,
      totalHours: 6100,
      vendorSpendPct: 40,
      readinessScore: 76,
      durationMonths: 9,
    },
  },
];
