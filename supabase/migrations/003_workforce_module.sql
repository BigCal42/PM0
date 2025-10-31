-- Workforce Module Schema for PM0 Healthcare Finance & Operations Platform
-- Phase 1: Workforce Optimization & Engagement

-- =============================================
-- EMPLOYEES & STAFF
-- =============================================
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL,
  employee_id VARCHAR(50) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  cost_center_id UUID REFERENCES cost_centers(id),
  job_title VARCHAR(255),
  job_category VARCHAR(100), -- 'Nurse', 'Physician', 'Tech', 'Admin', 'Support'
  employee_type VARCHAR(50), -- 'Full-Time', 'Part-Time', 'PRN', 'Contract', 'Agency'
  hire_date DATE,
  termination_date DATE,
  is_active BOOLEAN DEFAULT true,
  fte DECIMAL(4, 2) DEFAULT 1.0, -- Full-Time Equivalent (0.5 = 50%, 1.0 = 100%)
  base_hourly_rate DECIMAL(8, 2),
  overtime_rate DECIMAL(8, 2),
  shift_differential DECIMAL(8, 2),
  credentials JSONB, -- Certifications, licenses
  skills JSONB, -- Skills and competencies
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, employee_id),
  CONSTRAINT valid_fte CHECK (fte >= 0 AND fte <= 2.0)
);

CREATE INDEX idx_employees_org_active ON employees(org_id, is_active);
CREATE INDEX idx_employees_cost_center ON employees(cost_center_id);
CREATE INDEX idx_employees_job_category ON employees(job_category);

-- =============================================
-- SCHEDULING & SHIFTS
-- =============================================
CREATE TABLE IF NOT EXISTS shift_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  shift_type VARCHAR(50), -- 'Day', 'Evening', 'Night', 'Rotating'
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_hours DECIMAL(4, 2),
  break_minutes INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  cost_center_id UUID REFERENCES cost_centers(id),
  shift_template_id UUID REFERENCES shift_templates(id),
  schedule_date DATE NOT NULL,
  shift_start TIMESTAMPTZ NOT NULL,
  shift_end TIMESTAMPTZ NOT NULL,
  scheduled_hours DECIMAL(6, 2),
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  actual_hours DECIMAL(6, 2),
  break_minutes INTEGER,
  is_overtime BOOLEAN DEFAULT false,
  is_holiday BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'Scheduled', -- 'Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_schedules_employee_date ON schedules(employee_id, schedule_date);
CREATE INDEX idx_schedules_cost_center_date ON schedules(cost_center_id, schedule_date);
CREATE INDEX idx_schedules_status ON schedules(status);

-- =============================================
-- LABOR COSTS & PAYROLL
-- =============================================
CREATE TABLE IF NOT EXISTS labor_costs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  cost_center_id UUID REFERENCES cost_centers(id),
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  regular_hours DECIMAL(8, 2) DEFAULT 0,
  overtime_hours DECIMAL(8, 2) DEFAULT 0,
  pto_hours DECIMAL(8, 2) DEFAULT 0,
  regular_pay DECIMAL(12, 2),
  overtime_pay DECIMAL(12, 2),
  shift_differential_pay DECIMAL(12, 2),
  bonus_pay DECIMAL(12, 2) DEFAULT 0,
  total_gross_pay DECIMAL(12, 2) GENERATED ALWAYS AS (
    COALESCE(regular_pay, 0) + COALESCE(overtime_pay, 0) + 
    COALESCE(shift_differential_pay, 0) + COALESCE(bonus_pay, 0)
  ) STORED,
  benefits_cost DECIMAL(12, 2) DEFAULT 0,
  taxes_cost DECIMAL(12, 2) DEFAULT 0,
  total_labor_cost DECIMAL(12, 2) GENERATED ALWAYS AS (
    COALESCE(regular_pay, 0) + COALESCE(overtime_pay, 0) + 
    COALESCE(shift_differential_pay, 0) + COALESCE(bonus_pay, 0) +
    COALESCE(benefits_cost, 0) + COALESCE(taxes_cost, 0)
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, pay_period_start, pay_period_end)
);

CREATE INDEX idx_labor_costs_org_period ON labor_costs(org_id, pay_period_start, pay_period_end);
CREATE INDEX idx_labor_costs_cost_center ON labor_costs(cost_center_id);

