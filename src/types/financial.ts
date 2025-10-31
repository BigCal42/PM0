// Financial Module TypeScript Types
// Corresponds to supabase/migrations/002_financial_module.sql

export interface CostCenter {
  id: string;
  org_id: string;
  code: string;
  name: string;
  description?: string;
  department_type?: string;
  parent_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  org_id: string;
  cost_center_id?: string;
  fiscal_year: number;
  fiscal_period: string;
  budget_type: string;
  category?: string;
  budgeted_amount: number;
  actual_amount: number;
  variance_amount?: number;
  variance_percent?: number;
  notes?: string;
  status: 'Draft' | 'Active' | 'Closed' | 'Locked';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface RevenueTransaction {
  id: string;
  org_id: string;
  transaction_date: string;
  service_date?: string;
  cost_center_id?: string;
  transaction_type: string;
  service_code?: string;
  drg_code?: string;
  payer_type?: string;
  payer_name?: string;
  gross_charge?: number;
  contractual_adjustment?: number;
  payment_amount?: number;
  denial_amount?: number;
  denial_reason?: string;
  net_revenue?: number;
  collection_rate?: number;
  days_to_payment?: number;
  claim_status?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceLine {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  service_category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceLineMetrics {
  id: string;
  service_line_id: string;
  fiscal_year: number;
  fiscal_period: string;
  volume?: number;
  gross_revenue?: number;
  net_revenue?: number;
  direct_costs?: number;
  indirect_costs?: number;
  total_costs?: number;
  contribution_margin?: number;
  margin_percentage?: number;
  cost_per_case?: number;
  created_at: string;
  updated_at: string;
}

export interface Initiative {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  category?: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  start_date?: string;
  target_completion_date?: string;
  actual_completion_date?: string;
  owner_id?: string;
  cost_center_id?: string;
  estimated_investment?: number;
  actual_investment?: number;
  estimated_annual_savings?: number;
  actual_annual_savings?: number;
  estimated_roi_percent?: number;
  actual_roi_percent?: number;
  payback_period_months?: number;
  created_at: string;
  updated_at: string;
}

export interface FinancialAlert {
  id: string;
  org_id: string;
  alert_type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  entity_type?: string;
  entity_id?: string;
  title: string;
  message: string;
  threshold_value?: number;
  actual_value?: number;
  variance_percent?: number;
  status: 'New' | 'Acknowledged' | 'Investigating' | 'Resolved' | 'Dismissed';
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_at?: string;
  created_at: string;
}

// View Types
export interface BudgetPerformanceSummary {
  org_id: string;
  fiscal_year: number;
  fiscal_period: string;
  cost_center_name?: string;
  budget_type: string;
  category?: string;
  budgeted_amount: number;
  actual_amount: number;
  variance_amount: number;
  variance_percent: number;
  status: 'On Track' | 'Under Budget' | 'Over Budget';
  updated_at: string;
}

export interface RevenueCycleKPIs {
  org_id: string;
  month: string;
  payer_type?: string;
  transaction_count: number;
  total_gross_charge: number;
  total_net_revenue: number;
  total_denials: number;
  denial_rate: number;
  collection_rate: number;
  avg_days_to_payment: number;
}

export interface ServiceLineProfitability {
  org_id: string;
  service_line: string;
  service_category?: string;
  fiscal_year: number;
  fiscal_period: string;
  volume?: number;
  net_revenue?: number;
  total_costs?: number;
  contribution_margin?: number;
  margin_percentage?: number;
  cost_per_case?: number;
  profitability_status: 'High Profit' | 'Profitable' | 'Break Even' | 'Loss';
}

// Dashboard Data Types
export interface FinancialDashboardData {
  totalBudget: number;
  actualSpending: number;
  variance: number;
  variancePercent: number;
  alerts: FinancialAlert[];
  topCostCenters: Array<{
    name: string;
    budget: number;
    actual: number;
    variance: number;
  }>;
  revenueMetrics: {
    totalRevenue: number;
    denialRate: number;
    collectionRate: number;
    daysToPayment: number;
  };
  topServiceLines: ServiceLineProfitability[];
}

export interface BudgetFormData {
  cost_center_id?: string;
  fiscal_year: number;
  fiscal_period: string;
  budget_type: string;
  category?: string;
  budgeted_amount: number;
  notes?: string;
}

