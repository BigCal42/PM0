# PM0 Repository Knowledge Base

_Last updated: 2025-10-27 16:57:13Z_

## 1. Repository Overview
- **Project name:** PM0 v2 Extended Starter Repo (Track A). [Source](README.md)
- **Primary technologies intended:** Vercel deployment, Supabase backend, React 18 with Vite and TypeScript, Tailwind CSS. [Source](CODEX_BRIEF.md; README.md)
- **Current branch:** `work` (see `git status`).
- **Commit history:** Single commit `775f655 Add files via upload` — represents the initial import of this starter bundle.

## 2. Current File & Directory Inventory
The repository currently contains configuration and documentation scaffolding but no application source files under `src/`.

| Path | Purpose |
| --- | --- |
| `index.html` | Mount point for the React SPA and entry to `/src/main.tsx` (not yet present). |
| `package.json` | Defines project metadata, runtime dependencies (React, Supabase client, TanStack Query, Zustand, Zod, Lucide icons, classnames) and tooling scripts (Vite dev/build, ESLint, TypeScript typecheck). |
| `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.cjs` | Front-end build and styling configuration. |
| `playwright.config.ts` | End-to-end testing scaffold pointing to `./tests` (tests folder not present). |
| `vercel.json` | SPA routing configuration for Vercel deployment. |
| `README.md`, `CHANGELOG.md`, `CODEX_BRIEF.md`, `SUPER_BUNDLE_README.md`, `README_RELEASE_PACK.md`, `UPLOAD_TO_CODEX.md` | Documentation covering mission objectives, release process, upload instructions, and placeholder changelog. |
| `.env.example` | Placeholder for required environment variables. |

### Missing Expected Assets
The documentation references several directories that are not included in the current tree (e.g., `/src`, `/docs`, `/supabase`, `/data`, `/scripts`, `/tests`). These will need to be created or restored to implement product features described in the brief.

## 3. Tooling & Configuration Highlights
- **Vite dev server:** runs on port 5173 with React plugin and build sourcemaps enabled. [Source](vite.config.ts)
- **TypeScript compiler:** strict mode targeting ES2020, React JSX transform, path alias `@/*` -> `src/*`. [Source](tsconfig.json)
- **Tailwind CSS:** scans `index.html` and future `src/**/*.{ts,tsx}` files. [Source](tailwind.config.js)
- **PostCSS:** loads Tailwind and Autoprefixer plugins. [Source](postcss.config.cjs)
- **Playwright tests:** configured to launch the Vite dev server automatically; tests expected in `./tests`. [Source](playwright.config.ts)
- **Deployment:** `vercel.json` routes all requests to `index.html` to support SPA behavior. [Source](vercel.json)
- **Release automation:** `README_RELEASE_PACK.md` instructs using semantic-release with Conventional Commits for versioning and changelog updates.

## 4. Documentation Summary
- **Mission & scope:** CODEX brief outlines enterprise-grade PM0 application goals, core v2 features (heatmap planning, scenario generator, estimation engine, CSV I/O, readiness checklist, Supabase auth). [Source](CODEX_BRIEF.md)
- **Initial sprint task list:** Contains nine unchecked tasks covering auth, CRUD integration, performance tuning, export center, E2E tests, DB type generation, estimation logic, and feature flagging. [Source](CODEX_BRIEF.md)
- **Release guidance:** README_RELEASE_PACK.md explains semantic-release setup and usage expectations.
- **Upload instructions:** UPLOAD_TO_CODEX.md covers steps for importing the bundle, configuring env vars, seeding demo data, and CI expectations.

## 5. Current Status Assessment
- **Application code:** Not present. The `index.html` references `/src/main.tsx`, but no `src/` directory or React components exist yet; project cannot run beyond serving an empty root element.
- **Testing:** No tests available; Playwright config references non-existent `tests` directory.
- **Database & schema assets:** Mentioned in brief (`/supabase/migrations`) but currently absent.
- **Demo data & scripts:** Referenced directories (`/data`, `/scripts`) missing.
- **CI/CD config:** GitHub workflows not included; release process documentation present but tooling not yet installed beyond package devDependencies.

## 6. Outstanding Work & Next Steps
Based on the brief and current repository state, the following areas require action:

1. **Reconstruct project structure**
   - Add `src/` directory with Vite React entry point (`main.tsx`) and foundational app components/layout.
   - Implement routing, state management, and theming baseline aligned with Tailwind configuration.
2. **Integrate Supabase**
   - Provision Supabase project and wire email/password auth UI per brief.
   - Implement role/resource CRUD with RLS compliance and optional demo-mode fallback.
3. **Heatmap & Scenario features**
   - Build resource planning heatmap with performance optimizations (memoization, virtualization for large datasets).
   - Implement scenario generator with predefined templates and multiplier logic.
4. **Estimation engine & KPIs**
   - Import estimation inputs, integrate `vendor_catalog_rates`, and surface KPI metrics.
5. **Data import/export tooling**
   - Support CSV import/export for resources, gaps, and scenarios; build Export Center for PNG/PDF outputs.
6. **Readiness & executive outputs**
   - Create readiness checklist UI and KPI dashboard cards; prepare executive export views.
7. **Type safety & validation**
   - Generate Supabase types into `src/types/database.ts`; apply Zod schemas for runtime validation.
8. **Feature flagging & configuration**
   - Add `.env` entries and code paths for `VITE_USE_DEMO_DATA` flag.
9. **Testing & QA**
   - Implement Playwright smoke flows (create project → add role/resource → view heatmap) and integrate lint/build/test scripts into CI pipeline.
10. **Documentation & changelog upkeep**
   - Expand `README.md` with setup instructions, update `CHANGELOG.md` per releases, maintain knowledge base as functionality ships.

## 7. Open Questions / Risks
- Confirm availability of referenced assets (`/docs`, `/supabase`, `/data`, `/scripts`, `/tests`). If they were excluded accidentally, retrieve from source bundle.
- Validate environment variable requirements beyond Supabase keys (e.g., feature flags, analytics).
- Establish coding standards and component library patterns once application scaffolding is created.

---
This knowledge base should be updated as code, documentation, and infrastructure evolve.
