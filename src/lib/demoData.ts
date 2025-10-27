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
    name: 'Baseline',
    multipliers: {
      id: 'baseline',
      label: 'Baseline',
      effortMultiplier: 1,
      durationMultiplier: 1,
      costMultiplier: 1,
    },
    assumptions: { recruitmentLeadTimeWeeks: 8, knowledgeTransfer: 'Standard' },
    results: { totalCost: 1250000, totalFte: 18.4, riskScore: 0.42 },
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
    assumptions: { recruitmentLeadTimeWeeks: 6, knowledgeTransfer: 'Compressed' },
    results: { totalCost: 1475000, totalFte: 19.6, riskScore: 0.55 },
  },
];
