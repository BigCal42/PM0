-- PM0 Schema (Non-breaking Minimal Set)
-- Safe defaults: nullable where uncertain; compute in RPCs; UUID PKs; timestamps default now()
-- Uses gen_random_uuid() (pgcrypto). Supabase includes pgcrypto by default.

-- Organizations hold multiple projects (tenant container)
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_at timestamptz not null default now()
);

-- Projects scoped to one organization; creator is recorded for ownership policies
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text,
  description text,
  created_by uuid, -- maps to auth.users.id (user UUID)
  created_at timestamptz not null default now()
);

-- Project membership for RLS checks
create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  user_id uuid, -- maps to auth.users.id
  role text,    -- e.g., owner, admin, contributor, viewer
  created_at timestamptz not null default now()
);

-- Phases (M0–M7 recommended), per project
create table if not exists public.phases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  name text,
  sort_order int
);

-- Roles catalog per project (e.g., PM, Architect, Analyst)
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  name text,
  category text,   -- e.g., Program, Functional, Technical, OCM
  cost_rate numeric -- optional hourly/daily cost guidance
);

-- Human resources for planning, kept per project scope
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  full_name text,
  role_id uuid references public.roles(id) on delete set null,
  capacity_pct numeric -- e.g., 100 = full-time
);

-- Capacity required per phase/role (Requirement)
create table if not exists public.requirements (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  phase_id uuid references public.phases(id) on delete cascade,
  role_id uuid references public.roles(id) on delete cascade,
  required_capacity_pct numeric -- aggregate target capacity (% of FTE*100)
);

-- Actual assignments per phase/role/resource (what you have)
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  phase_id uuid references public.phases(id) on delete cascade,
  role_id uuid references public.roles(id) on delete cascade,
  resource_id uuid references public.resources(id) on delete set null,
  allocation_pct numeric -- sum per phase/role yields assigned capacity
);

-- Scenario header (optional snapshots/what-if runs)
create table if not exists public.scenarios (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  name text,
  description jsonb,
  created_by uuid,
  created_at timestamptz not null default now()
);

-- Scenario point-in-time results for gaps
create table if not exists public.scenario_results (
  id uuid primary key default gen_random_uuid(),
  scenario_id uuid references public.scenarios(id) on delete cascade,
  phase_id uuid references public.phases(id) on delete cascade,
  role_id uuid references public.roles(id) on delete cascade,
  required numeric,
  assigned numeric,
  gap numeric
);

-- Helpful indexes for performance
create index if not exists idx_projects_org on public.projects(organization_id);
create index if not exists idx_project_members_proj on public.project_members(project_id);
create index if not exists idx_phases_proj on public.phases(project_id);
create index if not exists idx_roles_proj on public.roles(project_id);
create index if not exists idx_resources_proj on public.resources(project_id);
create index if not exists idx_requirements_proj_phase_role on public.requirements(project_id, phase_id, role_id);
create index if not exists idx_assignments_proj_phase_role on public.assignments(project_id, phase_id, role_id);
create index if not exists idx_scenarios_proj on public.scenarios(project_id);
create index if not exists idx_scenario_results_scen on public.scenario_results(scenario_id);

-- Optional view of members per project (convenience)
create or replace view public.v_project_members as
  select pm.project_id, pm.user_id, pm.role
  from public.project_members pm;
