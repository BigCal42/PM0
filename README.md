# PM0 v2 Extended Starter Repo (Track A)

Vercel + Supabase + React (Vite + TS).

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment variables** in a `.env.local` file (see [Environment Variables](#environment-variables)).
3. **Run the development server**
   ```bash
   npm run dev
   ```
4. Visit [http://localhost:5173](http://localhost:5173) and sign in with Supabase Auth or enable demo data for offline exploration.

Need deeper context? Jump into the restored [PM0 Knowledge Base](./docs/PM0_Knowledge_Base_v2.0.md) for product background, data models, and UX guidance.

## Environment Variables

Create a `.env.local` file based on your Vercel/Supabase project settings.

| Name | Required | Description |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | ✅ | Supabase project URL. |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase anon (public) API key; never commit the service role key. |
| `VITE_USE_DEMO_DATA` | Optional | Set to `true` to run against bundled demo scenarios instead of Supabase.

- In Vercel, add these variables under **Settings → Environment Variables** for each environment.
- Locally, store them in `.env.local`; Vite automatically exposes `VITE_`-prefixed keys.

## Build & Test Commands

| Task | Command |
| --- | --- |
| Start dev server | `npm run dev` |
| Production build | `npm run build` |
| Preview production build | `npm run preview` |
| Lint sources | `npm run lint` |
| Type-check | `npm run typecheck` |

Refer to the [Deployment Playbook](./docs/deployment.md) for CI expectations and release pipelines.

## Deployment (Vercel + Supabase)

1. **Provision Supabase**
   - Create a project and import the schema and RLS policies from the Supabase migrations bundle.
   - Generate API keys and capture the project URL + anon key for use in Vercel.
2. **Bootstrap Vercel**
   - Import the repository into Vercel and select the Vite framework preset.
   - Configure the environment variables listed above; redeploy after any changes.
   - Keep `vercel.json` in sync with SPA routing requirements.
3. **Automate releases**
   - Use the semantic-release workflow (see `README_RELEASE_PACK.md`) to version, changelog, and publish GitHub releases.
   - Ensure deployments reference tagged builds to keep Supabase migrations aligned.

Detailed runbooks for staging/production promotion live in the [Deployment Playbook](./docs/deployment.md).

## Troubleshooting

- **Auth errors locally**: Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; re-run `npm run dev` after editing `.env.local`.
- **Schema mismatches**: Re-apply the latest migrations and consult the Knowledge Base's data dictionary.
- **CORS issues**: Confirm the Supabase project allows the Vercel domain under **Auth → URL Configuration**.
- **Build failures**: Run `npm run lint` and `npm run typecheck` to surface TypeScript or ESLint issues early.
- **Stale demo data**: Toggle `VITE_USE_DEMO_DATA` and restart to reload fixtures.

For more context, cross-check the restored [PM0 Knowledge Base](./docs/PM0_Knowledge_Base_v2.0.md) and the [Deployment Playbook](./docs/deployment.md) when diagnosing issues.
