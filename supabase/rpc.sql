-- PM0 RPCs (Deterministic, RLS-honoring)

-- 1) List phases for a project (ordered)
create or replace function public.list_project_phases(p_project_id uuid)
returns table (
  phase_id uuid,
  phase_name text,
  sort_order int
)
language sql
stable
security invoker
as $$
  select ph.id, ph.name, ph.sort_order
  from public.phases ph
  where ph.project_id = p_project_id
  order by ph.sort_order nulls last, ph.name;
$$;

-- 2) Compute gaps for a project by (phase, role)
create or replace function public.compute_phase_gaps(p_project_id uuid)
returns table (
  phase_id uuid,
  phase_name text,
  role_id uuid,
  role_name text,
  required numeric,
  assigned numeric,
  gap numeric
)
language sql
stable
security invoker
as $$
  with req as (
    select r.phase_id, r.role_id, coalesce(sum(r.required_capacity_pct),0)::numeric as required
    from public.requirements r
    where r.project_id = p_project_id
    group by r.phase_id, r.role_id
  ),
  asg as (
    select a.phase_id, a.role_id, coalesce(sum(a.allocation_pct),0)::numeric as assigned
    from public.assignments a
    where a.project_id = p_project_id
    group by a.phase_id, a.role_id
  )
  select
    ph.id as phase_id,
    ph.name as phase_name,
    ro.id as role_id,
    ro.name as role_name,
    coalesce(req.required,0) / 100.0 as required,
    coalesce(asg.assigned,0) / 100.0 as assigned,
    (coalesce(req.required,0) - coalesce(asg.assigned,0)) / 100.0 as gap
  from public.phases ph
  cross join public.roles ro
  left join req on req.phase_id = ph.id and req.role_id = ro.id
  left join asg on asg.phase_id = ph.id and asg.role_id = ro.id
  where ph.project_id = p_project_id
    and ro.project_id = p_project_id
  order by ph.sort_order nulls last, ro.name;
$$;

-- 3) Optional snapshot: store a scenario from current gaps (opt-in)
create or replace function public.store_scenario_from_gaps(p_project_id uuid, p_name text)
returns uuid
language plpgsql
security invoker
as $$
declare
  v_scenario_id uuid := gen_random_uuid();
begin
  insert into public.scenarios (id, project_id, name, description, created_by)
  values (v_scenario_id, p_project_id, coalesce(p_name, 'Snapshot'), jsonb_build_object('source','compute_phase_gaps'), auth.uid());

  insert into public.scenario_results (scenario_id, phase_id, role_id, required, assigned, gap)
  select v_scenario_id, g.phase_id, g.role_id, g.required, g.assigned, g.gap
  from public.compute_phase_gaps(p_project_id) g;

  return v_scenario_id;
end;
$$;
