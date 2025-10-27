# Vercel Deployment Playbook

This project deploys to Vercel through GitHub Actions once the core CI workflow succeeds.

## GitHub Actions secrets

Add the following repository secrets before enabling the deployment workflow:

| Secret | Purpose |
| --- | --- |
| `VERCEL_TOKEN` | Personal or machine token with access to trigger deployments for the project. |
| `VERCEL_ORG_ID` | The Vercel organization ID that owns the project. |
| `VERCEL_PROJECT_ID` | The Vercel project ID that should receive production deployments. |

> The built-in `GITHUB_TOKEN` is used by the release workflow and does not need manual configuration.

## Vercel environment variables

Configure the same runtime variables in the Vercel dashboard that you use locally:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- Any additional feature flags (for example `VITE_USE_DEMO_DATA`).

Production deployments inherit these values automatically during the GitHub Action run when `vercel pull` fetches the configured environment.

## Deployment workflow

1. Push to `main` (or trigger the workflow manually) after the CI pipeline passes.
2. GitHub Actions builds the app with `vercel build` and promotes it with `vercel deploy --prebuilt --prod`.
3. Verify the deployment in the Vercel dashboard; roll back using the Vercel UI if needed.
