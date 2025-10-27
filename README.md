# PM0 v2 Extended Starter Repo (Track A)

Vercel + Supabase + React (Vite + TS).

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

The development server reads from `.env` at startup. Set `VITE_USE_DEMO_DATA=true` to explore the bundled seed data without connecting to Supabase.

## Environment configuration

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | When `VITE_USE_DEMO_DATA` is `false` | Supabase project URL (e.g. `https://xyzcompany.supabase.co`). |
| `VITE_SUPABASE_ANON_KEY` | When `VITE_USE_DEMO_DATA` is `false` | Supabase anonymous API key from the project settings. |
| `VITE_USE_DEMO_DATA` | Optional (defaults to `false`) | Enables the local demo dataset and skips Supabase client initialisation. |
| `VITE_SENTRY_DSN` | Optional | Sentry client DSN for runtime error reporting. |

The runtime validator in `src/lib/env.ts` enforces these rules on every page load so configuration issues are caught early.

## Supabase setup

1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli) and authenticate with `supabase login`.
2. Provision a Supabase project (or start the local stack) and note the `SUPABASE_PROJECT_REF`.
3. Apply the schema and row-level security policies:
   ```bash
   supabase migration up
   ```
4. Seed the demo workspace (optional but recommended for `VITE_USE_DEMO_DATA=true` parity):
   ```bash
   supabase db seed --file supabase/seed/000_demo_seed.sql
   ```
5. Generate strongly typed bindings for the client:
   ```bash
   SUPABASE_PROJECT_REF=your-project-ref npm run typegen
   ```

Detailed notes live in [`supabase/README.md`](supabase/README.md).

## Build pipeline

The `npm run build` script invokes `scripts/typegen.sh` before compiling the Vite bundle. The helper script checks for the Supabase CLI and `SUPABASE_PROJECT_REF`; if either is missing it exits gracefully and reuses the previously generated types.

## Deploying to Vercel

1. Create a new Vercel project from this repository.
2. In the Vercel dashboard, add the client environment variables for the **Production** and **Preview** environments:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_USE_DEMO_DATA` (set to `false` for real backends)
   - `VITE_SENTRY_DSN` (optional)
3. Trigger a deployment; the build step will run Supabase type generation before bundling the app.

## Supabase client usage

The front-end reads configuration from `src/lib/env.ts` and initialises the Supabase client via `src/lib/supabaseClient.ts`. When demo mode is enabled the Supabase client is intentionally disabled to avoid accidental network traffic.

