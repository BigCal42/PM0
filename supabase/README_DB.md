# PM0 — Supabase Database Operator Guide

> Execution order: `schema.sql` → `rls.sql` → `rpc.sql` → (optional) `seed.sql`

## Local (Supabase CLI)
```bash
# initialize (once)
supabase init

# start local stack
supabase db start

# connection string for psql
DB_URL="$(supabase status --json | jq -r '.services.db.connectionString')"

# apply in order
psql "$DB_URL" -f supabase/schema.sql
psql "$DB_URL" -f supabase/rls.sql
psql "$DB_URL" -f supabase/rpc.sql

# optional demo data (edit seed user_id first if desired)
psql "$DB_URL" -f supabase/seed.sql
```

## Remote (Managed Supabase)
```bash
# set remote once (use the connection string from your Supabase project)
supabase db remote set 'postgres://USER:PASSWORD@HOST:PORT/postgres'

# either convert these SQLs to migrations and run:
supabase db push

# or apply the SQLs directly in order via psql:
psql "postgres://USER:PASSWORD@HOST:PORT/postgres" -f supabase/schema.sql
psql "postgres://USER:PASSWORD@HOST:PORT/postgres" -f supabase/rls.sql
psql "postgres://USER:PASSWORD@HOST:PORT/postgres" -f supabase/rpc.sql
psql "postgres://USER:PASSWORD@HOST:PORT/postgres" -f supabase/seed.sql  # optional
```

## Environment Variables (Vite SPA)

Add to your `.env.local` (names must match exactly):
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

Server-only contexts (never exposed to browser):
```
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

## Notes

- All tables have RLS enabled; access is granted only to project members.
- Use `project_members` to grant user access to a project. Insert the mapping `(project_id, user_id, role)`.
- RPCs `list_project_phases` and `compute_phase_gaps` power the heatmap/scenario views.
- The optional RPC `store_scenario_from_gaps` snapshots current gap results into `scenarios` + `scenario_results`.
- Seed data creates one organization and one demo project with M0–M7 phases and enough requirements/assignments to show gaps.
