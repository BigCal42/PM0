# PM0 v2 Extended Starter Repo (Track A)

Vercel + Supabase + React (Vite + TS).

## Vercel Deployment Checklist

Ensure the following items are in place before triggering a Vercel deployment:

1. **Environment variables**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - Any other Supabase project-specific public keys required by the application.
2. **Supabase configuration**
   - Confirm the Supabase project URL and anon key match the target environment.
   - Apply the latest database migrations and confirm Row Level Security rules are active.
3. **Build settings**
   - Build command: `npm run build`
   - Output directory: `dist`
4. **Release readiness**
   - Run quality checks locally (lint, typecheck, tests) before deployment.
   - Verify that environment secrets are configured in Vercel to avoid runtime failures.
