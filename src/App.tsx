import { AppProviders } from "./providers/app-providers";

export function App() {
  return (
    <AppProviders>
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-4 p-6">
        <div className="max-w-xl text-center space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight">PM0 Starter</h1>
          <p className="text-lg text-slate-300">
            Welcome to the PM0 v2 extended starter. Replace this placeholder with the production app
            experience for Workday transformation planning.
          </p>
        </div>
      </main>
    </AppProviders>
  );
}

export default App;
