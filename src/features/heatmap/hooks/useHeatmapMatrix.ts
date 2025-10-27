import { useMemo } from 'react';
import { calculateSeverity } from '../utils/severity';
import type { HeatmapMatrixResult, RolePlan } from '../types';
import { months } from '../data/demo';
import { useScenarioMultipliers } from '@/features/scenario/useScenarioMultipliers';

export function useHeatmapMatrix(plans: RolePlan[]): HeatmapMatrixResult & {
  multipliers: ReturnType<typeof useScenarioMultipliers>;
} {
  const multipliers = useScenarioMultipliers();

  const result = useMemo(() => {
    const matrix = plans.map((plan) => {
      let totalDemand = 0;
      let totalSupply = 0;

      const cells = plan.months.map((monthEntry) => {
        const demand = monthEntry.demand * multipliers.demand;
        const supply = monthEntry.supply * multipliers.supply;
        const gap = supply - demand;

        totalDemand += demand;
        totalSupply += supply;

        return {
          roleId: plan.role.id,
          month: monthEntry.month,
          demand,
          supply,
          gap,
          severity: calculateSeverity(demand, supply),
        };
      });

      return {
        role: plan.role,
        cells,
        totalDemand,
        totalSupply,
        totalGap: totalSupply - totalDemand,
      };
    });

    const totals = matrix.reduce(
      (acc, row) => {
        acc.demand += row.totalDemand;
        acc.supply += row.totalSupply;
        acc.gap += row.totalGap;
        return acc;
      },
      { demand: 0, supply: 0, gap: 0 },
    );

    return { matrix, totals, months };
  }, [plans, multipliers.demand, multipliers.supply]);

  return { ...result, multipliers };
}
