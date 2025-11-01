-- Financial Module Schema for PM0 Healthcare Finance & Operations Platform
-- Phase 1: Financial Resilience & Cost Efficiency

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- COST CENTERS & DEPARTMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS cost_centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  department_type VARCHAR(100), -- e.g., 'Emergency', 'Surgery', 'Cardiology', 'Administration'
  parent_id UUID REFERENCES cost_centers(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, code)
);

-- =============================================
-- BUDGETS
-- =============================================
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL,
  cost_center_id UUID REFERENCES cost_centers(id) ON DELETE CASCADE,
  fiscal_year INTEGER NOT NULL,
  fiscal_period VARCHAR(20) NOT NULL, -- 'Q1', 'Q2', 'Annual', etc.
  budget_type VARCHAR(50) NOT NULL, -- 'Operating', 'Capital', 'Labor', 'Supplies'
  category VARCHAR(100), -- 'Salaries', 'Benefits', 'Medical Supplies', 'Drugs', etc.
  budgeted_amount DECIMAL(15, 2) NOT NULL,
  actual_amount DECIMAL(15, 2) DEFAULT 0,
  variance_amount DECIMAL(15, 2) GENERATED ALWAYS AS (actual_amount - budgeted_amount) STORED,
  variance_percent DECIMAL(8, 2) GENERATED ALWAYS AS (
    CASE 
      WHEN budgeted_amount = 0 THEN 0
      ELSE ((actual_amount - budgeted_amount) / budgeted_amount * 100)
    END
  ) STORED,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'Active', -- 'Draft', 'Active', 'Closed', 'Locked'
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT positive_budget CHECK (budgeted_amount >= 0)
);

CREATE INDEX idx_budgets_org_fiscal ON budgets(org_id, fiscal_year, fiscal_period);
CREATE INDEX idx_budgets_cost_center ON budgets(cost_center_id);

-- =============================================
-- REVENUE CYCLE MANAGEMENT
-- =============================================
CREATE TABLE IF NOT EXISTS revenue_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL,
  transaction_date DATE NOT NULL,
  service_date DATE,
  cost_center_id UUID REFERENCES cost_centers(id),
  transaction_type VARCHAR(50) NOT NULL, -- 'Charge', 'Payment', 'Adjustment', 'Denial'
  service_code VARCHAR(50), -- CPT/HCPCS codes
  drg_code VARCHAR(20), -- DRG code for inpatient
  payer_type VARCHAR(100), -- 'Medicare', 'Medicaid', 'Commercial', 'Self-Pay'
  payer_name VARCHAR(255),
  gross_charge DECIMAL(15, 2),
  contractual_adjustment DECIMAL(15, 2) DEFAULT 0,
  payment_amount DECIMAL(15, 2) DEFAULT 0,
  denial_amount DECIMAL(15, 2) DEFAULT 0,
  denial_reason VARCHAR(255),
  net_revenue DECIMAL(15, 2) GENERATED ALWAYS AS (
    gross_charge - COALESCE(contractual_adjustment, 0) - COALESCE(denial_amount, 0)
  ) STORED,
  collection_rate DECIMAL(8, 2),
  days_to_payment INTEGER,
  claim_status VARCHAR(50), -- 'Submitted', 'Pending', 'Paid', 'Denied', 'Appealed'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_revenue_org_date ON revenue_transactions(org_id, transaction_date);
CREATE INDEX idx_revenue_payer ON revenue_transactions(payer_type);
CREATE INDEX idx_revenue_status ON revenue_transactions(claim_status);

-- =============================================
-- SERVICE LINE PROFITABILITY
-- =============================================
CREATE TABLE IF NOT EXISTS service_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  service_category VARCHAR(100), -- 'Surgical', 'Medical', 'Diagnostic', 'Therapeutic'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, name)
);

