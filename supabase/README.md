# Supabase Database Toolkit

This directory contains the full Postgres schema, row-level security policies, and demo seed data that power PM0.

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) `>= 1.170`
- Access token with rights to your Supabase project (set `SUPABASE_ACCESS_TOKEN`)
- `SUPABASE_PROJECT_REF` for the workspace you want to target

## Applying the schema

From the project root:

```bash
supabase migration up
```

The command applies every SQL file inside `supabase/migrations/` in timestamp order. If you are starting from scratch you can reset the local database and seed demo data in a single step:

```bash
supabase db reset --seed supabase/seed/000_demo_seed.sql
```

To run the seed against an existing database without dropping objects:

```bash
supabase db seed --file supabase/seed/000_demo_seed.sql
```

> **Note**
> The seed references deterministic UUIDs so it can be safely re-run; it will upsert rather than duplicate data.

## Type generation

After applying migrations, generate strongly-typed TypeScript bindings using the helper script:

```bash
SUPABASE_PROJECT_REF=your-ref ./scripts/typegen.sh
```

This script writes `src/types/database.ts`, which is consumed by the front-end Supabase client.

## Demo mode

The seed data populates a "Demo Workday Transformation" project with sample roles, allocations, KPI snapshots, and readiness checklist items. When `VITE_USE_DEMO_DATA=true`, the UI can consume this dataset without requiring real credentials.

