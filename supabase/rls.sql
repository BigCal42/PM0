-- PM0 RLS Policies (Enable after schema.sql)
-- Deny by default; allow only if the user is a member of the target project.

-- Enable RLS on all relevant tables
alter table public.organizations enable row level security;
alter table public.projects      enable row level security;
alter table public.project_members enable row level security;
alter table public.phases        enable row level security;
alter table public.roles         enable row level security;
alter table public.resources     enable row level security;
alter table public.requirements  enable row level security;
alter table public.assignments   enable row level security;
alter table public.scenarios     enable row level security;
alter table public.scenario_results enable row level security;

-- Helper: check if auth user is a member of the given project
create or replace function public.is_project_member(p_project_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.project_members pm
    where pm.project_id = p_project_id
      and pm.user_id = auth.uid()
  );
$$;

-- Helper: check if auth user is within a project's organization via membership
-- (Membership table is authoritative; projects select policy uses membership)
-- You may extend with org-level roles later if needed.

-- PROJECTS
drop policy if exists projects_select on public.projects;
create policy projects_select on public.projects
for select
using (
  projects.created_by = auth.uid()
  or exists (
    select 1
    from public.project_members pm
    where pm.project_id = projects.id
      and pm.user_id = auth.uid()
  )
);

drop policy if exists projects_insert on public.projects;
create policy projects_insert on public.projects
for insert
with check (created_by = auth.uid());

drop policy if exists projects_update on public.projects;
create policy projects_update on public.projects
for update
using (
  created_by = auth.uid()
  or exists (
    select 1 from public.project_members pm
    where pm.project_id = projects.id
      and pm.user_id = auth.uid()
      and pm.role in ('owner','admin')
  )
)
with check (
  created_by = auth.uid()
  or exists (
    select 1 from public.project_members pm
    where pm.project_id = projects.id
      and pm.user_id = auth.uid()
      and pm.role in ('owner','admin')
  )
);

drop policy if exists projects_delete on public.projects;
create policy projects_delete on public.projects
for delete
using (
  created_by = auth.uid()
  or exists (
    select 1 from public.project_members pm
    where pm.project_id = projects.id
      and pm.user_id = auth.uid()
      and pm.role in ('owner')
  )
);

-- PROJECT MEMBERS (only project members with admin/owner can manage membership)
drop policy if exists project_members_select on public.project_members;
create policy project_members_select on public.project_members
for select
using (public.is_project_member(project_id));

drop policy if exists project_members_mutate on public.project_members;
create policy project_members_mutate on public.project_members
for update using (
  exists (
    select 1 from public.project_members pm
    where pm.project_id = project_members.project_id
      and pm.user_id = auth.uid()
      and pm.role in ('owner','admin')
  )
)
with check (
  exists (
    select 1 from public.project_members pm
    where pm.project_id = project_members.project_id
      and pm.user_id = auth.uid()
      and pm.role in ('owner','admin')
  )
);

drop policy if exists project_members_delete on public.project_members;
create policy project_members_delete on public.project_members
for delete using (
  exists (
    select 1 from public.project_members pm
    where pm.project_id = project_members.project_id
      and pm.user_id = auth.uid()
      and pm.role in ('owner','admin')
  )
);

drop policy if exists project_members_insert_initial on public.project_members;
create policy project_members_insert_initial on public.project_members
for insert
with check (
  (
    project_members.user_id = auth.uid()
    and exists (
      select 1
      from public.projects p
      where p.id = project_members.project_id
        and p.created_by = auth.uid()
    )
    and not exists (
      select 1
      from public.project_members pm
      where pm.project_id = project_members.project_id
    )
  )
  or exists (
    select 1
    from public.project_members pm
    where pm.project_id = project_members.project_id
      and pm.user_id = auth.uid()
      and pm.role in ('owner','admin')
  )
);

-- PHASES / ROLES / RESOURCES / REQUIREMENTS / ASSIGNMENTS
-- Common policy: members of the project can read/write rows within that project
create or replace function public.row_is_visible_to_member(p_project_id uuid)
returns boolean language sql stable as $$
  select public.is_project_member(p_project_id);
$$;

-- Generic helpers to cut repetition:
-- SELECT
drop policy if exists phases_select on public.phases;
create policy phases_select on public.phases
for select using (public.row_is_visible_to_member(project_id));
drop policy if exists roles_select on public.roles;
create policy roles_select on public.roles
for select using (public.row_is_visible_to_member(project_id));
drop policy if exists resources_select on public.resources;
create policy resources_select on public.resources
for select using (public.row_is_visible_to_member(project_id));
drop policy if exists requirements_select on public.requirements;
create policy requirements_select on public.requirements
for select using (public.row_is_visible_to_member(project_id));
drop policy if exists assignments_select on public.assignments;
create policy assignments_select on public.assignments
for select using (public.row_is_visible_to_member(project_id));
drop policy if exists scenarios_select on public.scenarios;
create policy scenarios_select on public.scenarios
for select using (public.row_is_visible_to_member(project_id));
drop policy if exists scenario_results_select on public.scenario_results;
create policy scenario_results_select on public.scenario_results
for select using (
  exists (
    select 1 from public.scenarios s
    join public.project_members pm on pm.project_id = s.project_id
    where s.id = scenario_results.scenario_id
      and pm.user_id = auth.uid()
  )
);

-- INSERT/UPDATE/DELETE (allow members; tighten later if needed)
drop policy if exists phases_mutate on public.phases;
create policy phases_mutate on public.phases
for all using (public.row_is_visible_to_member(project_id))
with check (public.row_is_visible_to_member(project_id));

drop policy if exists roles_mutate on public.roles;
create policy roles_mutate on public.roles
for all using (public.row_is_visible_to_member(project_id))
with check (public.row_is_visible_to_member(project_id));

drop policy if exists resources_mutate on public.resources;
create policy resources_mutate on public.resources
for all using (public.row_is_visible_to_member(project_id))
with check (public.row_is_visible_to_member(project_id));

drop policy if exists requirements_mutate on public.requirements;
create policy requirements_mutate on public.requirements
for all using (public.row_is_visible_to_member(project_id))
with check (public.row_is_visible_to_member(project_id));

drop policy if exists assignments_mutate on public.assignments;
create policy assignments_mutate on public.assignments
for all using (public.row_is_visible_to_member(project_id))
with check (public.row_is_visible_to_member(project_id));

drop policy if exists scenarios_mutate on public.scenarios;
create policy scenarios_mutate on public.scenarios
for all using (public.row_is_visible_to_member(project_id))
with check (public.row_is_visible_to_member(project_id));

drop policy if exists scenario_results_mutate on public.scenario_results;
create policy scenario_results_mutate on public.scenario_results
for all using (
  exists (
    select 1 from public.scenarios s
    join public.project_members pm on pm.project_id = s.project_id
    where s.id = scenario_results.scenario_id
      and pm.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.scenarios s
    join public.project_members pm on pm.project_id = s.project_id
    where s.id = scenario_results.scenario_id
      and pm.user_id = auth.uid()
  )
);
