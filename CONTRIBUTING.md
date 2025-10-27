# Contributing to PM0

Thank you for your interest in strengthening PM0. This guide explains how to propose changes, follow our branching strategy, and submit pull requests that are easy to review.

## Getting Started
1. Fork the repository and create a local clone.
2. Install dependencies with `npm install` and run `npm run dev` for local development.
3. Review the [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md); participation in the project assumes agreement to it.

## Branching & Change Flow
- `main` holds deployable code; commits to `main` happen only through reviewed pull requests.
- Create feature branches from `main` using the format `feature/<short-topic>` or `chore/<short-topic>`.
- Keep branches focused; avoid unrelated changes so reviewers can move fast.
- Rebase on `main` when conflicts appear to keep history clean.

## Commit Messages
We follow [Conventional Commits](https://www.conventionalcommits.org/). Use the structure `<type>(optional scope): <imperative summary>` with types such as `feat`, `fix`, `docs`, `chore`, and `test`. Example: `feat(heatmap): add memoized resource grid`.

Additional guidance:
- Limit subject lines to 72 characters.
- Include context in the body when the change is complex or introduces migration steps.
- Reference GitHub issues with `Closes #123` when applicable.

## Pull Requests
1. Ensure your branch is rebased on the latest `main`.
2. Fill out every section of the pull request template, including the mission checklist.
3. Demonstrate testing with `npm run lint`, `npm run typecheck`, and targeted Playwright scenarios where relevant.
4. Link to Supabase schema updates or migrations if your changes touch the database.
5. Request at least one reviewer and respond thoughtfully to all feedback.

## Supabase & Secrets Handling
- Never commit Supabase service-role keys, JWT signing secrets, or database connection strings.
- Use the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables for local development.
- Prefer `.env.local` or Vercel project settings for secrets; do not store secrets in the repo or CI logs.
- When prototyping features that require elevated permissions, use Supabase policies or RLS bypass roles only in controlled environments and rotate credentials afterwards.

## Working with RLS
- Every new table or view must include RLS policies that scope data by project/user.
- Add integration tests or documented manual test steps showing RLS enforcement for new queries.
- If you need admin-only access, expose it through Supabase Edge Functions rather than disabling RLS on tables.

## Submitting Changes
1. Run the relevant tests and linters.
2. Update documentation, changelogs, and type definitions when APIs change.
3. Confirm that the pull request checklist is fully addressed before requesting review.

Thank you for helping PM0 deliver secure, maintainable healthcare tooling!