-- =============================================
-- PRODUCTIVITY METRICS
-- =============================================
CREATE TABLE IF NOT EXISTS productivity_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL,
  cost_center_id UUID REFERENCES cost_centers(id),
  metric_date DATE NOT NULL,
  metric_period VARCHAR(20), -- 'Daily', 'Weekly', 'Monthly'
  patient_days INTEGER, -- Census/patient days
  worked_hours DECIMAL(10, 2),
  productive_hours DECIMAL(10, 2),
  non_productive_hours DECIMAL(10, 2),
  hours_per_patient_day DECIMAL(6, 2) GENERATED ALWAYS AS (
    CASE 
      WHEN patient_days = 0 THEN 0
      ELSE worked_hours / patient_days
    END
  ) STORED,
  fte_utilized DECIMAL(8, 2),
  fte_budgeted DECIMAL(8, 2),
  fte_variance DECIMAL(8, 2) GENERATED ALWAYS AS (
    fte_utilized - COALESCE(fte_budgeted, 0)
  ) STORED,
  productivity_index DECIMAL(6, 2), -- Target vs Actual (100 = meeting target)
  utilization_rate DECIMAL(6, 2), -- Percentage of available time worked
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cost_center_id, metric_date)
);

CREATE INDEX idx_productivity_org_date ON productivity_metrics(org_id, metric_date);

-- =============================================
-- EMPLOYEE ENGAGEMENT & SATISFACTION
-- =============================================
CREATE TABLE IF NOT EXISTS engagement_surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL,
  survey_name VARCHAR(255) NOT NULL,
  survey_type VARCHAR(50), -- 'Annual', 'Pulse', 'Exit', 'Onboarding'
  description TEXT,
  start_date DATE,
  end_date DATE,
  is_anonymous BOOLEAN DEFAULT true,
  status VARCHAR(50) DEFAULT 'Draft', -- 'Draft', 'Active', 'Closed', 'Analyzing'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS engagement_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  survey_id UUID REFERENCES engagement_surveys(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id), -- NULL if anonymous
  cost_center_id UUID REFERENCES cost_centers(id),
  job_category VARCHAR(100),
  response_date DATE DEFAULT CURRENT_DATE,
  -- Engagement Metrics (1-5 scale)
  overall_satisfaction INTEGER CHECK (overall_satisfaction >= 1 AND overall_satisfaction <= 5),
  work_life_balance INTEGER CHECK (work_life_balance >= 1 AND work_life_balance <= 5),
  management_support INTEGER CHECK (management_support >= 1 AND management_support <= 5),
  career_development INTEGER CHECK (career_development >= 1 AND career_development <= 5),
  compensation_satisfaction INTEGER CHECK (compensation_satisfaction >= 1 AND compensation_satisfaction <= 5),
  team_collaboration INTEGER CHECK (team_collaboration >= 1 AND team_collaboration <= 5),
  workload_manageable INTEGER CHECK (workload_manageable >= 1 AND workload_manageable <= 5),
  -- Burnout Indicators
  burnout_risk_score INTEGER, -- Calculated composite score (0-100)
  emotional_exhaustion INTEGER CHECK (emotional_exhaustion >= 1 AND emotional_exhaustion <= 5),
  depersonalization INTEGER CHECK (depersonalization >= 1 AND depersonalization <= 5),
  personal_accomplishment INTEGER CHECK (personal_accomplishment >= 1 AND personal_accomplishment <= 5),
  -- Free Text
  comments TEXT,
  suggestions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_engagement_survey ON engagement_responses(survey_id);
CREATE INDEX idx_engagement_employee ON engagement_responses(employee_id);
CREATE INDEX idx_engagement_cost_center ON engagement_responses(cost_center_id);

-- =============================================
-- TURNOVER & RETENTION
-- =============================================
CREATE TABLE IF NOT EXISTS turnover_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL,
  employee_id UUID REFERENCES employees(id),
  cost_center_id UUID REFERENCES cost_centers(id),
  job_category VARCHAR(100),
  hire_date DATE,
  termination_date DATE NOT NULL,
  tenure_months INTEGER,
  termination_type VARCHAR(50), -- 'Voluntary', 'Involuntary', 'Retirement', 'End of Contract'
  termination_reason VARCHAR(100), -- 'Better Opportunity', 'Relocation', 'Burnout', 'Performance', etc.
  is_regrettable BOOLEAN, -- Was this a regrettable loss (high performer)?
  exit_interview_completed BOOLEAN DEFAULT false,
  exit_interview_notes TEXT,
  replacement_cost DECIMAL(12, 2), -- Estimated cost to replace
  notice_period_days INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_turnover_org_date ON turnover_events(org_id, termination_date);
CREATE INDEX idx_turnover_cost_center ON turnover_events(cost_center_id);

-- =============================================
-- TIME OFF & ABSENCE MANAGEMENT
-- =============================================
CREATE TABLE IF NOT EXISTS time_off_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  request_type VARCHAR(50) NOT NULL, -- 'PTO', 'Sick', 'FMLA', 'Personal', 'Bereavement'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_hours DECIMAL(6, 2),
  status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Denied', 'Cancelled'
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_time_off_employee ON time_off_requests(employee_id);
CREATE INDEX idx_time_off_status ON time_off_requests(status);

