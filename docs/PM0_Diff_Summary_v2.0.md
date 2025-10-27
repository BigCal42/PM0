# PM0 v2.0 Diff Summary

## Frontend
- Migrated from bespoke state stores to TanStack Query for Supabase caching.
- Added scenario compare view with lazy-loaded chart modules.
- Implemented new readiness checklist panel with filterable status chips.
- Refined heatmap rendering using windowed virtualization for >200 cells.

## Backend (Supabase)
- Introduced `scenario_results` materialized view for KPI hydration.
- Added comprehensive RLS for `projects`, `roles`, `resources`, and `scenarios`.
- Created `recompute_scenario_kpis()` function invoked on scenario mutations.
- Added audit triggers for critical tables.

## Tooling & Ops
- Added Playwright smoke-pack aligned with CI configuration.
- Introduced `scripts/generate_demo_scenarios.ts` to seed deterministic scenario data.
- Expanded demo fixtures under `/data` to align with Supabase schema.

## Security
- Enforced strict policy that only project members can read/write resources.
- Added finance-only constraints for cost-sensitive views.
- Hardened Supabase storage bucket rules for export artifacts.

## Known Regressions
- None identified in v2.0 diff testing.

## Rollout Notes
- Requires Supabase migration `202403200001_init.sql`.
- Regenerate database types post-migration.
- Ensure `.env` includes `VITE_USE_DEMO_DATA=false` in production.
