-- pm0 core schema, relationships, and RLS policies
-- generated for Supabase/Postgres

set check_function_bodies = off;

create extension if not exists pgcrypto with schema public;

set search_path = public;

create table public.profiles (
    user_id uuid primary key,
    email text not null,
    full_name text,
    avatar_url text,
    timezone text default 'UTC',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create unique index profiles_email_key on public.profiles (email);

create table public.projects (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    status text not null default 'active' check (status in ('active','archived')),
    start_month date,
    end_month date,
    created_by uuid not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create index projects_created_by_idx on public.projects (created_by);

create table public.project_members (
    project_id uuid not null references public.projects(id) on delete cascade,
    user_id uuid not null,
    role text not null default 'member' check (role in ('owner','admin','member','viewer')),
    invited_by uuid,
    created_at timestamptz default now(),
    primary key (project_id, user_id)
);

create index project_members_user_idx on public.project_members (user_id);

create table public.role_definitions (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references public.projects(id) on delete cascade,
    name text not null,
    discipline text,
    workstream text,
    severity_level integer not null default 1 check (severity_level between 1 and 5),
    fte_required numeric(6,2) not null default 0,
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create index role_definitions_project_idx on public.role_definitions (project_id);
create index role_definitions_severity_idx on public.role_definitions (project_id, severity_level);

create table public.resources (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references public.projects(id) on delete cascade,
    role_id uuid references public.role_definitions(id) on delete set null,
    full_name text not null,
    email text,
    vendor text,
    cost_center text,
    availability numeric(5,2) not null default 1,
    hourly_rate numeric(10,2),
    currency text not null default 'USD',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create index resources_project_idx on public.resources (project_id);
create index resources_role_idx on public.resources (project_id, role_id);

create table public.resource_allocations (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references public.projects(id) on delete cascade,
    resource_id uuid not null references public.resources(id) on delete cascade,
    role_id uuid references public.role_definitions(id) on delete set null,
    month date not null,
    allocation_hours numeric(7,2) not null default 0,
    severity_level integer not null default 1 check (severity_level between 1 and 5),
    status text not null default 'planned' check (status in ('planned','committed','actual')),
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique (resource_id, month)
);

create index resource_allocations_project_month_idx on public.resource_allocations (project_id, month);

create table public.scenarios (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references public.projects(id) on delete cascade,
    name text not null,
    summary text,
    scenario_type text not null default 'custom' check (scenario_type in ('baseline','accelerated','lean','scope-lite','high-scope','custom')),
    assumptions jsonb not null default '{}'::jsonb,
    results jsonb not null default '{}'::jsonb,
    is_primary boolean not null default false,
    created_by uuid not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create unique index scenarios_primary_idx on public.scenarios (project_id) where is_primary;

create table public.scenario_timeframes (
    id uuid primary key default gen_random_uuid(),
    scenario_id uuid not null references public.scenarios(id) on delete cascade,
    month date not null,
    demand_multiplier numeric(6,2) not null default 1,
    supply_multiplier numeric(6,2) not null default 1,
    notes text,
    created_at timestamptz default now(),
    unique (scenario_id, month)
);

create table public.estimation_inputs (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references public.projects(id) on delete cascade,
    category text not null,
    input_key text not null,
    value numeric(12,2),
    unit text,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique (project_id, category, input_key)
);

create index estimation_inputs_project_idx on public.estimation_inputs (project_id, category);

create table public.kpi_snapshots (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references public.projects(id) on delete cascade,
    scenario_id uuid references public.scenarios(id) on delete set null,
    metrics jsonb not null default '{}'::jsonb,
    recorded_for date,
    created_at timestamptz default now()
);

create index kpi_snapshots_project_idx on public.kpi_snapshots (project_id, recorded_for);

create table public.readiness_checklist_items (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references public.projects(id) on delete cascade,
    category text,
    item text not null,
    status text not null default 'not_started' check (status in ('not_started','in_progress','blocked','complete')),
    owner text,
    owner_id uuid,
    due_date date,
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create index readiness_checklist_project_idx on public.readiness_checklist_items (project_id, status);

create table public.vendor_catalog_rates (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references public.projects(id) on delete cascade,
    vendor_name text not null,
    service text not null,
    rate_type text not null check (rate_type in ('hourly','daily','weekly','monthly','fixed')),
    rate numeric(12,2) not null,
    currency text not null default 'USD',
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz default now()
);

create index vendor_catalog_rates_project_idx on public.vendor_catalog_rates (project_id, vendor_name);

create table public.import_jobs (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references public.projects(id) on delete cascade,
    job_type text not null,
    status text not null default 'pending' check (status in ('pending','running','complete','failed')),
    payload jsonb not null default '{}'::jsonb,
    error text,
    created_at timestamptz default now(),
    completed_at timestamptz
);

create index import_jobs_project_idx on public.import_jobs (project_id, job_type);

-- helper functions
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.handle_new_project()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.project_members (project_id, user_id, role, invited_by)
  values (new.id, new.created_by, 'owner', new.created_by)
  on conflict (project_id, user_id) do update set role = excluded.role;
  return new;
end;
$$;

create or replace function public.is_project_member(target_project uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.project_members m
    where m.project_id = target_project
      and m.user_id = auth.uid()
  );
$$;

create or replace function public.is_project_admin(target_project uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.project_members m
    where m.project_id = target_project
      and m.user_id = auth.uid()
      and m.role in ('owner', 'admin')
  );
$$;

-- triggers
create trigger projects_set_timestamp
before update on public.projects
for each row execute function public.set_updated_at();

create trigger role_definitions_set_timestamp
before update on public.role_definitions
for each row execute function public.set_updated_at();

create trigger resources_set_timestamp
before update on public.resources
for each row execute function public.set_updated_at();

create trigger resource_allocations_set_timestamp
before update on public.resource_allocations
for each row execute function public.set_updated_at();

create trigger scenarios_set_timestamp
before update on public.scenarios
for each row execute function public.set_updated_at();

create trigger estimation_inputs_set_timestamp
before update on public.estimation_inputs
for each row execute function public.set_updated_at();

create trigger readiness_checklist_set_timestamp
before update on public.readiness_checklist_items
for each row execute function public.set_updated_at();

create trigger handle_project_owner
after insert on public.projects
for each row execute function public.handle_new_project();

-- grants
grant usage on schema public to postgres, anon, authenticated, service_role;

-- enable RLS
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.role_definitions enable row level security;
alter table public.resources enable row level security;
alter table public.resource_allocations enable row level security;
alter table public.scenarios enable row level security;
alter table public.scenario_timeframes enable row level security;
alter table public.estimation_inputs enable row level security;
alter table public.kpi_snapshots enable row level security;
alter table public.readiness_checklist_items enable row level security;
alter table public.vendor_catalog_rates enable row level security;
alter table public.import_jobs enable row level security;

-- profile policies
create policy "Users can read own profile" on public.profiles
for select using (auth.uid() = user_id);

create policy "Users can insert own profile" on public.profiles
for insert with check (auth.uid() = user_id);

create policy "Users can update own profile" on public.profiles
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- project policies
create policy "Members can view projects" on public.projects
for select using (public.is_project_member(id));

create policy "Creators can insert projects" on public.projects
for insert with check (auth.uid() = created_by);

create policy "Admins can update projects" on public.projects
for update using (public.is_project_admin(id)) with check (public.is_project_admin(id));

create policy "Admins can delete projects" on public.projects
for delete using (public.is_project_admin(id));

-- project member policies
create policy "Members can view project membership" on public.project_members
for select using (public.is_project_member(project_id));

create policy "Admins manage membership" on public.project_members
for insert with check (public.is_project_admin(project_id));

create policy "Admins update membership" on public.project_members
for update using (public.is_project_admin(project_id)) with check (public.is_project_admin(project_id));

create policy "Admins remove membership" on public.project_members
for delete using (public.is_project_admin(project_id)) or (auth.uid() = user_id);

-- role definition policies
create policy "Members can view role definitions" on public.role_definitions
for select using (public.is_project_member(project_id));

create policy "Admins manage role definitions" on public.role_definitions
for all using (public.is_project_admin(project_id)) with check (public.is_project_admin(project_id));

-- resource policies
create policy "Members can view resources" on public.resources
for select using (public.is_project_member(project_id));

create policy "Admins manage resources" on public.resources
for all using (public.is_project_admin(project_id)) with check (public.is_project_admin(project_id));

-- allocation policies
create policy "Members can view allocations" on public.resource_allocations
for select using (public.is_project_member(project_id));

create policy "Admins manage allocations" on public.resource_allocations
for all using (public.is_project_admin(project_id)) with check (public.is_project_admin(project_id));

-- scenario policies
create policy "Members can view scenarios" on public.scenarios
for select using (public.is_project_member(project_id));

create policy "Members can create scenarios" on public.scenarios
for insert with check (public.is_project_member(project_id));

create policy "Members can update scenarios" on public.scenarios
for update using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));

create policy "Admins can delete scenarios" on public.scenarios
for delete using (public.is_project_admin(project_id));

-- scenario timeframe policies
create policy "Members can view scenario timeframes" on public.scenario_timeframes
for select using (
  exists (
    select 1 from public.scenarios s
    where s.id = scenario_id and public.is_project_member(s.project_id)
  )
);

create policy "Members manage scenario timeframes" on public.scenario_timeframes
for all using (
  exists (
    select 1 from public.scenarios s
    where s.id = scenario_id and public.is_project_member(s.project_id)
  )
) with check (
  exists (
    select 1 from public.scenarios s
    where s.id = scenario_id and public.is_project_member(s.project_id)
  )
);

-- estimation input policies
create policy "Members can view estimation inputs" on public.estimation_inputs
for select using (public.is_project_member(project_id));

create policy "Admins manage estimation inputs" on public.estimation_inputs
for all using (public.is_project_admin(project_id)) with check (public.is_project_admin(project_id));

-- KPI snapshot policies
create policy "Members can view KPI snapshots" on public.kpi_snapshots
for select using (public.is_project_member(project_id));

create policy "Admins can insert KPI snapshots" on public.kpi_snapshots
for insert with check (public.is_project_admin(project_id));

create policy "Admins can delete KPI snapshots" on public.kpi_snapshots
for delete using (public.is_project_admin(project_id));

-- readiness checklist policies
create policy "Members can view readiness checklist" on public.readiness_checklist_items
for select using (public.is_project_member(project_id));

create policy "Members can upsert readiness checklist" on public.readiness_checklist_items
for all using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));

-- vendor catalog policies
create policy "Members can view vendor rates" on public.vendor_catalog_rates
for select using (public.is_project_member(project_id));

create policy "Admins manage vendor rates" on public.vendor_catalog_rates
for all using (public.is_project_admin(project_id)) with check (public.is_project_admin(project_id));

-- import job policies
create policy "Members can view import jobs" on public.import_jobs
for select using (public.is_project_member(project_id));

create policy "Admins manage import jobs" on public.import_jobs
for all using (public.is_project_admin(project_id)) with check (public.is_project_admin(project_id));

