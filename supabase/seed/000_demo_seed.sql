-- Demo data for PM0 scenario planning
set search_path = public;

with demo_users as (
  select
    '11111111-1111-4111-8111-111111111111'::uuid as owner_id,
    '22222222-2222-4222-8222-222222222222'::uuid as planner_id
)
insert into public.profiles (user_id, email, full_name, timezone)
select owner_id, 'demo.admin@pm0.health', 'Demo Admin', 'America/Chicago'
from demo_users
on conflict (user_id) do update set
  email = excluded.email,
  full_name = excluded.full_name,
  timezone = excluded.timezone;

with demo_users as (
  select
    '11111111-1111-4111-8111-111111111111'::uuid as owner_id,
    '22222222-2222-4222-8222-222222222222'::uuid as planner_id
)
insert into public.profiles (user_id, email, full_name, timezone)
select planner_id, 'demo.planner@pm0.health', 'Demo Planner', 'America/Chicago'
from demo_users
on conflict (user_id) do update set
  email = excluded.email,
  full_name = excluded.full_name,
  timezone = excluded.timezone;

with demo_constants as (
  select
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid as project_id,
    '11111111-1111-4111-8111-111111111111'::uuid as owner_id,
    '22222222-2222-4222-8222-222222222222'::uuid as planner_id
)
insert into public.projects (id, name, description, status, start_month, end_month, created_by)
select project_id,
       'Demo Workday Transformation',
       'Reference workspace showcasing PM0 heatmaps, scenarios, and KPIs.',
       'active',
       date '2024-01-01',
       date '2024-12-01',
       owner_id
from demo_constants
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  status = excluded.status,
  start_month = excluded.start_month,
  end_month = excluded.end_month;

with demo_constants as (
  select
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid as project_id,
    '11111111-1111-4111-8111-111111111111'::uuid as owner_id,
    '22222222-2222-4222-8222-222222222222'::uuid as planner_id
)
insert into public.project_members (project_id, user_id, role, invited_by)
select project_id, owner_id, 'owner', owner_id from demo_constants
on conflict (project_id, user_id) do update set role = excluded.role;

with demo_constants as (
  select
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid as project_id,
    '11111111-1111-4111-8111-111111111111'::uuid as owner_id,
    '22222222-2222-4222-8222-222222222222'::uuid as planner_id
)
insert into public.project_members (project_id, user_id, role, invited_by)
select project_id, planner_id, 'member', owner_id from demo_constants
on conflict (project_id, user_id) do update set role = excluded.role;

with project as (
  select 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid as project_id
)
insert into public.role_definitions (id, project_id, name, discipline, workstream, severity_level, fte_required, notes)
select 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', project_id, 'Workday Project Manager', 'Project Management', 'Program Leadership', 5, 1.00,
       'Owns governance, steering committee updates, and executive scorecards.'
from project
on conflict (id) do update set
  project_id = excluded.project_id,
  name = excluded.name,
  discipline = excluded.discipline,
  workstream = excluded.workstream,
  severity_level = excluded.severity_level,
  fte_required = excluded.fte_required,
  notes = excluded.notes;

with project as (
  select 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid as project_id
)
insert into public.role_definitions (id, project_id, name, discipline, workstream, severity_level, fte_required, notes)
select 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', project_id, 'Change Lead', 'Change Management', 'OCM', 4, 0.75,
       'Coordinates change strategy, communications, and readiness roadmap.'
from project
on conflict (id) do update set
  project_id = excluded.project_id,
  name = excluded.name,
  discipline = excluded.discipline,
  workstream = excluded.workstream,
  severity_level = excluded.severity_level,
  fte_required = excluded.fte_required,
  notes = excluded.notes;

with project as (
  select 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid as project_id
)
insert into public.resources (id, project_id, role_id, full_name, email, vendor, cost_center, availability, hourly_rate)
select 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', project_id, 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
       'Morgan Patel', 'morgan.patel@pm0.health', 'Internal', 'HC-001', 1, 145.00
from project
on conflict (id) do update set
  project_id = excluded.project_id,
  role_id = excluded.role_id,
  full_name = excluded.full_name,
  email = excluded.email,
  vendor = excluded.vendor,
  cost_center = excluded.cost_center,
  availability = excluded.availability,
  hourly_rate = excluded.hourly_rate;

with project as (
  select 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid as project_id
)
insert into public.resources (id, project_id, role_id, full_name, email, vendor, cost_center, availability, hourly_rate)
select 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', project_id, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
       'Avery Chen', 'avery.chen@pm0.health', 'Advisory Partner', 'HC-EXT', 0.6, 210.00
from project
on conflict (id) do update set
  project_id = excluded.project_id,
  role_id = excluded.role_id,
  full_name = excluded.full_name,
  email = excluded.email,
  vendor = excluded.vendor,
  cost_center = excluded.cost_center,
  availability = excluded.availability,
  hourly_rate = excluded.hourly_rate;

with baseline as (
  select 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid as project_id,
         'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid as pm_role,
         'dddddddd-dddd-4ddd-8ddd-dddddddddddd'::uuid as pm_resource,
         'cccccccc-cccc-4ccc-8ccc-cccccccccccc'::uuid as change_role,
         'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'::uuid as change_resource
)
insert into public.resource_allocations (id, project_id, resource_id, role_id, month, allocation_hours, severity_level, status, notes)
select 'f1f1f1f1-f1f1-4f1f-8f1f-f1f1f1f1f1f1', project_id, pm_resource, pm_role, date '2024-01-01', 160, 5, 'planned', 'Kickoff and mobilization'
from baseline
on conflict (id) do update set
  project_id = excluded.project_id,
  resource_id = excluded.resource_id,
  role_id = excluded.role_id,
  month = excluded.month,
  allocation_hours = excluded.allocation_hours,
  severity_level = excluded.severity_level,
  status = excluded.status,
  notes = excluded.notes;

