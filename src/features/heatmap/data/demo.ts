import type { RolePlan } from '../types';

const practices = ['Program', 'Change', 'Integration', 'Technical', 'Security', 'Data'];
const roleNames = [
  'Program Manager',
  'Functional Lead',
  'Reporting Analyst',
  'Integration Architect',
  'QA Specialist',
  'Security Analyst',
  'Change Manager',
  'HRIS Consultant',
  'Data Migration Lead',
  'Payroll Specialist',
  'Time Tracking Lead',
  'Benefits Analyst',
  'Finance Lead',
  'Compensation Analyst',
  'Test Manager',
  'Localization Lead',
  'Learning Coordinator',
  'Technical Architect',
  'Solution Owner',
  'Cutover Manager',
  'Change Network Lead',
  'Report Developer',
  'Security Architect',
  'Integration Developer',
  'Workstream PM',
  'Org Readiness Lead',
  'Analytics Engineer',
  'HR Operations SME',
  'Comms Strategist',
  'Deployment Lead',
  'Data Conversion Analyst',
  'Payroll SME',
  'Benefits SME',
  'Adoption Coach',
  'Release Manager',
  'Testing Coordinator',
  'Risk Manager',
  'Hypercare Lead',
  'Cutover Analyst',
  'Quality Auditor',
  'Integration QA',
  'Data Steward',
  'Security Engineer',
  'Governance Lead',
  'Learning Designer',
  'Reporting QA',
  'Field HR Lead',
  'Service Delivery Lead',
  'Support Transition Lead',
];

const months: string[] = [
  'Jan 2025',
  'Feb 2025',
  'Mar 2025',
  'Apr 2025',
  'May 2025',
  'Jun 2025',
  'Jul 2025',
  'Aug 2025',
  'Sep 2025',
  'Oct 2025',
  'Nov 2025',
  'Dec 2025',
];

type RandomGenerator = () => number;

function createSeededGenerator(seed: number): RandomGenerator {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

const random = createSeededGenerator(42);

function sample(min: number, max: number): number {
  return min + (max - min) * random();
}

function buildRolePlan(index: number): RolePlan {
  const roleName = roleNames[index % roleNames.length];
  const practice = practices[index % practices.length];
  const baselineFte = Math.round(sample(6, 18) * 10) / 10;

  return {
    role: {
      id: `role-${index}`,
      name: roleName,
      practice,
      baselineFte,
    },
    months: months.map((month) => {
      const demand = sample(0.85, 1.3) * baselineFte;
      const supply = sample(0.7, 1.15) * baselineFte;
      return {
        month,
        demand: Number(demand.toFixed(2)),
        supply: Number(supply.toFixed(2)),
      };
    }),
  };
}

export const demoPlans: RolePlan[] = Array.from({ length: 48 }, (_, index) => buildRolePlan(index));

export { months };
