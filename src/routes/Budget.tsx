import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { useBudgets, useFinancialPeriods, useCreateBudget } from '@/hooks/useBudget';
import { useToast } from '@/hooks/useToast';
import type { Budget } from '@/data/types';

// TODO: Get from auth context when available
const MOCK_ORG_ID = 'org-1';

export function Budget() {
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | undefined>();
  const toast = useToast();
  
  const { data: periods, isLoading: periodsLoading } = useFinancialPeriods(MOCK_ORG_ID);
  const { data: budgets, isLoading: budgetsLoading } = useBudgets(MOCK_ORG_ID, selectedPeriodId);
  const createBudget = useCreateBudget();

  const isLoading = periodsLoading || budgetsLoading;

  // Calculate summary
  const summary = budgets?.reduce(
    (acc, budget) => ({
      totalBudgeted: acc.totalBudgeted + budget.budgetedAmount,
      totalActual: acc.totalActual + budget.actualAmount,
      totalForecasted: acc.totalForecasted + (budget.forecastedAmount || 0),
      count: acc.count + 1,
    }),
    { totalBudgeted: 0, totalActual: 0, totalForecasted: 0, count: 0 }
  ) || { totalBudgeted: 0, totalActual: 0, totalForecasted: 0, count: 0 };

  const variance = summary.totalActual - summary.totalBudgeted;
  const variancePercentage = summary.totalBudgeted > 0 
    ? (variance / summary.totalBudgeted) * 100 
    : 0;

  const handleCreateBudget = async () => {
    if (!selectedPeriodId) {
      toast.warning('Select a period', 'Please select a financial period first.');
      return;
    }

    // TODO: Open budget creation form/modal
    toast.info('Budget creation', 'Budget creation form coming soon!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getVarianceColor = (variance: number, percentage: number) => {
    if (percentage > 5) return 'text-red-400';
    if (percentage < -5) return 'text-green-400';
    return 'text-yellow-400';
  };

  const getStatusColor = (status: Budget['status']) => {
    switch (status) {
      case 'approved':
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending_approval':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'closed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Budget Management
        </h1>
        <p className="text-dark-text-muted text-lg">
          Track and manage your financial budgets
        </p>
      </div>

      {/* Period Selector */}
      <Card title="Financial Period" className="mb-6">
        {periodsLoading ? (
          <Loading message="Loading periods..." />
        ) : (
          <div className="flex gap-4 flex-wrap">
            <select
              value={selectedPeriodId || ''}
              onChange={(e) => setSelectedPeriodId(e.target.value || undefined)}
              className="px-4 py-2 border border-dark-border bg-dark-surface text-dark-text rounded-md"
            >
              <option value="">All Periods</option>
              {periods?.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name} ({period.periodType})
                </option>
              ))}
            </select>
            <Button onClick={handleCreateBudget}>
              + Create Budget
            </Button>
          </div>
        )}
      </Card>

      {/* Budget Summary */}
      {selectedPeriodId && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card title="Total Budgeted">
            <p className="text-2xl font-bold text-blue-400">{formatCurrency(summary.totalBudgeted)}</p>
          </Card>
          <Card title="Total Actual">
            <p className="text-2xl font-bold text-purple-400">{formatCurrency(summary.totalActual)}</p>
          </Card>
          <Card title="Total Forecasted">
            <p className="text-2xl font-bold text-green-400">{formatCurrency(summary.totalForecasted)}</p>
          </Card>
          <Card title="Variance">
            <p className={`text-2xl font-bold ${getVarianceColor(variance, variancePercentage)}`}>
              {formatCurrency(variance)}
            </p>
            <p className={`text-sm mt-1 ${getVarianceColor(variance, variancePercentage)}`}>
              {variancePercentage.toFixed(1)}%
            </p>
          </Card>
        </div>
      )}

      {/* Budget List */}
      <Card title={selectedPeriodId ? "Budgets" : "Select a period to view budgets"}>
        {isLoading ? (
          <Loading message="Loading budgets..." />
        ) : budgets && budgets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-dark-text-muted font-medium">Category</th>
                  <th className="text-right py-3 px-4 text-dark-text-muted font-medium">Budgeted</th>
                  <th className="text-right py-3 px-4 text-dark-text-muted font-medium">Actual</th>
                  <th className="text-right py-3 px-4 text-dark-text-muted font-medium">Forecasted</th>
                  <th className="text-right py-3 px-4 text-dark-text-muted font-medium">Variance</th>
                  <th className="text-center py-3 px-4 text-dark-text-muted font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((budget) => {
                  const budgetVariance = budget.actualAmount - budget.budgetedAmount;
                  const budgetVariancePercentage = budget.variancePercentage || 0;
                  
                  return (
                    <tr key={budget.id} className="border-b border-dark-border hover:bg-dark-surface/50">
                      <td className="py-3 px-4 text-dark-text font-medium">{budget.categoryName}</td>
                      <td className="py-3 px-4 text-right text-dark-text">{formatCurrency(budget.budgetedAmount)}</td>
                      <td className="py-3 px-4 text-right text-dark-text">{formatCurrency(budget.actualAmount)}</td>
                      <td className="py-3 px-4 text-right text-dark-text">
                        {budget.forecastedAmount ? formatCurrency(budget.forecastedAmount) : '-'}
                      </td>
                      <td className={`py-3 px-4 text-right font-medium ${getVarianceColor(budgetVariance, budgetVariancePercentage)}`}>
                        {formatCurrency(budgetVariance)} ({budgetVariancePercentage.toFixed(1)}%)
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(budget.status)}`}>
                          {budget.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-dark-text-muted mb-4">
              {selectedPeriodId ? 'No budgets found for this period.' : 'Select a financial period to view budgets.'}
            </p>
            {selectedPeriodId && (
              <Button onClick={handleCreateBudget}>Create First Budget</Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
