export function App(): JSX.Element {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold tracking-tight">PM0 Starter</h1>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-widest text-slate-300">
            React + Vite
          </span>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-1 flex-col gap-6 px-6 py-12">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-lg shadow-slate-950/40">
          <h2 className="text-2xl font-semibold">Welcome to PM0</h2>
          <p className="mt-3 text-slate-300">
            Get started by editing <code className="rounded bg-slate-800 px-1.5 py-0.5">src/App.tsx</code> and save to
            reload.
          </p>
        </section>
      </main>
    </div>
  );
}

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
