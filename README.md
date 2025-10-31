# PM0 (Track A)

**Phase Minus Zero — strategic planning protocol**

An intelligent web application for product management workflow automation, purpose-built to help healthcare systems and large enterprises scope, plan, and align complex technology transformations.

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn)

### Installation

```bash
npm install
```

### Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Configure environment variables:

| Variable                  | Required                            | Description                                                              |
| ------------------------- | ----------------------------------- | ------------------------------------------------------------------------ |
| `VITE_USE_DEMO_DATA`      | Optional (defaults to false)        | Enables the local demo dataset and skips Supabase client initialisation. |
| `VITE_SUPABASE_URL`       | When `VITE_USE_DEMO_DATA` is false  | Supabase project URL (e.g. https://xyzcompany.supabase.co).              |
| `VITE_SUPABASE_ANON_KEY`  | When `VITE_USE_DEMO_DATA` is false  | Supabase anonymous API key from the project settings.                    |
| `VITE_SENTRY_DSN`         | Optional                            | Sentry client DSN for runtime error reporting.                           |

The runtime validator in `src/lib/env.ts` enforces these rules on every page load so configuration issues are caught early.

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Demo Mode

Set `VITE_USE_DEMO_DATA=true` in your `.env` file to run the app with local demo data without connecting to Supabase. This is recommended for local development.

## Supabase Setup

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Authenticate:
   ```bash
   supabase login
   ```

3. Provision a Supabase project and note the `SUPABASE_PROJECT_REF`.

4. Apply migrations:
   ```bash
   supabase migration up
   ```

5. (Optional) Seed demo data:
   ```bash
   supabase db seed --file supabase/seed/000_demo_seed.sql
   ```

6. Generate TypeScript types:
   ```bash
   SUPABASE_PROJECT_REF=your-project-ref npm run typegen
   ```

## Build

Build the application for production:

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Testing

Run unit tests:

```bash
npm run test
```

Run E2E tests:

```bash
npm run test:e2e
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Code Quality

Run linter:

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

Type check:

```bash
npm run typecheck
```

## Deployment

### Vercel

1. Create a new Vercel project from this repository.
2. Add environment variables in the Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_USE_DEMO_DATA` (set to `false` for production)
   - `VITE_SENTRY_DSN` (optional)
3. Deploy: Vercel will automatically build and deploy on push to main.

The build step runs Supabase type generation before bundling the app.

## Project Structure

```
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React Context providers
│   ├── data/            # Data adapters (demo & Supabase)
│   ├── lib/             # Core utilities (env, logger, supabase client)
│   ├── routes/          # Page components
│   ├── styles/          # Global styles
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── tests/
│   ├── e2e/             # Playwright E2E tests
│   └── unit/            # Vitest unit tests
├── data/                # Demo data JSON
├── scripts/             # Build scripts
└── supabase/            # Supabase migrations and seed data
```

## Technology Stack

- **Frontend:** React 18, TypeScript, Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Testing:** Vitest (unit), Playwright (E2E)
- **Deployment:** Vercel

## License

See LICENSE file for details.

## Resources

- [Strategic Product Blueprint](./PM0_Strategic_Product_Blueprint_v2.0.md)
- [Repository Knowledge Base](./PM0_REPO_KNOWLEDGE_BASE.md)
- [Architecture Documentation](./docs/architecture_v2/README.md)

