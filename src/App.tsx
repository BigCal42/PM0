import { FormEvent, useMemo, useState } from 'react';
import {
  MONTH_LABELS,
  ResourceAllocation,
  generateHeatmap,
} from './lib/heatmap';
import {
  ScenarioType,
  applyScenarioMultiplier,
  getScenarioMultiplier,
  SCENARIO_LABELS,
} from './lib/scenario';

type Step = 'auth' | 'project' | 'resource';

interface Project {
  name: string;
  ownerEmail: string;
}

const defaultScenario: ScenarioType = 'baseline';

function App() {
  const [step, setStep] = useState<Step>('auth');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [project, setProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState('');
  const [role, setRole] = useState('');
  const [monthIndex, setMonthIndex] = useState(0);
  const [hours, setHours] = useState(40);
  const [scenario, setScenario] = useState<ScenarioType>(defaultScenario);
  const [allocations, setAllocations] = useState<ResourceAllocation[]>([]);
  const [statusMessage, setStatusMessage] = useState('');

  const heatmap = useMemo(() => generateHeatmap(allocations), [allocations]);
  const activeMultiplier = useMemo(() => getScenarioMultiplier(scenario), [scenario]);

  const handleSignIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!credentials.email || !credentials.password) {
      setStatusMessage('Provide both email and password to continue.');
      return;
    }
    setStep('project');
    setStatusMessage('');
  };

  const handleCreateProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!projectName.trim()) {
      setStatusMessage('Project name is required.');
      return;
    }
    setProject({ name: projectName.trim(), ownerEmail: credentials.email });
    setStep('resource');
    setStatusMessage('Project created and ready for staffing.');
  };

  const handleAddResource = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!role.trim()) {
      setStatusMessage('Role name is required.');
      return;
    }

    const adjustedHours = applyScenarioMultiplier(hours, scenario);
    const entry: ResourceAllocation = {
      role: role.trim(),
      monthIndex,
      hours: adjustedHours,
    };
    setAllocations((current) => [...current, entry]);
    setStatusMessage(
      `${entry.role} added for ${MONTH_LABELS[entry.monthIndex]} (${adjustedHours} hrs).`,
    );
    setRole('');
    setHours(40);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10">
        <header>
          <h1 className="text-3xl font-semibold" data-testid="app-title">
            PM0 Demo Workspace
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            The demo workspace mirrors the core flow: authenticate, stand up a project,
            staff resources, then validate the staffing heatmap. Inputs are stored in-memory
            purely for smoke-test automation.
          </p>
        </header>

        {statusMessage && (
          <div
            aria-live="polite"
            className="rounded border border-slate-600 bg-slate-800 px-4 py-3 text-sm"
          >
            {statusMessage}
          </div>
        )}

        {step === 'auth' && (
          <section aria-label="Sign in">
            <h2 className="text-xl font-medium">Sign in</h2>
            <form className="mt-4 flex flex-col gap-4" onSubmit={handleSignIn}>
              <label className="flex flex-col gap-2 text-sm font-medium">
                Email
                <input
                  aria-label="Email"
                  className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-base"
                  name="email"
                  onChange={(event) =>
                    setCredentials((prev) => ({ ...prev, email: event.target.value }))
                  }
                  placeholder="analyst@pm0.app"
                  type="email"
                  value={credentials.email}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium">
                Password
                <input
                  aria-label="Password"
                  className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-base"
                  name="password"
                  onChange={(event) =>
                    setCredentials((prev) => ({ ...prev, password: event.target.value }))
                  }
                  placeholder="••••••••"
                  type="password"
                  value={credentials.password}
                />
              </label>
              <button
                className="self-start rounded bg-emerald-500 px-4 py-2 font-semibold text-slate-900"
                type="submit"
              >
                Sign In
              </button>
            </form>
          </section>
        )}

        {step === 'project' && (
          <section aria-label="Project setup">
            <h2 className="text-xl font-medium">Project Setup</h2>
            <form className="mt-4 flex flex-col gap-4" onSubmit={handleCreateProject}>
              <label className="flex flex-col gap-2 text-sm font-medium">
                Project Name
                <input
                  aria-label="Project Name"
                  className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-base"
                  onChange={(event) => setProjectName(event.target.value)}
                  placeholder="Cardiology rollout"
                  type="text"
                  value={projectName}
                />
              </label>
              <button
                className="self-start rounded bg-emerald-500 px-4 py-2 font-semibold text-slate-900"
                type="submit"
              >
                Create Project
              </button>
            </form>
          </section>
        )}

        {project && (
          <section aria-label="Project summary">
            <h2 className="text-xl font-medium">Project Summary</h2>
            <dl className="mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
              <div className="rounded border border-slate-700 bg-slate-800 px-3 py-3">
                <dt className="font-semibold text-slate-300">Project</dt>
                <dd>{project.name}</dd>
              </div>
              <div className="rounded border border-slate-700 bg-slate-800 px-3 py-3">
                <dt className="font-semibold text-slate-300">Owner</dt>
                <dd>{project.ownerEmail}</dd>
              </div>
              <div className="rounded border border-slate-700 bg-slate-800 px-3 py-3">
                <dt className="font-semibold text-slate-300">Resources</dt>
                <dd>{allocations.length}</dd>
              </div>
            </dl>
          </section>
        )}

        {step === 'resource' && project && (
          <section aria-label="Resource entry">
            <h2 className="text-xl font-medium">Resource Entry</h2>
            <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleAddResource}>
              <label className="flex flex-col gap-2 text-sm font-medium">
                Role
                <input
                  aria-label="Role"
                  className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-base"
                  onChange={(event) => setRole(event.target.value)}
                  placeholder="Epic analyst"
                  type="text"
                  value={role}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium">
                Month
                <select
                  aria-label="Month"
                  className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-base"
                  onChange={(event) => setMonthIndex(Number(event.target.value))}
                  value={monthIndex}
                >
                  {MONTH_LABELS.map((label, index) => (
                    <option key={label} value={index}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium">
                Hours
                <input
                  aria-label="Hours"
                  className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-base"
                  min={0}
                  onChange={(event) => setHours(Number(event.target.value))}
                  type="number"
                  value={hours}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium">
                Scenario
                <select
                  aria-label="Scenario"
                  className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-base"
                  onChange={(event) => setScenario(event.target.value as ScenarioType)}
                  value={scenario}
                >
                  {Object.entries(SCENARIO_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <span className="text-xs font-normal text-slate-400">
                  Multiplier: ×{activeMultiplier.toFixed(2)}
                </span>
              </label>
              <div className="flex items-end">
                <button
                  className="rounded bg-emerald-500 px-4 py-2 font-semibold text-slate-900"
                  type="submit"
                >
                  Add Resource
                </button>
              </div>
            </form>
          </section>
        )}

        {heatmap.length > 0 && (
          <section aria-label="Heatmap" className="pb-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">Resource Heatmap</h2>
              <p className="text-xs text-slate-400">
                Severity key: low (&lt; 80 hrs), medium (80-139 hrs), high (140+ hrs)
              </p>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table
                className="min-w-full divide-y divide-slate-700"
                data-testid="heatmap-table"
              >
                <thead className="bg-slate-800 text-left text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-3 py-2">Role</th>
                    {MONTH_LABELS.map((month) => (
                      <th className="px-3 py-2" key={month}>
                        {month}
                      </th>
                    ))}
                    <th className="px-3 py-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {heatmap.map((row, rowIndex) => (
                    <tr key={row.role}>
                      <th className="whitespace-nowrap px-3 py-2 text-left font-semibold text-slate-200">
                        {row.role}
                      </th>
                      {row.cells.map((cell) => (
                        <td
                          className="px-3 py-2"
                          data-severity={cell.severity}
                          data-testid={`heatmap-cell-${rowIndex}-${cell.monthIndex}`}
                          key={cell.monthIndex}
                        >
                          {cell.hours > 0 ? cell.hours : '\u2013'}
                        </td>
                      ))}
                      <td className="px-3 py-2 font-semibold text-slate-100">{row.totalHours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
