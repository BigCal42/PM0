-- Demo seed data for PM0
insert into pm0.organizations (id, name, plan)
values ('11111111-2222-3333-4444-555555555555', 'Acme Health', 'enterprise')
on conflict (id) do nothing;

insert into auth.users (id, email)
values ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'demo@acmehealth.com')
on conflict (id) do nothing;

insert into pm0.profiles (id, organization_id, email, full_name, role)
values (
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    '11111111-2222-3333-4444-555555555555',
    'demo@acmehealth.com',
    'Demo PM',
    'ADMIN'
)
on conflict (id) do update set full_name = excluded.full_name;

insert into pm0.projects (id, organization_id, code, name, start_month, end_month, status, created_by)
values (
    '99999999-8888-7777-6666-555555555555',
    '11111111-2222-3333-4444-555555555555',
    'orion',
    'Orion Workday Transformation',
    '2024-01-01',
    '2024-12-01',
    'active',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
)
on conflict (id) do update set name = excluded.name;

insert into pm0.project_members (project_id, profile_id, project_role)
values (
    '99999999-8888-7777-6666-555555555555',
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    'OWNER'
)
on conflict (project_id, profile_id) do update set project_role = excluded.project_role;

insert into pm0.roles (id, project_id, name, category, rate)
values
    ('10101010-aaaa-bbbb-cccc-111111111111', '99999999-8888-7777-6666-555555555555', 'Project Manager', 'Leadership', 195.00),
    ('20202020-bbbb-cccc-dddd-222222222222', '99999999-8888-7777-6666-555555555555', 'Change Manager', 'Change', 180.00),
    ('30303030-cccc-dddd-eeee-333333333333', '99999999-8888-7777-6666-555555555555', 'Integration Lead', 'Technical', 210.00)
on conflict (id) do update set rate = excluded.rate;

insert into pm0.resources (id, project_id, role_id, name, vendor, fte_capacity, cost_rate)
values
    ('40404040-dddd-eeee-ffff-444444444444', '99999999-8888-7777-6666-555555555555', '10101010-aaaa-bbbb-cccc-111111111111', 'Jamie Rivera', null, 1.0, 190.00),
    ('50505050-eeee-ffff-0000-555555555555', '99999999-8888-7777-6666-555555555555', '20202020-bbbb-cccc-dddd-222222222222', 'Taylor Singh', null, 0.8, 175.00),
    ('60606060-ffff-0000-1111-666666666666', '99999999-8888-7777-6666-555555555555', '30303030-cccc-dddd-eeee-333333333333', 'Northwind Integrations', 'Northwind', 1.0, 220.00)
on conflict (id) do update set name = excluded.name;

insert into pm0.resource_allocations (id, resource_id, project_id, month, planned_hours, actual_hours)
values
    ('70707070-0000-1111-2222-777777777777', '40404040-dddd-eeee-ffff-444444444444', '99999999-8888-7777-6666-555555555555', '2024-01-01', 160, 150),
    ('80808080-1111-2222-3333-888888888888', '50505050-eeee-ffff-0000-555555555555', '99999999-8888-7777-6666-555555555555', '2024-01-01', 128, 120),
    ('90909090-2222-3333-4444-999999999999', '60606060-ffff-0000-1111-666666666666', '99999999-8888-7777-6666-555555555555', '2024-01-01', 172, 172)
on conflict (id) do nothing;

insert into pm0.scenarios (id, project_id, name, template, assumptions, is_baseline, created_by)
values
    ('abcdabcd-0000-1111-2222-abcdefabcdef', '99999999-8888-7777-6666-555555555555', 'Baseline FY24', 'baseline', jsonb_build_object(
        'estimated_hours', 5200,
        'vendor_mix_pct', 35,
        'duration_months', 12,
        'blended_rate', 185,
        'readiness_weight', 82
    ), true, 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee')
on conflict (id) do update set name = excluded.name;

insert into pm0.scenario_metrics (scenario_id, total_hours, total_cost, peak_fte, vendor_spend_pct, readiness_score)
values ('abcdabcd-0000-1111-2222-abcdefabcdef', 5200, 962000, 2.7, 35, 82)
on conflict (scenario_id) do update set total_hours = excluded.total_hours;

insert into pm0.heatmap_cells (id, project_id, scenario_id, month, demand_hours, supply_hours, severity)
values
    ('aaaa1111-bbbb-2222-cccc-3333dddd4444', '99999999-8888-7777-6666-555555555555', 'abcdabcd-0000-1111-2222-abcdefabcdef', '2024-01-01', 520, 460, 'watch'),
    ('eeee5555-ffff-6666-0000-7777aaaa8888', '99999999-8888-7777-6666-555555555555', 'abcdabcd-0000-1111-2222-abcdefabcdef', '2024-02-01', 430, 470, 'on_track')
on conflict (id) do update set severity = excluded.severity;

insert into pm0.checklist_items (id, project_id, title, owner, status, due_date, category)
values
    ('1111aaaa-2222-bbbb-3333-cccc4444dddd', '99999999-8888-7777-6666-555555555555', 'Confirm Workday tenant provisioning', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'in_progress', '2024-02-15', 'Readiness'),
    ('5555eeee-6666-ffff-7777-0000aaaa1111', '99999999-8888-7777-6666-555555555555', 'Finalize integration design workshop', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'pending', '2024-03-05', 'Integration')
on conflict (id) do update set status = excluded.status;

insert into pm0.activity_log (project_id, profile_id, action, entity, entity_id, payload)
values
    ('99999999-8888-7777-6666-555555555555', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'CREATE', 'scenario', 'abcdabcd-0000-1111-2222-abcdefabcdef', jsonb_build_object('name', 'Baseline FY24'))
on conflict do nothing;