CREATE TABLE IF NOT EXISTS service_line_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_line_id UUID REFERENCES service_lines(id) ON DELETE CASCADE,
  fiscal_year INTEGER NOT NULL,
  fiscal_period VARCHAR(20) NOT NULL,
  volume INTEGER, -- Number of cases/procedures
  gross_revenue DECIMAL(15, 2),
  net_revenue DECIMAL(15, 2),
  direct_costs DECIMAL(15, 2), -- Labor, supplies, drugs directly attributed
  indirect_costs DECIMAL(15, 2), -- Overhead allocation
  total_costs DECIMAL(15, 2) GENERATED ALWAYS AS (
    COALESCE(direct_costs, 0) + COALESCE(indirect_costs, 0)
  ) STORED,
  contribution_margin DECIMAL(15, 2) GENERATED ALWAYS AS (
    COALESCE(net_revenue, 0) - (COALESCE(direct_costs, 0) + COALESCE(indirect_costs, 0))
  ) STORED,
  margin_percentage DECIMAL(8, 2) GENERATED ALWAYS AS (
    CASE 
      WHEN net_revenue = 0 THEN 0
      ELSE ((COALESCE(net_revenue, 0) - (COALESCE(direct_costs, 0) + COALESCE(indirect_costs, 0))) / net_revenue * 100)
    END
  ) STORED,
  cost_per_case DECIMAL(12, 2) GENERATED ALWAYS AS (
    CASE 
      WHEN volume = 0 THEN 0
      ELSE (COALESCE(direct_costs, 0) + COALESCE(indirect_costs, 0)) / volume
    END
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(service_line_id, fiscal_year, fiscal_period)
);

CREATE INDEX idx_service_metrics_fiscal ON service_line_metrics(fiscal_year, fiscal_period);

-- =============================================
-- INITIATIVE ROI TRACKING
-- =============================================
CREATE TABLE IF NOT EXISTS initiatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- 'Cost Reduction', 'Revenue Enhancement', 'Quality Improvement', 'Technology'
  status VARCHAR(50) DEFAULT 'Planning', -- 'Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'
  start_date DATE,
  target_completion_date DATE,
  actual_completion_date DATE,
  owner_id UUID,
  cost_center_id UUID REFERENCES cost_centers(id),
  estimated_investment DECIMAL(15, 2),
  actual_investment DECIMAL(15, 2) DEFAULT 0,
  estimated_annual_savings DECIMAL(15, 2),
  actual_annual_savings DECIMAL(15, 2) DEFAULT 0,
  estimated_roi_percent DECIMAL(8, 2),
  actual_roi_percent DECIMAL(8, 2),
  payback_period_months INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_initiatives_org_status ON initiatives(org_id, status);

-- =============================================
-- FINANCIAL ALERTS & ANOMALIES
-- =============================================
CREATE TABLE IF NOT EXISTS financial_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL,
  alert_type VARCHAR(100) NOT NULL, -- 'Budget Variance', 'Revenue Drop', 'Cost Spike', 'Denial Rate'
  severity VARCHAR(20) NOT NULL, -- 'Low', 'Medium', 'High', 'Critical'
  entity_type VARCHAR(50), -- 'Budget', 'Cost Center', 'Service Line'
  entity_id UUID,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  threshold_value DECIMAL(15, 2),
  actual_value DECIMAL(15, 2),
  variance_percent DECIMAL(8, 2),
  status VARCHAR(50) DEFAULT 'New', -- 'New', 'Acknowledged', 'Investigating', 'Resolved', 'Dismissed'
  acknowledged_by UUID,
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_org_status ON financial_alerts(org_id, status);
CREATE INDEX idx_alerts_severity ON financial_alerts(severity);

-- =============================================
-- VIEWS FOR ANALYTICS
-- =============================================

-- Budget Performance Summary
CREATE OR REPLACE VIEW budget_performance_summary AS
SELECT 
  b.org_id,
  b.fiscal_year,
  b.fiscal_period,
  cc.name as cost_center_name,
  b.budget_type,
  b.category,
  b.budgeted_amount,
  b.actual_amount,
  b.variance_amount,
  b.variance_percent,
  CASE 
    WHEN ABS(b.variance_percent) < 5 THEN 'On Track'
    WHEN b.variance_percent < -5 THEN 'Under Budget'
    ELSE 'Over Budget'
  END as status,
  b.updated_at
FROM budgets b
LEFT JOIN cost_centers cc ON b.cost_center_id = cc.id
WHERE b.status = 'Active';

