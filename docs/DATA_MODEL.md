# 📊 PM0 Data Model

**Version:** 1.0  
**Last Updated:** 2025-01-30

---

## Overview

PM0 uses a multi-tenant PostgreSQL database hosted on Supabase with Row Level Security (RLS) enforcing data isolation.

---

## Schema Design

### Organizations & Access Control

#### `organizations`
Multi-tenant organization management.

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan_tier TEXT NOT NULL DEFAULT 'core', -- core, professional, enterprise
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `project_members`
RLS enforcement via project membership.

```sql
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer', -- viewer, editor, admin
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);
```

### Project Management

#### `projects`
Transformation projects.

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, active, completed, archived
  domain TEXT, -- workday, epic, oracle, sap, etc.
  complexity_score INTEGER, -- 0-100
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `phases`
Project phases/stages.

```sql
CREATE TABLE phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  description TEXT,
  estimated_duration_days INTEGER,
  status TEXT NOT NULL DEFAULT 'planned', -- planned, in_progress, completed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `requirements`
Project requirements.

```sql
CREATE TABLE requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES phases(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, critical
  status TEXT NOT NULL DEFAULT 'open', -- open, in_progress, completed, blocked
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Resources & Roles

#### `roles`
Role definitions (PM, Architect, Developer, etc.).

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT, -- technical, business, executive
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `resources`
Resource inventory.

```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  role_id UUID REFERENCES roles(id),
  availability_hours_per_week INTEGER DEFAULT 40,
  hourly_rate DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `assignments`
Role-to-phase assignments.

```sql
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID REFERENCES phases(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
  allocation_percentage INTEGER DEFAULT 100, -- 0-100
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(phase_id, role_id, resource_id)
);
```

### Scenario Modeling

#### `scenarios`
Scenario definitions (Baseline, Accelerated, Lean, High-Scope).

```sql
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- baseline, accelerated, lean, scope-lite
  description TEXT,
  estimated_duration_days INTEGER,
  estimated_cost DECIMAL(12, 2),
  risk_score INTEGER, -- 0-100
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `scenario_results`
Computed scenario outputs.

```sql
CREATE TABLE scenario_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID REFERENCES scenarios(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES phases(id) ON DELETE CASCADE,
  resource_gaps JSONB, -- Gap analysis results
  timeline_impact_days INTEGER,
  cost_impact DECIMAL(12, 2),
  risk_factors JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Row Level Security (RLS)

### Policies

All tables protected via `project_members`:

```sql
-- Example: Projects RLS
CREATE POLICY "Users can view projects they're members of"
  ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = projects.id
      AND project_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update projects they're editors/admins"
  ON projects FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = projects.id
      AND project_members.user_id = auth.uid()
      AND project_members.role IN ('editor', 'admin')
    )
  );
```

---

## Database Functions (RPCs)

### `list_project_phases(project_id UUID)`

Returns all phases for a project, ordered by sequence.

```sql
CREATE OR REPLACE FUNCTION list_project_phases(project_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  sequence INTEGER,
  description TEXT,
  estimated_duration_days INTEGER,
  status TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.sequence,
    p.description,
    p.estimated_duration_days,
    p.status,
    p.created_at,
    p.updated_at
  FROM phases p
  WHERE p.project_id = list_project_phases.project_id
  ORDER BY p.sequence ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### `compute_phase_gaps(phase_id UUID)`

Computes resource/capability gaps for a phase.

```sql
CREATE OR REPLACE FUNCTION compute_phase_gaps(phase_id UUID)
RETURNS JSONB AS $$
DECLARE
  gaps JSONB;
BEGIN
  -- Compute gaps logic here
  -- Returns: { "missing_roles": [...], "capacity_gaps": [...], "skill_gaps": [...] }
  SELECT jsonb_build_object(
    'missing_roles', (
      SELECT jsonb_agg(role_id)
      FROM assignments
      WHERE phase_id = compute_phase_gaps.phase_id
      AND resource_id IS NULL
    ),
    'capacity_gaps', jsonb_build_array(),
    'skill_gaps', jsonb_build_array()
  ) INTO gaps;
  
  RETURN gaps;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### `store_scenario_from_gaps(project_id UUID, scenario_type TEXT, gaps JSONB)`

Stores computed scenario from gap analysis.

```sql
CREATE OR REPLACE FUNCTION store_scenario_from_gaps(
  project_id UUID,
  scenario_type TEXT,
  gaps JSONB
)
RETURNS UUID AS $$
DECLARE
  scenario_id UUID;
BEGIN
  INSERT INTO scenarios (project_id, type, name, description)
  VALUES (
    store_scenario_from_gaps.project_id,
    store_scenario_from_gaps.scenario_type,
    INITCAP(scenario_type) || ' Scenario',
    'Auto-generated from gap analysis'
  )
  RETURNING id INTO scenario_id;
  
  -- Store gap results
  INSERT INTO scenario_results (scenario_id, resource_gaps)
  VALUES (scenario_id, gaps);
  
  RETURN scenario_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_projects_organization ON projects(organization_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_phases_project ON phases(project_id);
CREATE INDEX idx_requirements_project ON requirements(project_id);
CREATE INDEX idx_scenarios_project ON scenarios(project_id);
CREATE INDEX idx_assignments_phase ON assignments(phase_id);
```

---

## Migration Strategy

1. **Phase 1:** Core tables (organizations, projects, phases)
2. **Phase 2:** Resources & roles (roles, resources, assignments)
3. **Phase 3:** Scenarios (scenarios, scenario_results)
4. **Phase 4:** RLS policies
5. **Phase 5:** RPC functions

---

**Last Updated:** 2025-01-30  
**Version:** 1.0

