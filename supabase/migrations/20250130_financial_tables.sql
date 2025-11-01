-- Financial Operations Tables Migration
-- Created: 2025-01-30
-- Purpose: Financial foundation for PM0 Healthcare Finance & Operations platform

-- Financial Periods
CREATE TABLE IF NOT EXISTS financial_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "FY2025-Q1"
  period_type TEXT NOT NULL CHECK (period_type IN ('fiscal_year', 'quarter', 'month')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'locked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Budgets
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL, -- Optional: link to project
  period_id UUID REFERENCES financial_periods(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- department, service_line, cost_center
  category_name TEXT NOT NULL, -- e.g., "ICU", "Cardiology", "IT Department"
  budgeted_amount DECIMAL(15, 2) NOT NULL CHECK (budgeted_amount >= 0),
  actual_amount DECIMAL(15, 2) DEFAULT 0 CHECK (actual_amount >= 0),
  forecasted_amount DECIMAL(15, 2) CHECK (forecasted_amount >= 0),
  variance_percentage DECIMAL(5, 2), -- Computed: (actual - budgeted) / budgeted * 100
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'active', 'closed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Cost Drivers
CREATE TABLE IF NOT EXISTS cost_drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('labor', 'supplies', 'technology', 'facilities', 'other')),
  unit_cost DECIMAL(10, 2),
  volume_metric TEXT, -- patient_days, procedures, visits, etc.
  trend_analysis JSONB DEFAULT '{}', -- Historical cost trends
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Revenue Streams
CREATE TABLE IF NOT EXISTS revenue_streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  service_line TEXT NOT NULL, -- e.g., "Cardiology", "Emergency Department"
  revenue_type TEXT NOT NULL CHECK (revenue_type IN ('fee_for_service', 'value_based', 'capitation', 'other')),
  period_id UUID REFERENCES financial_periods(id) ON DELETE CASCADE,
  projected_revenue DECIMAL(15, 2) DEFAULT 0 CHECK (projected_revenue >= 0),
  actual_revenue DECIMAL(15, 2) DEFAULT 0 CHECK (actual_revenue >= 0),
  collection_rate DECIMAL(5, 2) CHECK (collection_rate >= 0 AND collection_rate <= 100), -- Percentage
  net_revenue DECIMAL(15, 2), -- Computed: actual_revenue * collection_rate / 100
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budget Approvals (workflow tracking)
CREATE TABLE IF NOT EXISTS budget_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  approver_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  comments TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_financial_periods_org ON financial_periods(organization_id);
CREATE INDEX IF NOT EXISTS idx_financial_periods_dates ON financial_periods(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_budgets_org ON budgets(organization_id);
CREATE INDEX IF NOT EXISTS idx_budgets_period ON budgets(period_id);
CREATE INDEX IF NOT EXISTS idx_budgets_project ON budgets(project_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category, category_name);
CREATE INDEX IF NOT EXISTS idx_cost_drivers_org ON cost_drivers(organization_id);
CREATE INDEX IF NOT EXISTS idx_revenue_streams_org ON revenue_streams(organization_id);
CREATE INDEX IF NOT EXISTS idx_revenue_streams_period ON revenue_streams(period_id);
CREATE INDEX IF NOT EXISTS idx_budget_approvals_budget ON budget_approvals(budget_id);

-- Function to calculate variance percentage
CREATE OR REPLACE FUNCTION calculate_budget_variance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.budgeted_amount > 0 THEN
    NEW.variance_percentage := ((NEW.actual_amount - NEW.budgeted_amount) / NEW.budgeted_amount) * 100;
  ELSE
    NEW.variance_percentage := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate variance
CREATE TRIGGER budget_variance_calculator
  BEFORE INSERT OR UPDATE OF actual_amount, budgeted_amount ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION calculate_budget_variance();

-- Function to calculate net revenue
CREATE OR REPLACE FUNCTION calculate_net_revenue()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.collection_rate IS NOT NULL AND NEW.actual_revenue IS NOT NULL THEN
    NEW.net_revenue := NEW.actual_revenue * (NEW.collection_rate / 100.0);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate net revenue
CREATE TRIGGER revenue_net_calculator
  BEFORE INSERT OR UPDATE OF actual_revenue, collection_rate ON revenue_streams
  FOR EACH ROW
  EXECUTE FUNCTION calculate_net_revenue();

-- Updated timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_financial_periods_updated_at
  BEFORE UPDATE ON financial_periods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cost_drivers_updated_at
  BEFORE UPDATE ON cost_drivers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_streams_updated_at
  BEFORE UPDATE ON revenue_streams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