-- Revenue Cycle KPIs
CREATE OR REPLACE VIEW revenue_cycle_kpis AS
SELECT 
  org_id,
  DATE_TRUNC('month', transaction_date) as month,
  payer_type,
  COUNT(*) as transaction_count,
  SUM(gross_charge) as total_gross_charge,
  SUM(net_revenue) as total_net_revenue,
  SUM(denial_amount) as total_denials,
  CASE 
    WHEN SUM(gross_charge) = 0 THEN 0
    ELSE (SUM(denial_amount) / SUM(gross_charge) * 100)
  END as denial_rate,
  CASE 
    WHEN SUM(gross_charge) = 0 THEN 0
    ELSE (SUM(payment_amount) / SUM(gross_charge) * 100)
  END as collection_rate,
  AVG(days_to_payment) as avg_days_to_payment
FROM revenue_transactions
WHERE transaction_date >= DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '1 year'
GROUP BY org_id, DATE_TRUNC('month', transaction_date), payer_type;

-- Service Line Profitability Summary
CREATE OR REPLACE VIEW service_line_profitability AS
SELECT 
  sl.org_id,
  sl.name as service_line,
  sl.service_category,
  slm.fiscal_year,
  slm.fiscal_period,
  slm.volume,
  slm.net_revenue,
  slm.total_costs,
  slm.contribution_margin,
  slm.margin_percentage,
  slm.cost_per_case,
  CASE 
    WHEN slm.margin_percentage >= 20 THEN 'High Profit'
    WHEN slm.margin_percentage >= 10 THEN 'Profitable'
    WHEN slm.margin_percentage >= 0 THEN 'Break Even'
    ELSE 'Loss'
  END as profitability_status
FROM service_lines sl
JOIN service_line_metrics slm ON sl.id = slm.service_line_id
WHERE sl.is_active = true;

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to calculate budget variance alerts
CREATE OR REPLACE FUNCTION check_budget_variance()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if variance exceeds 10% threshold
  IF ABS(NEW.variance_percent) > 10 THEN
    INSERT INTO financial_alerts (
      org_id,
      alert_type,
      severity,
      entity_type,
      entity_id,
      title,
      message,
      threshold_value,
      actual_value,
      variance_percent
    )
    VALUES (
      NEW.org_id,
      'Budget Variance',
      CASE 
        WHEN ABS(NEW.variance_percent) > 25 THEN 'Critical'
        WHEN ABS(NEW.variance_percent) > 15 THEN 'High'
        ELSE 'Medium'
      END,
      'Budget',
      NEW.id,
      'Budget Variance Alert',
      format('Budget for %s has %s variance of %s%%',
        NEW.category,
        CASE WHEN NEW.variance_percent > 0 THEN 'over' ELSE 'under' END,
        ABS(NEW.variance_percent)::TEXT
      ),
      NEW.budgeted_amount,
      NEW.actual_amount,
      NEW.variance_percent
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for budget variance alerts
CREATE TRIGGER budget_variance_alert_trigger
AFTER UPDATE OF actual_amount ON budgets
FOR EACH ROW
WHEN (NEW.actual_amount IS DISTINCT FROM OLD.actual_amount)
EXECUTE FUNCTION check_budget_variance();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update timestamp triggers to all tables
CREATE TRIGGER update_cost_centers_updated_at BEFORE UPDATE ON cost_centers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_transactions_updated_at BEFORE UPDATE ON revenue_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_lines_updated_at BEFORE UPDATE ON service_lines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_line_metrics_updated_at BEFORE UPDATE ON service_line_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_initiatives_updated_at BEFORE UPDATE ON initiatives
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (Enable when org_id properly set up)
-- =============================================
-- TODO: Enable RLS policies based on org_id and user roles
-- ALTER TABLE cost_centers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
-- etc.

COMMENT ON TABLE cost_centers IS 'Organizational cost centers and departments for budget allocation';
COMMENT ON TABLE budgets IS 'Budget tracking with variance analysis for financial planning';
COMMENT ON TABLE revenue_transactions IS 'Revenue cycle management transactions for tracking claims and payments';
COMMENT ON TABLE service_lines IS 'Service line definitions for profitability analysis';
COMMENT ON TABLE service_line_metrics IS 'Service line performance metrics including cost per case and margins';
COMMENT ON TABLE initiatives IS 'Strategic initiatives with ROI tracking';
COMMENT ON TABLE financial_alerts IS 'Automated alerts for budget variances and financial anomalies';

