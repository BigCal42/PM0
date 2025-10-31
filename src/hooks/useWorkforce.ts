import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workforceAdapter } from '@/data/workforceAdapter';
import { useToast } from './useToast';
import type { Department, Employee, Schedule, ScheduleAssignment, LaborMetric, EmployeeSentiment } from '@/data/types';

// Departments
export function useDepartments(organizationId: string) {
  return useQuery({
    queryKey: ['departments', organizationId],
    queryFn: () => workforceAdapter.getDepartments(organizationId),
  });
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: ['department', id],
    queryFn: () => workforceAdapter.getDepartment(id),
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) =>
      workforceAdapter.createDepartment(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['departments', variables.organizationId] });
      toast.success('Department created', 'The department has been created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create department', error.message);
    },
  });
}

// Employees
export function useEmployees(organizationId: string, departmentId?: string) {
  return useQuery({
    queryKey: ['employees', organizationId, departmentId],
    queryFn: () => workforceAdapter.getEmployees(organizationId, departmentId),
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => workforceAdapter.getEmployee(id),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) =>
      workforceAdapter.createEmployee(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees', variables.organizationId] });
      toast.success('Employee created', 'The employee has been created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create employee', error.message);
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) =>
      workforceAdapter.updateEmployee(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees', data.organizationId] });
      queryClient.invalidateQueries({ queryKey: ['employee', data.id] });
      toast.success('Employee updated', 'The employee has been updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update employee', error.message);
    },
  });
}

// Schedules
export function useSchedules(organizationId: string, departmentId?: string) {
  return useQuery({
    queryKey: ['schedules', organizationId, departmentId],
    queryFn: () => workforceAdapter.getSchedules(organizationId, departmentId),
  });
}

export function useSchedule(id: string) {
  return useQuery({
    queryKey: ['schedule', id],
    queryFn: () => workforceAdapter.getSchedule(id),
    enabled: !!id,
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) =>
      workforceAdapter.createSchedule(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['schedules', variables.organizationId] });
      toast.success('Schedule created', 'The schedule has been created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create schedule', error.message);
    },
  });
}

export function usePublishSchedule() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: string) => workforceAdapter.publishSchedule(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['schedules', data.organizationId] });
      queryClient.invalidateQueries({ queryKey: ['schedule', data.id] });
      toast.success('Schedule published', 'The schedule has been published successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to publish schedule', error.message);
    },
  });
}

// Schedule Assignments
export function useScheduleAssignments(scheduleId: string) {
  return useQuery({
    queryKey: ['schedule-assignments', scheduleId],
    queryFn: () => workforceAdapter.getScheduleAssignments(scheduleId),
    enabled: !!scheduleId,
  });
}

export function useCreateScheduleAssignment() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: Omit<ScheduleAssignment, 'id' | 'createdAt'>) =>
      workforceAdapter.createScheduleAssignment(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['schedule-assignments', variables.scheduleId] });
      toast.success('Assignment created', 'The schedule assignment has been created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create assignment', error.message);
    },
  });
}

export function useDeleteScheduleAssignment() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: string) => workforceAdapter.deleteScheduleAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-assignments'] });
      toast.success('Assignment deleted', 'The schedule assignment has been deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete assignment', error.message);
    },
  });
}

// Labor Metrics
export function useLaborMetrics(organizationId: string, departmentId?: string, periodId?: string) {
  return useQuery({
    queryKey: ['labor-metrics', organizationId, departmentId, periodId],
    queryFn: () => workforceAdapter.getLaborMetrics(organizationId, departmentId, periodId),
  });
}

export function useLaborMetric(id: string) {
  return useQuery({
    queryKey: ['labor-metric', id],
    queryFn: () => workforceAdapter.getLaborMetric(id),
    enabled: !!id,
  });
}

export function useCreateLaborMetric() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: Omit<LaborMetric, 'id' | 'createdAt' | 'updatedAt'>) =>
      workforceAdapter.createLaborMetric(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['labor-metrics', variables.organizationId] });
      toast.success('Labor metric created', 'The labor metric has been created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create labor metric', error.message);
    },
  });
}

// Employee Sentiment
export function useEmployeeSentiment(organizationId: string, employeeId?: string) {
  return useQuery({
    queryKey: ['employee-sentiment', organizationId, employeeId],
    queryFn: () => workforceAdapter.getEmployeeSentiment(organizationId, employeeId),
  });
}

export function useCreateEmployeeSentiment() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: Omit<EmployeeSentiment, 'id' | 'createdAt'>) =>
      workforceAdapter.createEmployeeSentiment(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employee-sentiment', variables.organizationId] });
      toast.success('Sentiment recorded', 'The employee sentiment has been recorded successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to record sentiment', error.message);
    },
  });
}
