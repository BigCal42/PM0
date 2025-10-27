# PM0 Knowledge Base v2.0

## Overview
PM0 is a planning workspace that helps healthcare transformation teams model Workday implementations. The platform blends Supabase-backed persistence with rich client-side analytics to let program managers forecast staffing gaps, simulate delivery approaches, and export executive-ready insights.

The solution is optimized for Vercel deployments using the Supabase hosted Postgres service. The application is written in TypeScript (React + Vite) and uses Tailwind for styling. State is coordinated through TanStack Query and Supabase client hooks, with optional demo-mode data for environments without Supabase connectivity.

## Domain Concepts
- **Organizations** map to Supabase auth tenants. Every authenticated user belongs to a single organization and can collaborate on projects within that tenant.
- **Projects** represent a Workday transformation initiative. Projects house scope assumptions, staffing plans, heatmap inputs, and scenario simulations.
- **Roles** capture job families (e.g., "Workstream Lead", "Change Manager") along with specialty tags and estimated rates.
- **Resources** represent individual contributors or vendor capacity pools. They are assigned to roles and tracked across months.
- **Scenarios** bundle estimation multipliers and readiness assumptions to produce projected staffing gaps.
- **Heatmaps** visualize month-by-month supply versus demand, highlighting severity levels.
- **Checklists** store readiness activities, owners, and statuses to maintain implementation hygiene.

## Feature Pillars
1. **Heatmap Resource Planning**
   - Monthly grid computed from baseline demand curves and resource availability.
   - Severity categories (On Track, Watch, At Risk, Critical) configurable per project.
   - Supports CSV import/export for bulk updates.

2. **Scenario Generator**
   - Five default templates (Baseline, Accelerated, Lean, Scope-Lite, High-Scope).
   - Each scenario adjusts effort multipliers, vendor mix, and timeline compression.
   - Results stored as JSONB `assumptions` and `results` for rich history.

3. **Estimation Engine**
   - Combines workload drivers (modules, data conversions, integrations) with vendor rate cards.
   - Outputs KPIs: Total Hours, Total Cost, Peak FTEs, Vendor Spend %, Readiness Score.
   - Backed by Supabase views to simplify client queries.

4. **Supabase Auth + RLS**
   - Email/password sign-in with magic link fallback.
   - Role Based Access Control enforced with row-level policies per table.
   - Service role used only for migrations and type generation.

5. **Demo & Offline Mode**
   - `/data` JSON fixtures mirror the Supabase schema for local prototyping.
   - Helper scripts generate deterministic scenarios and estimations.
   - Feature flag `VITE_USE_DEMO_DATA` toggles offline-first experience.

## Data Flow
1. User authenticates via Supabase, receiving session with `user.id` and organization profile.
2. Client fetches `project_members` to determine accessible projects and associated roles.
3. Heatmap page queries `project_monthly_capacity` view, merges with `scenario_results` to render grid.
4. Scenario creation posts to `scenarios` table, triggers function `recompute_scenario_kpis()` to populate derived metrics.
5. Exports leverage browser APIs; server interactions remain read/write through Supabase REST endpoints.

## Security & Compliance
- All tables enforce ownership via policies referencing `auth.uid()` and membership checks.
- Sensitive financial data restricted to members with `role IN ('ADMIN','FINANCE')`.
- Audit tables (`activity_log`) capture CRUD events.
- Backups triggered daily through Supabase scheduled backups.

## Operational Runbooks
- **Local Setup:** `npm install`, configure `.env` with Supabase keys, run `npm run dev`.
- **Type Generation:** `scripts/typegen.sh <PROJECT_REF>` updates `src/types/database.ts`.
- **Migrations:** Apply via `supabase db reset` locally or CI deploy pipeline.
- **QA:** Playwright smoke pack under `/tests` ensures core flows remain intact.
- **Demo Data:** Run `npm run generate:scenarios` to refresh fixtures from `/data` seeds.

## Change History Highlights
- v2.0 introduces Scenario Generator revamp, modular heatmap severity thresholds, and expanded KPI exports.
- RLS tightened to prevent cross-project reads for aggregated views.
- Added readiness checklist module with Supabase `checklist_items` table and policies.

## Glossary
- **FTE:** Full-time equivalent (40 hours/week normalized).
- **RLS:** Row-Level Security.
- **KPI:** Key Performance Indicator.
- **Scenario Severity:** Weighted score derived from staffing deficit magnitude.

## Contact & Support
- Engineering: `#pm0-dev` Slack channel.
- Product: `pm0-product@acmehealth.com`.
- Operations: `pm0-ops@acmehealth.com`.
