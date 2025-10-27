# Contributing

Thanks for helping improve PM0! This guide covers the local workflow and the automation that runs in CI/CD.

## Local development

1. Install Node.js 22 (matching the CI runners).
2. Install dependencies: `npm install`.
3. Keep the codebase healthy: `npm run typecheck`, `npm run lint`, and `npm run build`.
4. Run the Playwright smoke tests before opening a pull request: `npx --yes playwright@1.46.1 test --config=playwright.config.ts`.

## Continuous integration

Pull requests trigger `.github/workflows/ci.yml`, which runs the same commands listed above in addition to a headless Playwright smoke suite. Fix all failures locally before pushing.

## Deployment and release automation

- `.github/workflows/vercel-deploy.yml` promotes the latest `main` build to Vercel.
- `.github/workflows/release.yml` runs semantic-release on `main` to cut GitHub releases and update the changelog.

### Required secrets

Add these secrets in your GitHub repository settings before enabling the workflows:

| Secret | Used by | Purpose |
| --- | --- | --- |
| `VERCEL_TOKEN` | Deploy workflow | Token used by the Vercel CLI to authenticate deployments. |
| `VERCEL_ORG_ID` | Deploy workflow | Identifies the owning Vercel organization. |
| `VERCEL_PROJECT_ID` | Deploy workflow | Points the deployment to the correct Vercel project. |

> The default `GITHUB_TOKEN` granted to workflows is sufficient for semantic-release to create tags, releases, and changelog commits.

### Vercel environment variables

Set the runtime variables in the Vercel project (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and related feature flags) so `vercel pull` can hydrate them during automated deployments.
