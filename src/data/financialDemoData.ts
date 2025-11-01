/**
 * Demo data generators for Financial Module
 */

import type { Budget, CostDriver, RevenueStream, FinancialPeriod } from './types';

export function generateFinancialPeriods(orgId: string): FinancialPeriod[] {
  const currentYear = 2025;
  const periods: FinancialPeriod[] = [];

  // Generate annual and quarterly periods
  for (let year = currentYear - 1; year <= currentYear; year++) {
    // Annual period
    periods.push({
      id: `period-${year}-annual`,
      organizationId: orgId,
      name: `FY ${year}`,
      periodType: 'fiscal_year',
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
      status: year === currentYear ? 'open' : 'closed',
      createdAt: `${year}-01-01T00:00:00Z`,
      updatedAt: `${year}-01-01T00:00:00Z`,
    });

    // Quarterly periods
    for (let q = 1; q <= 4; q++) {
      const startMonth = (q - 1) * 3 + 1;
      const endMonth = q * 3;
      periods.push({
        id: `period-${year}-q${q}`,
        organizationId: orgId,
        name: `Q${q} ${year}`,
        periodType: 'quarter',
        startDate: `${year}-${String(startMonth).padStart(2, '0')}-01`,
        endDate: `${year}-${String(endMonth).padStart(2, '0')}-${endMonth === 3 || endMonth === 12 ? '31' : '30'}`,
        status: year === currentYear && q === 1 ? 'open' : year === currentYear && q <= 2 ? 'open' : 'closed',
        createdAt: `${year}-01-01T00:00:00Z`,
        updatedAt: `${year}-01-01T00:00:00Z`,
      });
    }
  }

  return periods;
}

export function generateBudgets(orgId: string, periodId: string): Budget[] {
  const departments = ['Emergency', 'Surgery', 'ICU', 'Med/Surg', 'Outpatient', 'Imaging', 'Lab'];
  const categories = ['Labor', 'Medical Supplies', 'Pharmaceuticals', 'Equipment', 'Overhead'];
  
  const budgets: Budget[] = [];
  
  departments.forEach((dept, deptIdx) => {
    categories.forEach((category, catIdx) => {
      const baseAmount = Math.floor(Math.random() * 500000) + 200000;
      const actualAmount = baseAmount * (0.85 + Math.random() * 0.3); // 85% to 115% of budget
      const forecastedAmount = actualAmount * (0.95 + Math.random() * 0.1);
      
      budgets.push({
        id: `budget-${deptIdx}-${catIdx}`,
        organizationId: orgId,
        periodId: periodId,
        category: dept,
        categoryName: category,
        budgetedAmount: Math.round(baseAmount),
        actualAmount: Math.round(actualAmount),
        forecastedAmount: Math.round(forecastedAmount),
        variancePercentage: Math.round(((actualAmount - baseAmount) / baseAmount) * 100 * 10) / 10,
        notes: Math.random() > 0.7 ? `${category} costs ${actualAmount > baseAmount ? 'over' : 'under'} budget due to ${actualAmount > baseAmount ? 'increased demand' : 'efficiency improvements'}` : undefined,
        status: Math.random() > 0.8 ? 'pending_approval' : 'active',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      });
    });
  });

  return budgets;
}

export function generateCostDrivers(orgId: string): CostDriver[] {
  return [
    {
      id: 'cd-1',
      organizationId: orgId,
      name: 'Labor Costs',
      category: 'labor',
      unitCost: 52,
      volumeMetric: 'FTE',
      trendAnalysis: { trend: 'increasing', variance: -4000000 },
      description: 'Overtime, agency staffing, and wage increases',
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cd-2',
      organizationId: orgId,
      name: 'Medical Supplies',
      category: 'supplies',
      unitCost: 45,
      volumeMetric: 'Patient Days',
      trendAnalysis: { trend: 'stable', variance: -500000 },
      description: 'Volume increases and supply chain inflation',
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cd-3',
      organizationId: orgId,
      name: 'Pharmaceuticals',
      category: 'supplies',
      unitCost: 68,
      volumeMetric: 'Prescriptions',
      trendAnalysis: { trend: 'increasing', variance: -1500000 },
      description: 'Drug price increases and new specialty drugs',
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cd-4',
      organizationId: orgId,
      name: 'Facility Costs',
      category: 'facilities',
      unitCost: 22,
      volumeMetric: 'Square Feet',
      trendAnalysis: { trend: 'stable', variance: -200000 },
      description: 'Utilities, maintenance, and depreciation',
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
  ];
}

export function generateRevenueStreams(orgId: string, periodId: string): RevenueStream[] {
  const payerTypes = [
    { name: 'Medicare', percentage: 43.5, avgReimbursement: 4200 },
    { name: 'Medicaid', percentage: 14.6, avgReimbursement: 3500 },
    { name: 'Commercial', percentage: 34.1, avgReimbursement: 6800 },
    { name: 'Self-Pay', percentage: 7.8, avgReimbursement: 2100 },
  ];

  const baseVolume = 2500; // encounters per payer per month

  return payerTypes.map((payer, idx) => {
    const volume = Math.floor(baseVolume * (payer.percentage / 100) * (0.9 + Math.random() * 0.2));
    const grossRevenue = volume * payer.avgReimbursement;
    const contractualAdjustments = grossRevenue * (0.15 + Math.random() * 0.15);
    const denials = grossRevenue * (0.05 + Math.random() * 0.05);
    const netRevenue = grossRevenue - contractualAdjustments - denials;

    return {
      id: `revenue-${idx}`,
      organizationId: orgId,
      serviceLine: payer.name,
      revenueType: 'fee_for_service' as const,
      periodId: periodId,
      projectedRevenue: Math.round(grossRevenue),
      actualRevenue: Math.round(netRevenue),
      collectionRate: Math.round((netRevenue / grossRevenue) * 100 * 10) / 10,
      netRevenue: Math.round(netRevenue),
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    };
  });
}

