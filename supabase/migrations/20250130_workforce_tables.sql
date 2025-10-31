-- Workforce Management Tables Migration
-- Created: 2025-01-30
-- Purpose: Workforce foundation for PM0 Healthcare Finance & Operations platform

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT, -- e.g., "ICU", "ED", "OR"
  cost_center TEXT,
  parent_department_id UUID REFERENCES departments(id) ON DELETE SET NULL, -- For department hierarchy
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, code) -- Ensure unique codes within org
);

-- Employees (extends existing resources concept)
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL, -- Links to existing roles table
  resource_id UUID REFERENCES resources(id) ON DELETE SET NULL, -- Optional link to resources
  employee_id TEXT NOT NULL, -- HRIS employee ID
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  hire_date DATE,
  hourly_rate DECIMAL(10, 2) CHECK (hourly_rate >= 0),
  fte DECIMAL(3, 2) DEFAULT 1.0 CHECK (fte >= 0 AND fte <= 1.0), -- full-time equivalent
  employment_status TEXT NOT NULL DEFAULT 'active' CHECK (employment_status IN ('active', 'on_leave', 'terminated', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, employee_id) -- Ensure unique employee IDs within org
);

-- Schedules
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'active', 'archived')),
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_schedule_period CHECK (period_end >= period_start)
);

-- Schedule Assignments
CREATE TABLE IF NOT EXISTS schedule_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  shift_date DATE NOT NULL,
  shift_start TIME NOT NULL,
  shift_end TIME NOT NULL,
  hours_worked DECIMAL(4, 2) GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (shift_end::timestamp - shift_start::timestamp)) / 3600.0
  ) STORED,
  overtime_hours DECIMAL(4, 2) DEFAULT 0 CHECK (overtime_hours >= 0),
  shift_type TEXT CHECK (shift_type IN ('regular', 'call', 'float', 'agency', 'overtime', 'on_call')),
  break_minutes INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_shift_time CHECK (shift_end > shift_start)
);

-- Labor Metrics (aggregated metrics by period)
CREATE TABLE IF NOT EXISTS labor_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  period_id UUID REFERENCES financial_periods(id) ON DELETE SET NULL, -- Links to financial periods
  metric_date DATE NOT NULL,
  productive_hours DECIMAL(10, 2) DEFAULT 0 CHECK (productive_hours >= 0),
  non_productive_hours DECIMAL(10, 2) DEFAULT 0 CHECK (non_productive_hours >= 0),
  overtime_hours DECIMAL(10, 2) DEFAULT 0 CHECK (overtime_hours >= 0),
  agency_hours DECIMAL(10, 2) DEFAULT 0 CHECK (agency_hours >= 0),
  total_hours DECIMAL(10, 2) GENERATED ALWAYS AS (
    productive_hours + non_productive_hours + overtime_hours + agency_hours
  ) STORED,
  labor_cost DECIMAL(12, 2) DEFAULT 0 CHECK (labor_cost >= 0),
  patient_days INTEGER DEFAULT 0 CHECK (patient_days >= 0),
  cost_per_patient_day DECIMAL(10, 2), -- Computed: labor_cost / patient_days (when patient_days > 0)
  hours_per_patient_day DECIMAL(6, 2), -- Computed: total_hours / patient_days (when patient_days > 0)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee Sentiment / Engagement
CREATE TABLE IF NOT EXISTS employee_sentiment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  survey_date DATE NOT NULL,
  burnout_score INTEGER CHECK (burnout_score >= 1 AND burnout_score <= 10),
  engagement_score INTEGER CHECK (engagement_score >= 1 AND engagement_score <= 10),
  satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 10),
  feedback_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_departments_org ON departments(organization_id);
CREATE INDEX IF NOT EXISTS idx_departments_parent ON departments(parent_department_id);
CREATE INDEX IF NOT EXISTS idx_employees_org ON employees(organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_dept ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(employment_status);
CREATE INDEX IF NOT EXISTS idx_schedules_org ON schedules(organization_id);
CREATE INDEX IF NOT EXISTS idx_schedules_dept ON schedules(department_id);
CREATE INDEX IF NOT EXISTS idx_schedules_period ON schedules(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_schedule_assignments_schedule ON schedule_assignments(schedule_id);
CREATE INDEX IF NOT EXISTS idx_schedule_assignments_employee ON schedule_assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_schedule_assignments_date ON schedule_assignments(shift_date);
CREATE INDEX IF NOT EXISTS idx_labor_metrics_org ON labor_metrics(organization_id);
CREATE INDEX IF NOT EXISTS idx_labor_metrics_dept ON labor_metrics(department_id);
CREATE INDEX IF NOT EXISTS idx_labor_metrics_date ON labor_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_labor_metrics_period ON labor_metrics(period_id);
CREATE INDEX IF NOT EXISTS idx_employee_sentiment_org ON employee_sentiment(organization_id);
CREATE INDEX IF NOT EXISTS idx_employee_sentiment_employee ON employee_sentiment(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_sentiment_date ON employee_sentiment(survey_date);

-- Function to calculate cost per patient day
CREATE OR REPLACE FUNCTION calculate_cost_per_patient_day()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.patient_days > 0 AND NEW.labor_cost IS NOT NULL THEN
    NEW.cost_per_patient_day := NEW.labor_cost / NEW.patient_days;
  ELSE
    NEW.cost_per_patient_day := NULL;
  END IF;
  
  IF NEW.patient_days > 0 AND NEW.total_hours IS NOT NULL THEN
    NEW.hours_per_patient_day := NEW.total_hours / NEW.patient_days;
  ELSE
    NEW.hours_per_patient_day := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate cost per patient day
CREATE TRIGGER labor_metrics_calculator
  BEFORE INSERT OR UPDATE OF labor_cost, patient_days, total_hours ON labor_metrics
  FOR EACH ROW
  EXECUTE FUNCTION calculate_cost_per_patient_day();

-- Updated timestamp triggers
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON departments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at
  BEFORE UPDATE ON schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_labor_metrics_updated_at
  BEFORE UPDATE ON labor_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