-- =============================================
-- STAFFING FORECASTS & AI RECOMMENDATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS staffing_forecasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL,
  cost_center_id UUID REFERENCES cost_centers(id),
  forecast_date DATE NOT NULL,
  forecast_period VARCHAR(20), -- 'Day', 'Week', 'Month'
  forecast_method VARCHAR(50), -- 'Historical', 'ML Model', 'Manual', 'Hybrid'
  predicted_patient_volume INTEGER,
  predicted_acuity_score DECIMAL(4, 2), -- Average patient acuity
  recommended_fte DECIMAL(6, 2),
  recommended_by_category JSONB, -- { "Nurse": 12.5, "Tech": 3.0, etc. }
  confidence_level DECIMAL(4, 2), -- 0-100% confidence in prediction
  actual_volume INTEGER,
  actual_staffing DECIMAL(6, 2),
  forecast_accuracy DECIMAL(6, 2), -- Percentage accuracy
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cost_center_id, forecast_date)
);

CREATE INDEX idx_staffing_forecasts_org_date ON staffing_forecasts(org_id, forecast_date);

-- =============================================
-- WORKFORCE ALERTS
-- =============================================
CREATE TABLE IF NOT EXISTS workforce_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL,
  alert_type VARCHAR(100) NOT NULL, -- 'Overtime Spike', 'Understaffed', 'High Burnout', 'Turnover Risk'
  severity VARCHAR(20) NOT NULL, -- 'Low', 'Medium', 'High', 'Critical'
  entity_type VARCHAR(50), -- 'Employee', 'Cost Center', 'Department'
  entity_id UUID,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  threshold_value DECIMAL(12, 2),
  actual_value DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'New', -- 'New', 'Acknowledged', 'Investigating', 'Resolved', 'Dismissed'
  acknowledged_by UUID,
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workforce_alerts_org_status ON workforce_alerts(org_id, status);
CREATE INDEX idx_workforce_alerts_severity ON workforce_alerts(severity);

-- =============================================
-- VIEWS FOR WORKFORCE ANALYTICS
-- =============================================

-- Labor Cost Summary by Cost Center
CREATE OR REPLACE VIEW labor_cost_summary AS
SELECT 
  lc.org_id,
  lc.cost_center_id,
  cc.name as cost_center_name,
  DATE_TRUNC('month', lc.pay_period_start) as month,
  COUNT(DISTINCT lc.employee_id) as employee_count,
  SUM(lc.regular_hours) as total_regular_hours,
  SUM(lc.overtime_hours) as total_overtime_hours,
  CASE 
    WHEN SUM(lc.regular_hours + lc.overtime_hours) = 0 THEN 0
    ELSE (SUM(lc.overtime_hours) / SUM(lc.regular_hours + lc.overtime_hours) * 100)
  END as overtime_percentage,
  SUM(lc.total_labor_cost) as total_labor_cost,
  AVG(lc.total_labor_cost) as avg_labor_cost_per_employee
FROM labor_costs lc
LEFT JOIN cost_centers cc ON lc.cost_center_id = cc.id
GROUP BY lc.org_id, lc.cost_center_id, cc.name, DATE_TRUNC('month', lc.pay_period_start);

-- Productivity Dashboard
CREATE OR REPLACE VIEW productivity_dashboard AS
SELECT 
  pm.org_id,
  pm.cost_center_id,
  cc.name as cost_center_name,
  pm.metric_date,
  pm.patient_days,
  pm.worked_hours,
  pm.hours_per_patient_day,
  pm.fte_utilized,
  pm.fte_budgeted,
  pm.fte_variance,
  pm.productivity_index,
  pm.utilization_rate,
  CASE 
    WHEN pm.productivity_index >= 95 AND pm.productivity_index <= 105 THEN 'On Target'
    WHEN pm.productivity_index > 105 THEN 'Over Productive'
    ELSE 'Under Productive'
  END as productivity_status
FROM productivity_metrics pm
LEFT JOIN cost_centers cc ON pm.cost_center_id = cc.id;

