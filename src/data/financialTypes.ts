/**
 * Financial module types and interfaces
 */

import type { FinancialPeriod, Budget, CostDriver, RevenueStream } from './types';

export interface FinancialAdapter {
  // Financial Periods
  getFinancialPeriods(organizationId: string): Promise<FinancialPeriod[]>;
  getFinancialPeriod(id: string): Promise<FinancialPeriod | null>;
  createFinancialPeriod(data: Omit<FinancialPeriod, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinancialPeriod>;
  updateFinancialPeriod(id: string, data: Partial<FinancialPeriod>): Promise<FinancialPeriod>;
  
  // Budgets
  getBudgets(organizationId: string, periodId?: string): Promise<Budget[]>;
  getBudget(id: string): Promise<Budget | null>;
  createBudget(data: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget>;
  updateBudget(id: string, data: Partial<Budget>): Promise<Budget>;
  deleteBudget(id: string): Promise<void>;
  
  // Cost Drivers
  getCostDrivers(organizationId: string): Promise<CostDriver[]>;
  getCostDriver(id: string): Promise<CostDriver | null>;
  createCostDriver(data: Omit<CostDriver, 'id' | 'createdAt' | 'updatedAt'>): Promise<CostDriver>;
  updateCostDriver(id: string, data: Partial<CostDriver>): Promise<CostDriver>;
  
  // Revenue Streams
  getRevenueStreams(organizationId: string, periodId?: string): Promise<RevenueStream[]>;
  getRevenueStream(id: string): Promise<RevenueStream | null>;
  createRevenueStream(data: Omit<RevenueStream, 'id' | 'createdAt' | 'updatedAt'>): Promise<RevenueStream>;
  updateRevenueStream(id: string, data: Partial<RevenueStream>): Promise<RevenueStream>;
}

export interface BudgetSummary {
  totalBudgeted: number;
  totalActual: number;
  totalForecasted: number;
  varianceAmount: number;
  variancePercentage: number;
  budgets: Budget[];
}

export interface BudgetVariance {
  budget: Budget;
  variance: number;
  variancePercentage: number;
  status: 'on_track' | 'at_risk' | 'over_budget';
}
