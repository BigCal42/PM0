/**
 * Workforce module types and interfaces
 */

import type { Department, Employee, Schedule, ScheduleAssignment, LaborMetric, EmployeeSentiment } from './types';

// Re-export types for use in other modules
export type { Department, Employee, Schedule, ScheduleAssignment, LaborMetric, EmployeeSentiment };

export interface WorkforceAdapter {
  // Departments
  getDepartments(organizationId: string): Promise<Department[]>;
  getDepartment(id: string): Promise<Department | null>;
  createDepartment(data: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department>;
  updateDepartment(id: string, data: Partial<Department>): Promise<Department>;
  
  // Employees
  getEmployees(organizationId: string, departmentId?: string): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | null>;
  createEmployee(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee>;
  updateEmployee(id: string, data: Partial<Employee>): Promise<Employee>;
  
  // Schedules
  getSchedules(organizationId: string, departmentId?: string): Promise<Schedule[]>;
  getSchedule(id: string): Promise<Schedule | null>;
  createSchedule(data: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<Schedule>;
  updateSchedule(id: string, data: Partial<Schedule>): Promise<Schedule>;
  publishSchedule(id: string): Promise<Schedule>;
  
  // Schedule Assignments
  getScheduleAssignments(scheduleId: string): Promise<ScheduleAssignment[]>;
  createScheduleAssignment(data: Omit<ScheduleAssignment, 'id' | 'createdAt'>): Promise<ScheduleAssignment>;
  updateScheduleAssignment(id: string, data: Partial<ScheduleAssignment>): Promise<ScheduleAssignment>;
  deleteScheduleAssignment(id: string): Promise<void>;
  
  // Labor Metrics
  getLaborMetrics(organizationId: string, departmentId?: string, periodId?: string): Promise<LaborMetric[]>;
  getLaborMetric(id: string): Promise<LaborMetric | null>;
  createLaborMetric(data: Omit<LaborMetric, 'id' | 'createdAt' | 'updatedAt'>): Promise<LaborMetric>;
  updateLaborMetric(id: string, data: Partial<LaborMetric>): Promise<LaborMetric>;
  
  // Employee Sentiment
  getEmployeeSentiment(organizationId: string, employeeId?: string): Promise<EmployeeSentiment[]>;
  createEmployeeSentiment(data: Omit<EmployeeSentiment, 'id' | 'createdAt'>): Promise<EmployeeSentiment>;
}

export interface StaffingForecast {
  departmentId: string;
  departmentName: string;
  forecastDate: string;
  requiredStaffing: number;
  currentStaffing: number;
  gap: number;
  recommendedActions: string[];
}

export interface LaborCostSummary {
  departmentId: string;
  departmentName: string;
  totalHours: number;
  productiveHours: number;
  overtimeHours: number;
  agencyHours: number;
  laborCost: number;
  patientDays: number;
  costPerPatientDay: number;
  hoursPerPatientDay: number;
}
