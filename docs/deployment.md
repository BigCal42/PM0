# Deployment Playbook

This playbook documents how PM0 ships to each environment and ties together Supabase + Vercel automation.

## Environments

| Stage | Purpose | Notes |
| --- | --- | --- |
| Preview | Ephemeral Vercel previews for each PR; connects to staging Supabase. | Validate migrations and QA flows before merging. |
| Staging | Stable branch build for stakeholder review. | Gatekeep production releases and run smoke tests. |
| Production | Customer-facing tenant. | Deployed from tagged semantic-release versions only. |

## Release Flow

1. Merge PRs with Conventional Commit messages to trigger CI.
2. Semantic-release publishes a GitHub release, updates `CHANGELOG.md`, and tags the commit.
3. Vercel picks up the tag and deploys staging/production environments.
4. Supabase migrations are promoted using the release tag to guarantee schema parity.

## Supabase Operations

- Store SQL migrations in `supabase/migrations` and keep them idempotent.
- Apply migrations to staging first; confirm RLS policies before promoting.
- Rotate anon keys if leaked and update Vercel environment variables immediately.

## Vercel Operations

- Keep `vercel.json` aligned with SPA routing rules (fallback to `index.html`).
- Configure preview/staging/production environment variables explicitly; do not rely on inherited defaults.
- Monitor build logs for ESLint/TypeScript errors surfaced during `npm run build`.

## Incident Response

- Roll back by redeploying a previous semantic-release tag.
- Use Supabase point-in-time recovery if data corruption occurs.
- Capture incidents in the Knowledge Base and update this playbook with remediation steps.
