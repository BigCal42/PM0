/**
 * Common data types and repository interface
 */

export interface Project {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Scenario {
  id: string;
  projectId: string;
  name: string;
  type: 'baseline' | 'accelerated' | 'lean' | 'scope-lite';
  createdAt: string;
}

// Financial Types
export interface FinancialPeriod {
  id: string;
  organizationId: string;
  name: string;
  periodType: 'fiscal_year' | 'quarter' | 'month';
  startDate: string;
  endDate: string;
  status: 'open' | 'closed' | 'locked';
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  organizationId: string;
  projectId?: string;
  periodId: string;
  category: string; // department, service_line, cost_center
  categoryName: string;
  budgetedAmount: number;
  actualAmount: number;
  forecastedAmount?: number;
  variancePercentage?: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'active' | 'closed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface CostDriver {
  id: string;
  organizationId: string;
  name: string;
  category: 'labor' | 'supplies' | 'technology' | 'facilities' | 'other';
  unitCost?: number;
  volumeMetric?: string;
  trendAnalysis?: Record<string, unknown>;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RevenueStream {
  id: string;
  organizationId: string;
  serviceLine: string;
  revenueType: 'fee_for_service' | 'value_based' | 'capitation' | 'other';
  periodId: string;
  projectedRevenue: number;
  actualRevenue: number;
  collectionRate?: number;
  netRevenue?: number;
  createdAt: string;
  updatedAt: string;
}

// Workforce Types
export interface Department {
  id: string;
  organizationId: string;
  name: string;
  code?: string;
  costCenter?: string;
  parentDepartmentId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  organizationId: string;
  departmentId?: string;
  roleId?: string;
  resourceId?: string;
  employeeId: string; // HRIS ID
  firstName: string;
  lastName: string;
  email?: string;
  hireDate?: string;
  hourlyRate?: number;
  fte: number; // full-time equivalent
  employmentStatus: 'active' | 'on_leave' | 'terminated' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  organizationId: string;
  departmentId: string;
  periodStart: string;
  periodEnd: string;
  status: 'draft' | 'published' | 'active' | 'archived';
  createdBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleAssignment {
  id: string;
  scheduleId: string;
  employeeId: string;
  shiftDate: string;
  shiftStart: string;
  shiftEnd: string;
  hoursWorked: number;
  overtimeHours: number;
  shiftType?: 'regular' | 'call' | 'float' | 'agency' | 'overtime' | 'on_call';
  breakMinutes?: number;
  notes?: string;
  createdAt: string;
}

export interface LaborMetric {
  id: string;
  organizationId: string;
  departmentId: string;
  periodId?: string;
  metricDate: string;
  productiveHours: number;
  nonProductiveHours: number;
  overtimeHours: number;
  agencyHours: number;
  totalHours: number;
  laborCost: number;
  patientDays: number;
  costPerPatientDay?: number;
  hoursPerPatientDay?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeSentiment {
  id: string;
  organizationId: string;
  employeeId: string;
  surveyDate: string;
  burnoutScore?: number; // 1-10
  engagementScore?: number; // 1-10
  satisfactionScore?: number; // 1-10
  feedbackText?: string;
  createdAt: string;
}

export interface DataAdapter {
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | null>;
  getScenarios(projectId: string): Promise<Scenario[]>;
}

