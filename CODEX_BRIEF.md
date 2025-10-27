# PM0 — Codex Engineering Brief (Track A: Vercel + Supabase + React/Vite/TS)

## Mission
Produce an enterprise-grade, secure, and cost-effective PM0 application that enables healthcare teams to plan Workday transformations, analyze staffing gaps, and run scenario modeling with repeatable frameworks.

## Core Objectives (v2 Scope)
1) Heatmap resource planning (roles/resources, month grid, severity logic)
2) Scenario Generator (Baseline, Accelerated, Lean, Scope-Lite, High-Scope) with multipliers
3) Estimation Engine inputs (see `/docs` and `/supabase/migrations`) and KPI metrics
4) CSV import/export (roles/resources/gaps/scenarios)
5) Readiness checklist, KPI cards, executive exports
6) Supabase Auth + RLS across all tables (users/projects isolation)

## Tech & Deployment
- Frontend: React 18 + Vite + TypeScript + Tailwind
- State/Server: TanStack Query
- DB: Supabase (Postgres + RLS) — schema + seed in `/supabase`
- Hosting: Vercel (`vercel.json` SPA routes) — env vars via Vercel dashboard

## Guardrails
- No server-side secrets in client; never expose service role
- Enforce RLS coverage for all tables; ANON key only
- Maintain type-safety and runtime validation (Zod where needed)
- Keep bundle small (code-split heavy views; lazy load exports/csv)
- Accessibility: target WCAG AA for components

## Tasks for Codex (Initial Sprint)
- [ ] Wire Supabase Auth UI (email/password)
- [ ] Implement roles/resources CRUD against Supabase (keep demo mode fallback)
- [ ] Heatmap performance pass (memoization + virtualized rows when > 200 cells)
- [ ] Scenario save/compare with `assumptions/results` JSONB
- [ ] Export Center: PNG for heatmap, PDF for scenario compare, CSVs
- [ ] Add basic Playwright flows to CI (create project → add role/resource → view heatmap)
- [ ] Generate DB types via `scripts/typegen.sh <PROJECT_REF>` → `src/types/database.ts`
- [ ] Integrate vendor_catalog_rates into Estimation Engine (cost guidance in KPI)
- [ ] Add feature flags: `VITE_USE_DEMO_DATA`

## Environments
- Local: `npm run dev`
- CI: GitHub Actions (`.github/workflows/ci.yml`)
- Release: semantic-release workflow (`.github/workflows/release.yml`)
- Deployment: Import to Vercel; set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## References
- `/docs/PM0_Knowledge_Base_v2.0.md` — Product + technical corpus
- `/docs/*` — Diff summary, changelog, traceability, open questions
- `/supabase/migrations` — Full schema and RLS
- `/data/*` + `/scripts/generate_demo_scenarios.ts` — Demo harness
- `/tests/*` + QA/CI pack — Smoke test scaffolding

---
Deliver PRs as small, reviewable increments; maintain Conventional Commits.
