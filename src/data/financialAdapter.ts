import type { FinancialAdapter, FinancialPeriod, Budget, CostDriver, RevenueStream } from './financialTypes';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { logger } from '@/lib/logger';

/**
 * Supabase financial data adapter
 */
export const financialAdapter: FinancialAdapter = {
  // Financial Periods
  async getFinancialPeriods(organizationId: string): Promise<FinancialPeriod[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await supabase
      .from('financial_periods')
      .select('*')
      .eq('organization_id', organizationId)
      .order('start_date', { ascending: false });

    if (error) {
      logger.error('Failed to fetch financial periods:', error);
      throw error;
    }

    return (data?.map((row) => ({
      id: row.id,
      organizationId: row.organization_id,
      name: row.name,
      periodType: row.period_type,
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })) || []) as FinancialPeriod[];
  },

  async getFinancialPeriod(id: string): Promise<FinancialPeriod | null> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await supabase
      .from('financial_periods')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      logger.error('Failed to fetch financial period:', error);
      throw error;
    }

    return {
      id: data.id,
      organizationId: data.organization_id,
      name: data.name,
      periodType: data.period_type,
      startDate: data.start_date,
      endDate: data.end_date,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async createFinancialPeriod(data: Omit<FinancialPeriod, 'id' | 'createdAt' | 'updatedAt'>): Promise<FinancialPeriod> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data: result, error } = await supabase
      .from('financial_periods')
      .insert({
        organization_id: data.organizationId,
        name: data.name,
        period_type: data.periodType,
        start_date: data.startDate,
        end_date: data.endDate,
        status: data.status,
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create financial period:', error);
      throw error;
    }

    return {
      id: result.id,
      organizationId: result.organization_id,
      name: result.name,
      periodType: result.period_type,
      startDate: result.start_date,
      endDate: result.end_date,
      status: result.status,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  },

  async updateFinancialPeriod(id: string, data: Partial<FinancialPeriod>): Promise<FinancialPeriod> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.periodType !== undefined) updateData.period_type = data.periodType;
    if (data.startDate !== undefined) updateData.start_date = data.startDate;
    if (data.endDate !== undefined) updateData.end_date = data.endDate;
    if (data.status !== undefined) updateData.status = data.status;

    const { data: result, error } = await supabase
      .from('financial_periods')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update financial period:', error);
      throw error;
    }

    return {
      id: result.id,
      organizationId: result.organization_id,
      name: result.name,
      periodType: result.period_type,
      startDate: result.start_date,
      endDate: result.end_date,
      status: result.status,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  },

  // Budgets
  async getBudgets(organizationId: string, periodId?: string): Promise<Budget[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    let query = supabase
      .from('budgets')
      .select('*')
      .eq('organization_id', organizationId);

    if (periodId) {
      query = query.eq('period_id', periodId);
    }

    const { data, error } = await query.order('category_name', { ascending: true });

    if (error) {
      logger.error('Failed to fetch budgets:', error);
      throw error;
    }

    return (data?.map((row) => ({
      id: row.id,
      organizationId: row.organization_id,
      projectId: row.project_id,
      periodId: row.period_id,
      category: row.category,
      categoryName: row.category_name,
      budgetedAmount: parseFloat(row.budgeted_amount) || 0,
      actualAmount: parseFloat(row.actual_amount) || 0,
      forecastedAmount: row.forecasted_amount ? parseFloat(row.forecasted_amount) : undefined,
      variancePercentage: row.variance_percentage ? parseFloat(row.variance_percentage) : undefined,
      status: row.status,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
    })) || []) as Budget[];
  },

  async getBudget(id: string): Promise<Budget | null> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      logger.error('Failed to fetch budget:', error);
      throw error;
    }

    return {
      id: data.id,
      organizationId: data.organization_id,
      projectId: data.project_id,
      periodId: data.period_id,
      category: data.category,
      categoryName: data.category_name,
      budgetedAmount: parseFloat(data.budgeted_amount) || 0,
      actualAmount: parseFloat(data.actual_amount) || 0,
      forecastedAmount: data.forecasted_amount ? parseFloat(data.forecasted_amount) : undefined,
      variancePercentage: data.variance_percentage ? parseFloat(data.variance_percentage) : undefined,
      status: data.status,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdBy: data.created_by,
    };
  },

  async createBudget(data: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data: result, error } = await supabase
      .from('budgets')
      .insert({
        organization_id: data.organizationId,
        project_id: data.projectId,
        period_id: data.periodId,
        category: data.category,
        category_name: data.categoryName,
        budgeted_amount: data.budgetedAmount,
        actual_amount: data.actualAmount,
        forecasted_amount: data.forecastedAmount,
        status: data.status,
        notes: data.notes,
        created_by: data.createdBy,
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create budget:', error);
      throw error;
    }

    return {
      id: result.id,
      organizationId: result.organization_id,
      projectId: result.project_id,
      periodId: result.period_id,
      category: result.category,
      categoryName: result.category_name,
      budgetedAmount: parseFloat(result.budgeted_amount) || 0,
      actualAmount: parseFloat(result.actual_amount) || 0,
      forecastedAmount: result.forecasted_amount ? parseFloat(result.forecasted_amount) : undefined,
      variancePercentage: result.variance_percentage ? parseFloat(result.variance_percentage) : undefined,
      status: result.status,
      notes: result.notes,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      createdBy: result.created_by,
    };
  },

  async updateBudget(id: string, data: Partial<Budget>): Promise<Budget> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const updateData: Record<string, unknown> = {};
    if (data.projectId !== undefined) updateData.project_id = data.projectId;
    if (data.periodId !== undefined) updateData.period_id = data.periodId;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.categoryName !== undefined) updateData.category_name = data.categoryName;
    if (data.budgetedAmount !== undefined) updateData.budgeted_amount = data.budgetedAmount;
    if (data.actualAmount !== undefined) updateData.actual_amount = data.actualAmount;
    if (data.forecastedAmount !== undefined) updateData.forecasted_amount = data.forecastedAmount;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const { data: result, error } = await supabase
      .from('budgets')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update budget:', error);
      throw error;
    }

    return {
      id: result.id,
      organizationId: result.organization_id,
      projectId: result.project_id,
      periodId: result.period_id,
      category: result.category,
      categoryName: result.category_name,
      budgetedAmount: parseFloat(result.budgeted_amount) || 0,
      actualAmount: parseFloat(result.actual_amount) || 0,
      forecastedAmount: result.forecasted_amount ? parseFloat(result.forecasted_amount) : undefined,
      variancePercentage: result.variance_percentage ? parseFloat(result.variance_percentage) : undefined,
      status: result.status,
      notes: result.notes,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      createdBy: result.created_by,
    };
  },

  async deleteBudget(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) {
      logger.error('Failed to delete budget:', error);
      throw error;
    }
  },

  // Cost Drivers
  async getCostDrivers(organizationId: string): Promise<CostDriver[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await supabase
      .from('cost_drivers')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      logger.error('Failed to fetch cost drivers:', error);
      throw error;
    }

    return (data?.map((row) => ({
      id: row.id,
      organizationId: row.organization_id,
      name: row.name,
      category: row.category,
      unitCost: row.unit_cost ? parseFloat(row.unit_cost) : undefined,
      volumeMetric: row.volume_metric,
      trendAnalysis: row.trend_analysis,
      description: row.description,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })) || []) as CostDriver[];
  },

  async getCostDriver(id: string): Promise<CostDriver | null> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await supabase
      .from('cost_drivers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      logger.error('Failed to fetch cost driver:', error);
      throw error;
    }

    return {
      id: data.id,
      organizationId: data.organization_id,
      name: data.name,
      category: data.category,
      unitCost: data.unit_cost ? parseFloat(data.unit_cost) : undefined,
      volumeMetric: data.volume_metric,
      trendAnalysis: data.trend_analysis,
      description: data.description,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async createCostDriver(data: Omit<CostDriver, 'id' | 'createdAt' | 'updatedAt'>): Promise<CostDriver> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data: result, error } = await supabase
      .from('cost_drivers')
      .insert({
        organization_id: data.organizationId,
        name: data.name,
        category: data.category,
        unit_cost: data.unitCost,
        volume_metric: data.volumeMetric,
        trend_analysis: data.trendAnalysis || {},
        description: data.description,
        is_active: data.isActive,
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create cost driver:', error);
      throw error;
    }

    return {
      id: result.id,
      organizationId: result.organization_id,
      name: result.name,
      category: result.category,
      unitCost: result.unit_cost ? parseFloat(result.unit_cost) : undefined,
      volumeMetric: result.volume_metric,
      trendAnalysis: result.trend_analysis,
      description: result.description,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  },

  async updateCostDriver(id: string, data: Partial<CostDriver>): Promise<CostDriver> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.unitCost !== undefined) updateData.unit_cost = data.unitCost;
    if (data.volumeMetric !== undefined) updateData.volume_metric = data.volumeMetric;
    if (data.trendAnalysis !== undefined) updateData.trend_analysis = data.trendAnalysis;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isActive !== undefined) updateData.is_active = data.isActive;

    const { data: result, error } = await supabase
      .from('cost_drivers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update cost driver:', error);
      throw error;
    }

    return {
      id: result.id,
      organizationId: result.organization_id,
      name: result.name,
      category: result.category,
      unitCost: result.unit_cost ? parseFloat(result.unit_cost) : undefined,
      volumeMetric: result.volume_metric,
      trendAnalysis: result.trend_analysis,
      description: result.description,
      isActive: result.is_active,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  },

  // Revenue Streams
  async getRevenueStreams(organizationId: string, periodId?: string): Promise<RevenueStream[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    let query = supabase
      .from('revenue_streams')
      .select('*')
      .eq('organization_id', organizationId);

    if (periodId) {
      query = query.eq('period_id', periodId);
    }

    const { data, error } = await query.order('service_line', { ascending: true });

    if (error) {
      logger.error('Failed to fetch revenue streams:', error);
      throw error;
    }

    return (data?.map((row) => ({
      id: row.id,
      organizationId: row.organization_id,
      serviceLine: row.service_line,
      revenueType: row.revenue_type,
      periodId: row.period_id,
      projectedRevenue: parseFloat(row.projected_revenue) || 0,
      actualRevenue: parseFloat(row.actual_revenue) || 0,
      collectionRate: row.collection_rate ? parseFloat(row.collection_rate) : undefined,
      netRevenue: row.net_revenue ? parseFloat(row.net_revenue) : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })) || []) as RevenueStream[];
  },

  async getRevenueStream(id: string): Promise<RevenueStream | null> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data, error } = await supabase
      .from('revenue_streams')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      logger.error('Failed to fetch revenue stream:', error);
      throw error;
    }

    return {
      id: data.id,
      organizationId: data.organization_id,
      serviceLine: data.service_line,
      revenueType: data.revenue_type,
      periodId: data.period_id,
      projectedRevenue: parseFloat(data.projected_revenue) || 0,
      actualRevenue: parseFloat(data.actual_revenue) || 0,
      collectionRate: data.collection_rate ? parseFloat(data.collection_rate) : undefined,
      netRevenue: data.net_revenue ? parseFloat(data.net_revenue) : undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async createRevenueStream(data: Omit<RevenueStream, 'id' | 'createdAt' | 'updatedAt'>): Promise<RevenueStream> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const { data: result, error } = await supabase
      .from('revenue_streams')
      .insert({
        organization_id: data.organizationId,
        service_line: data.serviceLine,
        revenue_type: data.revenueType,
        period_id: data.periodId,
        projected_revenue: data.projectedRevenue,
        actual_revenue: data.actualRevenue,
        collection_rate: data.collectionRate,
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to create revenue stream:', error);
      throw error;
    }

    return {
      id: result.id,
      organizationId: result.organization_id,
      serviceLine: result.service_line,
      revenueType: result.revenue_type,
      periodId: result.period_id,
      projectedRevenue: parseFloat(result.projected_revenue) || 0,
      actualRevenue: parseFloat(result.actual_revenue) || 0,
      collectionRate: result.collection_rate ? parseFloat(result.collection_rate) : undefined,
      netRevenue: result.net_revenue ? parseFloat(result.net_revenue) : undefined,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  },

  async updateRevenueStream(id: string, data: Partial<RevenueStream>): Promise<RevenueStream> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    const updateData: Record<string, unknown> = {};
    if (data.serviceLine !== undefined) updateData.service_line = data.serviceLine;
    if (data.revenueType !== undefined) updateData.revenue_type = data.revenueType;
    if (data.periodId !== undefined) updateData.period_id = data.periodId;
    if (data.projectedRevenue !== undefined) updateData.projected_revenue = data.projectedRevenue;
    if (data.actualRevenue !== undefined) updateData.actual_revenue = data.actualRevenue;
    if (data.collectionRate !== undefined) updateData.collection_rate = data.collectionRate;

    const { data: result, error } = await supabase
      .from('revenue_streams')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('Failed to update revenue stream:', error);
      throw error;
    }

    return {
      id: result.id,
      organizationId: result.organization_id,
      serviceLine: result.service_line,
      revenueType: result.revenue_type,
      periodId: result.period_id,
      projectedRevenue: parseFloat(result.projected_revenue) || 0,
      actualRevenue: parseFloat(result.actual_revenue) || 0,
      collectionRate: result.collection_rate ? parseFloat(result.collection_rate) : undefined,
      netRevenue: result.net_revenue ? parseFloat(result.net_revenue) : undefined,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };
  },
};
