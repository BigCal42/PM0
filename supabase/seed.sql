-- PM0 Demo Seed (Local-only; safe sample data)

-- NOTE: Replace this with your actual user UUID if you want auth-gated testing.
-- For quick local checks, we seed a known UUID.
-- You can obtain your auth user id by selecting from auth.users in the Supabase dashboard.
-- Example placeholder (do not rely on this in production):
\set user_id '11111111-1111-1111-1111-111111111111'

with org as (
  insert into public.organizations (name) values ('Demo Health System')
  returning id
),
proj as (
  insert into public.projects (organization_id, name, description, created_by)
  select id, 'PM0 Demo Project', 'Seeded demo project', :'user_id' from org
  returning id
),
member as (
  insert into public.project_members (project_id, user_id, role)
  select id, :'user_id', 'owner' from proj
  returning project_id
),
ph as (
  insert into public.phases (project_id, name, sort_order)
  select project_id, x.name, x.sort_order
  from member
  cross join (values
    ('M0 Mobilize', 0),
    ('M1 Scope', 1),
    ('M2 Architecture', 2),
    ('M3 Build', 3),
    ('M4 Validation', 4),
    ('M5 Cutover Readiness', 5),
    ('M6 Go-Live', 6),
    ('M7 Stabilization', 7)
  ) as x(name, sort_order)
  returning id, project_id, name, sort_order
),
rl as (
  insert into public.roles (project_id, name, category, cost_rate)
  select (select project_id from member), x.name, x.category, x.cost_rate
  from (values
    ('Program Manager','Program',1200),
    ('Solution Architect','Technical',1500),
    ('Business Analyst','Functional',900),
    ('Data Engineer','Technical',1100),
    ('Tester','QA',800),
    ('OCM Lead','OCM',1000)
  ) as x(name, category, cost_rate)
  returning id, project_id, name
),
res as (
  insert into public.resources (project_id, full_name, role_id, capacity_pct)
  select (select project_id from member), x.full_name, r.id, x.capacity
  from rl r
  join (values
    ('Pat Program', 'Program Manager', 100),
    ('Alex Architect', 'Solution Architect', 100),
    ('Blake Business', 'Business Analyst', 100),
    ('Dana Data', 'Data Engineer', 100),
    ('Terry Test', 'Tester', 100),
    ('Olive Change', 'OCM Lead', 100)
  ) as x(full_name, role_name, capacity)
  on r.name = x.role_name
  returning id, project_id, role_id, capacity_pct
),
req as (
  -- Requirements (FTE*100) by phase/role to create visible gaps
  insert into public.requirements (project_id, phase_id, role_id, required_capacity_pct)
  select (select project_id from member), ph.id, r.id,
         case 
           when ph.sort_order between 0 and 1 and r.name in ('Program Manager','Business Analyst') then 200
           when ph.sort_order between 2 and 3 and r.name in ('Solution Architect','Data Engineer') then 300
           when ph.sort_order = 4 and r.name in ('Tester') then 400
           when ph.sort_order between 5 and 6 and r.name in ('Program Manager','OCM Lead') then 200
           else 100
         end
  from ph
  cross join rl r
  returning id
)
-- Assignments (will leave some roles under/over to show non-zero gaps)
insert into public.assignments (project_id, phase_id, role_id, resource_id, allocation_pct)
select
  (select project_id from member),
  ph.id,
  r.id,
  -- match by role_id for a single main resource when possible
  (select res.id from res where res.role_id = r.id limit 1),
  case
    when ph.sort_order in (2,3) and r.name = 'Solution Architect' then 200
    when ph.sort_order in (2,3) and r.name = 'Data Engineer' then 200
    when ph.sort_order = 4 and r.name = 'Tester' then 200
    when ph.sort_order between 5 and 6 and r.name = 'OCM Lead' then 100
    else 100
  end
from ph
cross join rl r;