-- Engagement & Burnout Summary
CREATE OR REPLACE VIEW engagement_summary AS
SELECT 
  er.survey_id,
  es.survey_name,
  er.cost_center_id,
  cc.name as cost_center_name,
  er.job_category,
  COUNT(*) as response_count,
  AVG(er.overall_satisfaction) as avg_satisfaction,
  AVG(er.work_life_balance) as avg_work_life_balance,
  AVG(er.workload_manageable) as avg_workload_manageable,
  AVG(er.burnout_risk_score) as avg_burnout_risk,
  COUNT(CASE WHEN er.burnout_risk_score >= 70 THEN 1 END) as high_burnout_count,
  CASE 
    WHEN COUNT(*) = 0 THEN 0
    ELSE (COUNT(CASE WHEN er.burnout_risk_score >= 70 THEN 1 END)::DECIMAL / COUNT(*) * 100)
  END as high_burnout_percentage
FROM engagement_responses er
JOIN engagement_surveys es ON er.survey_id = es.id
LEFT JOIN cost_centers cc ON er.cost_center_id = cc.id
GROUP BY er.survey_id, es.survey_name, er.cost_center_id, cc.name, er.job_category;

-- Turnover Metrics
CREATE OR REPLACE VIEW turnover_metrics AS
SELECT 
  te.org_id,
  te.cost_center_id,
  cc.name as cost_center_name,
  te.job_category,
  DATE_TRUNC('year', te.termination_date) as year,
  COUNT(*) as termination_count,
  COUNT(CASE WHEN te.is_regrettable THEN 1 END) as regrettable_turnover_count,
  AVG(te.tenure_months) as avg_tenure_months,
  SUM(te.replacement_cost) as total_replacement_cost,
  COUNT(CASE WHEN te.termination_type = 'Voluntary' THEN 1 END) as voluntary_count,
  COUNT(CASE WHEN te.termination_type = 'Involuntary' THEN 1 END) as involuntary_count
FROM turnover_events te
LEFT JOIN cost_centers cc ON te.cost_center_id = cc.id
GROUP BY te.org_id, te.cost_center_id, cc.name, te.job_category, DATE_TRUNC('year', te.termination_date);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to calculate overtime alerts
CREATE OR REPLACE FUNCTION check_overtime_threshold()
RETURNS TRIGGER AS $$
DECLARE
  overtime_pct DECIMAL;
  total_hours DECIMAL;
BEGIN
  total_hours := NEW.regular_hours + NEW.overtime_hours;
  
  IF total_hours > 0 THEN
    overtime_pct := (NEW.overtime_hours / total_hours * 100);
    
    -- Alert if overtime exceeds 15%
    IF overtime_pct > 15 THEN
      INSERT INTO workforce_alerts (
        org_id,
        alert_type,
        severity,
        entity_type,
        entity_id,
        title,
        message,
        threshold_value,
        actual_value
      )
      VALUES (
        NEW.org_id,
        'Overtime Spike',
        CASE 
          WHEN overtime_pct > 25 THEN 'Critical'
          WHEN overtime_pct > 20 THEN 'High'
          ELSE 'Medium'
        END,
        'Employee',
        NEW.employee_id,
        'High Overtime Detected',
        format('Employee has %s%% overtime in pay period', overtime_pct::TEXT),
        15.0,
        overtime_pct
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for overtime alerts
CREATE TRIGGER overtime_alert_trigger
AFTER INSERT OR UPDATE OF overtime_hours ON labor_costs
FOR EACH ROW
WHEN (NEW.overtime_hours > 0)
EXECUTE FUNCTION check_overtime_threshold();

-- Apply update timestamp triggers
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shift_templates_updated_at BEFORE UPDATE ON shift_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_labor_costs_updated_at BEFORE UPDATE ON labor_costs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productivity_metrics_updated_at BEFORE UPDATE ON productivity_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_engagement_surveys_updated_at BEFORE UPDATE ON engagement_surveys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_off_requests_updated_at BEFORE UPDATE ON time_off_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staffing_forecasts_updated_at BEFORE UPDATE ON staffing_forecasts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- COMMENTS
-- =============================================
COMMENT ON TABLE employees IS 'Employee master data for workforce management';
COMMENT ON TABLE shift_templates IS 'Reusable shift templates for scheduling';
COMMENT ON TABLE schedules IS 'Employee schedules with planned and actual hours';
COMMENT ON TABLE labor_costs IS 'Labor cost tracking by employee and pay period';
COMMENT ON TABLE productivity_metrics IS 'Productivity metrics including hours per patient day';
COMMENT ON TABLE engagement_surveys IS 'Employee engagement survey definitions';
COMMENT ON TABLE engagement_responses IS 'Survey responses with burnout risk indicators';
COMMENT ON TABLE turnover_events IS 'Employee turnover tracking for retention analytics';
COMMENT ON TABLE time_off_requests IS 'Time off requests and absence management';
COMMENT ON TABLE staffing_forecasts IS 'AI-driven staffing forecasts and recommendations';
COMMENT ON TABLE workforce_alerts IS 'Automated alerts for workforce issues';

