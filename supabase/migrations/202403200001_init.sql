-- PM0 schema + RLS baseline
set check_function_bodies = off;

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

create schema if not exists pm0;

create table if not exists pm0.organizations (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    plan text default 'standard',
    created_at timestamptz not null default timezone('utc', now())
);

create table if not exists pm0.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    organization_id uuid not null references pm0.organizations(id) on delete cascade,
    email text not null unique,
    full_name text,
    role text not null default 'MEMBER',
    created_at timestamptz not null default timezone('utc', now())
);

create table if not exists pm0.projects (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null references pm0.organizations(id) on delete cascade,
    code text not null,
    name text not null,
    start_month date not null,
    end_month date not null,
    severity_config jsonb default jsonb_build_object(
        'on_track', 0.05,
        'watch', 0.15,
        'at_risk', 0.3,
        'critical', 0.5
    ),
    status text not null default 'draft',
    created_by uuid references auth.users(id),
    created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists projects_org_code_idx on pm0.projects(organization_id, code);

create table if not exists pm0.project_members (
    project_id uuid references pm0.projects(id) on delete cascade,
    profile_id uuid references pm0.profiles(id) on delete cascade,
    project_role text not null default 'COLLABORATOR',
    created_at timestamptz not null default timezone('utc', now()),
    primary key (project_id, profile_id)
);

create table if not exists pm0.roles (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references pm0.projects(id) on delete cascade,
    name text not null,
    category text,
    rate numeric(12,2),
    is_billable boolean default true,
    created_at timestamptz not null default timezone('utc', now())
);

create table if not exists pm0.resources (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references pm0.projects(id) on delete cascade,
    role_id uuid references pm0.roles(id) on delete set null,
    name text not null,
    vendor text,
    fte_capacity numeric(5,2) not null default 1.0,
    cost_rate numeric(12,2),
    active boolean not null default true,
    created_at timestamptz not null default timezone('utc', now())
);

create table if not exists pm0.resource_allocations (
    id uuid primary key default gen_random_uuid(),
    resource_id uuid not null references pm0.resources(id) on delete cascade,
    project_id uuid not null references pm0.projects(id) on delete cascade,
    month date not null,
    planned_hours integer not null,
    actual_hours integer default 0,
    created_at timestamptz not null default timezone('utc', now()),
    unique (resource_id, month)
);

create table if not exists pm0.scenarios (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references pm0.projects(id) on delete cascade,
    name text not null,
    template text not null,
    assumptions jsonb not null,
    results jsonb default '{}'::jsonb,
    is_baseline boolean default false,
    created_by uuid references auth.users(id),
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create or replace function pm0.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at := timezone('utc', now());
    return new;
end;
$$;

create trigger scenarios_updated_at
    before update on pm0.scenarios
    for each row
    execute procedure pm0.set_updated_at();

create table if not exists pm0.scenario_metrics (
    scenario_id uuid primary key references pm0.scenarios(id) on delete cascade,
    total_hours numeric(12,2) not null default 0,
    total_cost numeric(14,2) not null default 0,
    peak_fte numeric(6,2) not null default 0,
    vendor_spend_pct numeric(5,2) not null default 0,
    readiness_score numeric(5,2) not null default 0,
    computed_at timestamptz not null default timezone('utc', now())
);

create table if not exists pm0.checklist_items (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references pm0.projects(id) on delete cascade,
    title text not null,
    owner uuid references pm0.profiles(id),
    status text not null default 'pending',
    due_date date,
    category text,
    created_at timestamptz not null default timezone('utc', now()),
    completed_at timestamptz
);

create table if not exists pm0.severity_thresholds (
    project_id uuid primary key references pm0.projects(id) on delete cascade,
    on_track numeric(5,2) not null default 0.05,
    watch numeric(5,2) not null default 0.15,
    at_risk numeric(5,2) not null default 0.3,
    critical numeric(5,2) not null default 0.5,
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists pm0.heatmap_cells (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references pm0.projects(id) on delete cascade,
    scenario_id uuid references pm0.scenarios(id) on delete cascade,
    month date not null,
    demand_hours integer not null,
    supply_hours integer not null,
    severity text not null,
    created_at timestamptz not null default timezone('utc', now()),
    unique(project_id, scenario_id, month)
);

create table if not exists pm0.activity_log (
    id bigint generated by default as identity primary key,
    project_id uuid references pm0.projects(id) on delete cascade,
    profile_id uuid references pm0.profiles(id),
    action text not null,
    entity text not null,
    entity_id uuid,
    payload jsonb,
    created_at timestamptz not null default timezone('utc', now())
);

create view pm0.project_monthly_capacity as
select
    ra.project_id,
    ra.month,
    sum(ra.planned_hours) as planned_hours,
    sum(ra.actual_hours) as actual_hours
from pm0.resource_allocations ra
join pm0.resources r on r.id = ra.resource_id
where r.active is true
group by 1,2;

create view pm0.scenario_results as
select
    s.id as scenario_id,
    s.project_id,
    coalesce(m.total_hours, 0) as total_hours,
    coalesce(m.total_cost, 0) as total_cost,
    coalesce(m.peak_fte, 0) as peak_fte,
    coalesce(m.vendor_spend_pct, 0) as vendor_spend_pct,
    coalesce(m.readiness_score, 0) as readiness_score,
    m.computed_at
from pm0.scenarios s
left join pm0.scenario_metrics m on m.scenario_id = s.id;

create or replace function pm0.is_org_member(org_id uuid)
returns boolean
language sql
security definer set search_path = public, pg_temp as
select exists (
    select 1
    from pm0.profiles p
    where p.organization_id = org_id
      and p.id = auth.uid()
);

grant execute on function pm0.is_org_member to authenticated;

grant usage on schema pm0 to authenticated;
grant select, insert, update, delete on all tables in schema pm0 to authenticated;
grant usage, select on all sequences in schema pm0 to authenticated;

create or replace function pm0.is_project_member(project_id uuid)
returns boolean
language sql
security definer set search_path = public, pg_temp as
select exists (
    select 1
    from pm0.project_members pm
    join pm0.profiles p on p.id = pm.profile_id
    where pm.project_id = project_id
      and p.id = auth.uid()
);

grant execute on function pm0.is_project_member to authenticated;

create or replace function pm0.recompute_scenario_kpis()
returns trigger
language plpgsql
security definer set search_path = public, pm0, pg_temp as
$$
declare
    baseline_hours numeric;
    vendor_hours numeric;
    peak numeric;
    readiness numeric;
begin
    -- placeholder deterministic calculations using assumptions jsonb
    baseline_hours := coalesce((new.assumptions->>'estimated_hours')::numeric, 0);
    vendor_hours := baseline_hours * coalesce((new.assumptions->>'vendor_mix_pct')::numeric, 0) / 100;
    peak := baseline_hours / greatest(coalesce((new.assumptions->>'duration_months')::numeric, 1), 1);
    readiness := coalesce((new.assumptions->>'readiness_weight')::numeric, 75);

    insert into pm0.scenario_metrics (scenario_id, total_hours, total_cost, peak_fte, vendor_spend_pct, readiness_score, computed_at)
    values (
        new.id,
        baseline_hours,
        coalesce((new.assumptions->>'blended_rate')::numeric, 175) * baseline_hours,
        peak / 160,
        case when baseline_hours = 0 then 0 else (vendor_hours / baseline_hours) * 100 end,
        readiness,
        timezone('utc', now())
    )
    on conflict (scenario_id) do update set
        total_hours = excluded.total_hours,
        total_cost = excluded.total_cost,
        peak_fte = excluded.peak_fte,
        vendor_spend_pct = excluded.vendor_spend_pct,
        readiness_score = excluded.readiness_score,
        computed_at = excluded.computed_at;

    return new;
end;
$$;

drop trigger if exists scenarios_recompute_kpis on pm0.scenarios;
create trigger scenarios_recompute_kpis
    after insert or update on pm0.scenarios
    for each row execute function pm0.recompute_scenario_kpis();

-- Row level security
alter table pm0.organizations enable row level security;
alter table pm0.profiles enable row level security;
alter table pm0.projects enable row level security;
alter table pm0.project_members enable row level security;
alter table pm0.roles enable row level security;
alter table pm0.resources enable row level security;
alter table pm0.resource_allocations enable row level security;
alter table pm0.scenarios enable row level security;
alter table pm0.scenario_metrics enable row level security;
alter table pm0.checklist_items enable row level security;
alter table pm0.severity_thresholds enable row level security;
alter table pm0.heatmap_cells enable row level security;
alter table pm0.activity_log enable row level security;

create policy "Profiles are self accessible" on pm0.profiles
for select using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Profiles organization members" on pm0.profiles
for select using (pm0.is_org_member(organization_id));

create policy "Projects membership read" on pm0.projects
for select using (pm0.is_project_member(id));

create policy "Projects insert" on pm0.projects
for insert with check (pm0.is_org_member(organization_id));

create policy "Projects update" on pm0.projects
for update using (pm0.is_project_member(id))
with check (pm0.is_project_member(id));

create policy "Projects delete" on pm0.projects
for delete using (pm0.is_project_member(id));

create policy "Project members read" on pm0.project_members
for select using (pm0.is_project_member(project_id));

create policy "Project members modify" on pm0.project_members
for all using (pm0.is_project_member(project_id))
with check (pm0.is_project_member(project_id));

create policy "Roles access" on pm0.roles
for all using (pm0.is_project_member(project_id))
with check (pm0.is_project_member(project_id));

create policy "Resources access" on pm0.resources
for all using (pm0.is_project_member(project_id))
with check (pm0.is_project_member(project_id));

create policy "Resource allocations access" on pm0.resource_allocations
for all using (pm0.is_project_member(project_id))
with check (pm0.is_project_member(project_id));

create policy "Scenarios access" on pm0.scenarios
for all using (pm0.is_project_member(project_id))
with check (pm0.is_project_member(project_id));

create policy "Scenario metrics access" on pm0.scenario_metrics
for all using (pm0.is_project_member((select project_id from pm0.scenarios where id = scenario_id)))
with check (pm0.is_project_member((select project_id from pm0.scenarios where id = scenario_id)));

create policy "Checklist access" on pm0.checklist_items
for all using (pm0.is_project_member(project_id))
with check (pm0.is_project_member(project_id));

create policy "Threshold access" on pm0.severity_thresholds
for all using (pm0.is_project_member(project_id))
with check (pm0.is_project_member(project_id));

create policy "Heatmap access" on pm0.heatmap_cells
for all using (pm0.is_project_member(project_id))
with check (pm0.is_project_member(project_id));


create policy "Activity log read" on pm0.activity_log
for select using (pm0.is_project_member(project_id));

create policy "Activity log insert" on pm0.activity_log
for insert with check (pm0.is_project_member(project_id));

comment on schema pm0 is 'PM0 application data schema';
comment on function pm0.recompute_scenario_kpis is 'Recalculate metrics whenever a scenario changes';

