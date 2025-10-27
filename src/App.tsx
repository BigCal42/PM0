import { env } from './lib/env'
import { isDemoMode, sentryDsn } from './lib/supabaseClient'

const ConfigItem = ({ label, value }: { label: string; value: string | null }) => (
  <div className="config-item">
    <dt className="font-medium text-slate-600">{label}</dt>
    <dd className="font-mono text-sm break-all text-slate-900">{value ?? '—'}</dd>
  </div>
)

export default function App() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16">
        <header>
          <p className="text-sm uppercase tracking-wide text-slate-500">PM0 Demo Shell</p>
          <h1 className="mt-2 text-3xl font-semibold">Environment readiness</h1>
          <p className="mt-4 text-base text-slate-600">
            The client bootstraps Supabase and third-party integrations at runtime. Review the detected configuration below before
            connecting to a real project.
          </p>
        </header>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">Runtime flags</h2>
          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ConfigItem label="Demo mode" value={isDemoMode ? 'enabled' : 'disabled'} />
            <ConfigItem label="Sentry DSN" value={sentryDsn ?? null} />
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">Supabase connection</h2>
          {isDemoMode ? (
            <p className="mt-2 text-sm text-slate-600">
              Supabase is bypassed because <code>VITE_USE_DEMO_DATA</code> is enabled. Disable demo mode to connect to your project
              using the values below.
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-600">
              Supabase will initialise with the configured URL and anon key. Update these variables in your environment to point to
              the correct workspace.
            </p>
          )}
          <dl className="mt-4 grid grid-cols-1 gap-4">
            <ConfigItem label="VITE_SUPABASE_URL" value={env.supabaseUrl} />
            <ConfigItem
              label="VITE_SUPABASE_ANON_KEY"
              value={env.supabaseAnonKey ? `${env.supabaseAnonKey.slice(0, 6)}…${env.supabaseAnonKey.slice(-4)}` : null}
            />
          </dl>
        </section>
      </div>
    </main>
  )
}
