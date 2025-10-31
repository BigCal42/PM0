import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financialAdapter } from '@/data/financialAdapter';
import type { Budget, FinancialPeriod } from '@/data/types';
import { useToast } from './useToast';

/**
 * React Query hook for financial periods
 */
export function useFinancialPeriods(organizationId: string) {
  return useQuery<FinancialPeriod[]>({
    queryKey: ['financialPeriods', organizationId],
    queryFn: async () => {
      return await financialAdapter.getFinancialPeriods(organizationId);
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * React Query hook for budgets
 */
export function useBudgets(organizationId: string, periodId?: string) {
  return useQuery<Budget[]>({
    queryKey: ['budgets', organizationId, periodId],
    queryFn: async () => {
      return await financialAdapter.getBudgets(organizationId, periodId);
    },
    enabled: !!organizationId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * React Query hook for a single budget
 */
export function useBudget(id: string) {
  return useQuery<Budget | null>({
    queryKey: ['budget', id],
    queryFn: async () => {
      return await financialAdapter.getBudget(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * React Query mutation for creating a budget
 */
export function useCreateBudget() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (data: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
      return await financialAdapter.createBudget(data);
    },
    onSuccess: (budget) => {
      queryClient.invalidateQueries({ queryKey: ['budgets', budget.organizationId] });
      toast.success('Budget created', `Budget for ${budget.categoryName} has been created.`);
    },
    onError: (error) => {
      toast.error('Failed to create budget', error instanceof Error ? error.message : 'Unknown error');
    },
  });
}

/**
 * React Query mutation for updating a budget
 */
export function useUpdateBudget() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Budget> }) => {
      return await financialAdapter.updateBudget(id, data);
    },
    onSuccess: (budget) => {
      queryClient.invalidateQueries({ queryKey: ['budget', budget.id] });
      queryClient.invalidateQueries({ queryKey: ['budgets', budget.organizationId] });
      toast.success('Budget updated', `Budget for ${budget.categoryName} has been updated.`);
    },
    onError: (error) => {
      toast.error('Failed to update budget', error instanceof Error ? error.message : 'Unknown error');
    },
  });
}

/**
 * React Query mutation for deleting a budget
 */
export function useDeleteBudget() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ id, organizationId }: { id: string; organizationId: string }) => {
      await financialAdapter.deleteBudget(id);
      return { id, organizationId };
    },
    onSuccess: ({ organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ['budgets', organizationId] });
      toast.success('Budget deleted', 'The budget has been deleted.');
    },
    onError: (error) => {
      toast.error('Failed to delete budget', error instanceof Error ? error.message : 'Unknown error');
    },
  });
}
