import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financialAdapter } from '@/data/financialAdapter';
import { useToast } from './useToast';
import type { Budget, FinancialPeriod, CostDriver, RevenueStream } from '@/data/types';

// Financial Periods
export function useFinancialPeriods(organizationId: string) {
  return useQuery({
    queryKey: ['financial-periods', organizationId],
    queryFn: () => financialAdapter.getFinancialPeriods(organizationId),
  });
}

export function useFinancialPeriod(id: string) {
  return useQuery({
    queryKey: ['financial-period', id],
    queryFn: () => financialAdapter.getFinancialPeriod(id),
    enabled: !!id,
  });
}

export function useCreateFinancialPeriod() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: Omit<FinancialPeriod, 'id' | 'createdAt' | 'updatedAt'>) =>
      financialAdapter.createFinancialPeriod(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['financial-periods', variables.organizationId] });
      toast.success('Financial period created', 'The financial period has been created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create financial period', error.message);
    },
  });
}

// Budgets
export function useBudgets(organizationId: string, periodId?: string) {
  return useQuery({
    queryKey: ['budgets', organizationId, periodId],
    queryFn: () => financialAdapter.getBudgets(organizationId, periodId),
  });
}

export function useBudget(id: string) {
  return useQuery({
    queryKey: ['budget', id],
    queryFn: () => financialAdapter.getBudget(id),
    enabled: !!id,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) =>
      financialAdapter.createBudget(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['budgets', variables.organizationId] });
      toast.success('Budget created', 'The budget has been created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create budget', error.message);
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Budget> }) =>
      financialAdapter.updateBudget(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['budgets', data.organizationId] });
      queryClient.invalidateQueries({ queryKey: ['budget', data.id] });
      toast.success('Budget updated', 'The budget has been updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update budget', error.message);
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: string) => financialAdapter.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget deleted', 'The budget has been deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete budget', error.message);
    },
  });
}

// Cost Drivers
export function useCostDrivers(organizationId: string) {
  return useQuery({
    queryKey: ['cost-drivers', organizationId],
    queryFn: () => financialAdapter.getCostDrivers(organizationId),
  });
}

export function useCostDriver(id: string) {
  return useQuery({
    queryKey: ['cost-driver', id],
    queryFn: () => financialAdapter.getCostDriver(id),
    enabled: !!id,
  });
}

export function useCreateCostDriver() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: Omit<CostDriver, 'id' | 'createdAt' | 'updatedAt'>) =>
      financialAdapter.createCostDriver(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cost-drivers', variables.organizationId] });
      toast.success('Cost driver created', 'The cost driver has been created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create cost driver', error.message);
    },
  });
}

// Revenue Streams
export function useRevenueStreams(organizationId: string, periodId?: string) {
  return useQuery({
    queryKey: ['revenue-streams', organizationId, periodId],
    queryFn: () => financialAdapter.getRevenueStreams(organizationId, periodId),
  });
}

export function useRevenueStream(id: string) {
  return useQuery({
    queryKey: ['revenue-stream', id],
    queryFn: () => financialAdapter.getRevenueStream(id),
    enabled: !!id,
  });
}

export function useCreateRevenueStream() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: Omit<RevenueStream, 'id' | 'createdAt' | 'updatedAt'>) =>
      financialAdapter.createRevenueStream(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['revenue-streams', variables.organizationId] });
      toast.success('Revenue stream created', 'The revenue stream has been created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create revenue stream', error.message);
    },
  });
}