with baseline as (
  select 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid as project_id,
         'cccccccc-cccc-4ccc-8ccc-cccccccccccc'::uuid as change_role,
         'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'::uuid as change_resource
)
insert into public.resource_allocations (id, project_id, resource_id, role_id, month, allocation_hours, severity_level, status, notes)
select 'f2f2f2f2-f2f2-4f2f-8f2f-f2f2f2f2f2f2', project_id, change_resource, change_role, date '2024-03-01', 120, 4, 'planned', 'Readiness roadshows'
from baseline
on conflict (id) do update set
  project_id = excluded.project_id,
  resource_id = excluded.resource_id,
  role_id = excluded.role_id,
  month = excluded.month,
  allocation_hours = excluded.allocation_hours,
  severity_level = excluded.severity_level,
  status = excluded.status,
  notes = excluded.notes;

with scenario_constants as (
  select
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid as project_id,
    '11111111-1111-4111-8111-111111111111'::uuid as owner_id
)
insert into public.scenarios (id, project_id, name, summary, scenario_type, assumptions, results, is_primary, created_by)
select '99999999-9999-4999-8999-999999999999', project_id, 'Baseline', 'Baseline run-rate with planned staffing ramp.', 'baseline',
       jsonb_build_object('ramp_months', 6, 'implementation_partner', 'Tier 1'),
       jsonb_build_object('total_hours', 2480, 'estimated_cost', 410000, 'kpi', jsonb_build_object('risk_score', 2.3, 'fte_gap', 1.4)),
       true,
       owner_id
from scenario_constants
on conflict (id) do update set
  project_id = excluded.project_id,
  name = excluded.name,
  summary = excluded.summary,
  scenario_type = excluded.scenario_type,
  assumptions = excluded.assumptions,
  results = excluded.results,
  is_primary = excluded.is_primary,
  created_by = excluded.created_by;

with scenario_constants as (
  select '99999999-9999-4999-8999-999999999999'::uuid as scenario_id
)
insert into public.scenario_timeframes (id, scenario_id, month, demand_multiplier, supply_multiplier, notes)
select '12121212-1212-4121-8212-121212121212', scenario_id, date '2024-06-01', 1.35, 1.10, 'Peak testing effort'
from scenario_constants
on conflict (id) do update set
  scenario_id = excluded.scenario_id,
  month = excluded.month,
  demand_multiplier = excluded.demand_multiplier,
  supply_multiplier = excluded.supply_multiplier,
  notes = excluded.notes;

insert into public.estimation_inputs (id, project_id, category, input_key, value, unit, metadata)
values (
  '13131313-1313-4131-8313-131313131313',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'workstream_capex',
  'integration_hours',
  820,
  'hours',
  jsonb_build_object('owner', 'Technical PMO', 'confidence', 'medium')
)
on conflict (id) do update set
  project_id = excluded.project_id,
  category = excluded.category,
  input_key = excluded.input_key,
  value = excluded.value,
  unit = excluded.unit,
  metadata = excluded.metadata;

insert into public.kpi_snapshots (id, project_id, scenario_id, metrics, recorded_for)
values (
  '14141414-1414-4141-8414-141414141414',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '99999999-9999-4999-8999-999999999999',
  jsonb_build_object('risk_score', 2.1, 'fte_gap', 1.0, 'readiness', 0.72),
  date '2024-04-01'
)
on conflict (id) do update set
  project_id = excluded.project_id,
  scenario_id = excluded.scenario_id,
  metrics = excluded.metrics,
  recorded_for = excluded.recorded_for;

insert into public.readiness_checklist_items (id, project_id, category, item, status, owner, owner_id, due_date, notes)
values (
  '15151515-1515-4151-8515-151515151515',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'Change Management',
  'Leadership alignment signed off',
  'in_progress',
  'Demo Admin',
  '11111111-1111-4111-8111-111111111111',
  date '2024-02-15',
  'Executive steering committee prep in progress.'
)
on conflict (id) do update set
  project_id = excluded.project_id,
  category = excluded.category,
  item = excluded.item,
  status = excluded.status,
  owner = excluded.owner,
  owner_id = excluded.owner_id,
  due_date = excluded.due_date,
  notes = excluded.notes;

insert into public.vendor_catalog_rates (id, project_id, vendor_name, service, rate_type, rate, currency, metadata)
values (
  '16161616-1616-4161-8616-161616161616',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'Northwind Advisory',
  'Testing surge team',
  'hourly',
  195.00,
  'USD',
  jsonb_build_object('min_hours', 200, 'slo', '48h mobilization')
)
on conflict (id) do update set
  project_id = excluded.project_id,
  vendor_name = excluded.vendor_name,
  service = excluded.service,
  rate_type = excluded.rate_type,
  rate = excluded.rate,
  currency = excluded.currency,
  metadata = excluded.metadata;

insert into public.import_jobs (id, project_id, job_type, status, payload, created_at)
values (
  '17171717-1717-4171-8717-171717171717',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'scenario_csv_import',
  'complete',
  jsonb_build_object('filename', 'baseline_scenario.csv', 'row_count', 42),
  now() - interval '1 day'
)
on conflict (id) do update set
  project_id = excluded.project_id,
  job_type = excluded.job_type,
  status = excluded.status,
  payload = excluded.payload;

