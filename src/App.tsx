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

export default App;
