// Workforce Module TypeScript Types
// Corresponds to supabase/migrations/003_workforce_module.sql

export interface Employee {
  id: string;
  org_id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  cost_center_id?: string;
  job_title?: string;
  job_category?: string;
  employee_type?: string;
  hire_date?: string;
  termination_date?: string;
  is_active: boolean;
  fte: number;
  base_hourly_rate?: number;
  overtime_rate?: number;
  shift_differential?: number;
  credentials?: Record<string, any>;
  skills?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ShiftTemplate {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  shift_type?: string;
  start_time: string;
  end_time: string;
  duration_hours?: number;
  break_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  org_id: string;
  employee_id: string;
  cost_center_id?: string;
  shift_template_id?: string;
  schedule_date: string;
  shift_start: string;
  shift_end: string;
  scheduled_hours?: number;
  actual_start?: string;
  actual_end?: string;
  actual_hours?: number;
  break_minutes?: number;
  is_overtime: boolean;
  is_holiday: boolean;
  status: 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LaborCost {
  id: string;
  org_id: string;
  employee_id: string;
  cost_center_id?: string;
  pay_period_start: string;
  pay_period_end: string;
  regular_hours: number;
  overtime_hours: number;
  pto_hours: number;
  regular_pay?: number;
  overtime_pay?: number;
  shift_differential_pay?: number;
  bonus_pay?: number;
  total_gross_pay?: number;
  benefits_cost?: number;
  taxes_cost?: number;
  total_labor_cost?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductivityMetrics {
  id: string;
  org_id: string;
  cost_center_id?: string;
  metric_date: string;
  metric_period?: string;
  patient_days?: number;
  worked_hours?: number;
  productive_hours?: number;
  non_productive_hours?: number;
  hours_per_patient_day?: number;
  fte_utilized?: number;
  fte_budgeted?: number;
  fte_variance?: number;
  productivity_index?: number;
  utilization_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface EngagementSurvey {
  id: string;
  org_id: string;
  survey_name: string;
  survey_type?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  is_anonymous: boolean;
  status: 'Draft' | 'Active' | 'Closed' | 'Analyzing';
  created_at: string;
  updated_at: string;
}

export interface EngagementResponse {
  id: string;
  survey_id: string;
  employee_id?: string;
  cost_center_id?: string;
  job_category?: string;
  response_date: string;
  overall_satisfaction?: number;
  work_life_balance?: number;
  management_support?: number;
  career_development?: number;
  compensation_satisfaction?: number;
  team_collaboration?: number;
  workload_manageable?: number;
  burnout_risk_score?: number;
  emotional_exhaustion?: number;
  depersonalization?: number;
  personal_accomplishment?: number;
  comments?: string;
  suggestions?: string;
  created_at: string;
}

export interface TurnoverEvent {
  id: string;
  org_id: string;
  employee_id?: string;
  cost_center_id?: string;
  job_category?: string;
  hire_date?: string;
  termination_date: string;
  tenure_months?: number;
  termination_type?: string;
  termination_reason?: string;
  is_regrettable?: boolean;
  exit_interview_completed: boolean;
  exit_interview_notes?: string;
  replacement_cost?: number;
  notice_period_days?: number;
  created_at: string;
}

export interface TimeOffRequest {
  id: string;
  employee_id: string;
  request_type: string;
  start_date: string;
  end_date: string;
  total_hours?: number;
  status: 'Pending' | 'Approved' | 'Denied' | 'Cancelled';
  requested_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface StaffingForecast {
  id: string;
  org_id: string;
  cost_center_id?: string;
  forecast_date: string;
  forecast_period?: string;
  forecast_method?: string;
  predicted_patient_volume?: number;
  predicted_acuity_score?: number;
  recommended_fte?: number;
  recommended_by_category?: Record<string, number>;
  confidence_level?: number;
  actual_volume?: number;
  actual_staffing?: number;
  forecast_accuracy?: number;
  created_at: string;
  updated_at: string;
}

export interface WorkforceAlert {
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
  status: 'New' | 'Acknowledged' | 'Investigating' | 'Resolved' | 'Dismissed';
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_at?: string;
  created_at: string;
}

// View Types
export interface LaborCostSummary {
  org_id: string;
  cost_center_id?: string;
  cost_center_name?: string;
  month: string;
  employee_count: number;
  total_regular_hours: number;
  total_overtime_hours: number;
  overtime_percentage: number;
  total_labor_cost: number;
  avg_labor_cost_per_employee: number;
}

export interface ProductivityDashboard {
  org_id: string;
  cost_center_id?: string;
  cost_center_name?: string;
  metric_date: string;
  patient_days?: number;
  worked_hours?: number;
  hours_per_patient_day?: number;
  fte_utilized?: number;
  fte_budgeted?: number;
  fte_variance?: number;
  productivity_index?: number;
  utilization_rate?: number;
  productivity_status: 'On Target' | 'Over Productive' | 'Under Productive';
}

export interface EngagementSummary {
  survey_id: string;
  survey_name: string;
  cost_center_id?: string;
  cost_center_name?: string;
  job_category?: string;
  response_count: number;
  avg_satisfaction: number;
  avg_work_life_balance: number;
  avg_workload_manageable: number;
  avg_burnout_risk: number;
  high_burnout_count: number;
  high_burnout_percentage: number;
}

export interface TurnoverMetrics {
  org_id: string;
  cost_center_id?: string;
  cost_center_name?: string;
  job_category?: string;
  year: string;
  termination_count: number;
  regrettable_turnover_count: number;
  avg_tenure_months: number;
  total_replacement_cost: number;
  voluntary_count: number;
  involuntary_count: number;
}

// Dashboard Data Types
export interface WorkforceDashboardData {
  totalEmployees: number;
  activeEmployees: number;
  totalFTE: number;
  alerts: WorkforceAlert[];
  laborCosts: {
    totalCost: number;
    overtimePercentage: number;
    avgCostPerEmployee: number;
  };
  productivity: {
    avgHoursPerPatientDay: number;
    productivityIndex: number;
    utilizationRate: number;
  };
  engagement: {
    avgSatisfaction: number;
    highBurnoutCount: number;
    burnoutPercentage: number;
  };
  turnover: {
    annualTurnoverRate: number;
    regrettableTurnoverRate: number;
    avgTenureMonths: number;
  };
}

export interface EmployeeFormData {
  employee_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  cost_center_id?: string;
  job_title?: string;
  job_category?: string;
  employee_type?: string;
  hire_date?: string;
  fte: number;
  base_hourly_rate?: number;
}

