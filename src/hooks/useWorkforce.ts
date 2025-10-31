import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workforceAdapter } from '@/data/workforceAdapter';
import type { Department, Employee, Schedule, ScheduleAssignment } from '@/data/types';
import { useToast } from './useToast';

/**
 * React Query hook for departments
 */
export function useDepartments(organizationId: string) {
  return useQuery<Department[]>({
    queryKey: ['departments', organizationId],
    queryFn: async () => {
      return await workforceAdapter.getDepartments(organizationId);
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * React Query hook for employees
 */
export function useEmployees(organizationId: string, departmentId?: string) {
  return useQuery<Employee[]>({
    queryKey: ['employees', organizationId, departmentId],
    queryFn: async () => {
      return await workforceAdapter.getEmployees(organizationId, departmentId);
    },
    enabled: !!organizationId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * React Query hook for schedules
 */
export function useSchedules(organizationId: string, departmentId?: string) {
  return useQuery<Schedule[]>({
    queryKey: ['schedules', organizationId, departmentId],
    queryFn: async () => {
      return await workforceAdapter.getSchedules(organizationId, departmentId);
    },
    enabled: !!organizationId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * React Query hook for schedule assignments
 */
export function useScheduleAssignments(scheduleId: string) {
  return useQuery<ScheduleAssignment[]>({
    queryKey: ['scheduleAssignments', scheduleId],
    queryFn: async () => {
      return await workforceAdapter.getScheduleAssignments(scheduleId);
    },
    enabled: !!scheduleId,
    staleTime: 1 * 60 * 1000, // 1 minute (more frequent updates for schedules)
  });
}

/**
 * React Query mutation for creating a schedule
 */
export function useCreateSchedule() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (data: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => {
      return await workforceAdapter.createSchedule(data);
    },
    onSuccess: (schedule) => {
      queryClient.invalidateQueries({ queryKey: ['schedules', schedule.organizationId] });
      toast.success('Schedule created', 'New schedule has been created.');
    },
    onError: (error) => {
      toast.error('Failed to create schedule', error instanceof Error ? error.message : 'Unknown error');
    },
  });
}

/**
 * React Query mutation for creating a schedule assignment
 */
export function useCreateScheduleAssignment() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (data: Omit<ScheduleAssignment, 'id' | 'createdAt'>) => {
      return await workforceAdapter.createScheduleAssignment(data);
    },
    onSuccess: (assignment) => {
      queryClient.invalidateQueries({ queryKey: ['scheduleAssignments', assignment.scheduleId] });
      toast.success('Shift assigned', 'Employee has been assigned to the shift.');
    },
    onError: (error) => {
      toast.error('Failed to assign shift', error instanceof Error ? error.message : 'Unknown error');
    },
  });
}
