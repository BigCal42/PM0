# Upload to Codex — Quick Steps

1) Download the zip provided with this package.
2) In Codex, create/choose the PM0 workspace.
3) Upload the zip, or `git push` this repo to `https://github.com/BigCal42/PM0` (main).
4) Set environment variables in Vercel and CI:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5) Run local dev: `npm install && npm run dev`.
6) (Optional) Seed demo scenarios:
   - `npm i -D tsx`
   - `npx tsx scripts/generate_demo_scenarios.ts`
7) CI will run lint/build/tests on PR; Release workflow will tag on `main` with Conventional Commits.
