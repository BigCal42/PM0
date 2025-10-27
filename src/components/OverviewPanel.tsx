const highlights = [
  {
    label: 'Active Initiatives',
    metric: '12',
    trend: '+3 new this week',
  },
  {
    label: 'Average Velocity',
    metric: '82%',
    trend: '↑ 6% vs last sprint',
  },
  {
    label: 'Upcoming Reviews',
    metric: '5',
    trend: 'Next review in 2 days',
  },
];

const updates = [
  {
    title: 'Workflow orchestration',
    description: 'New automation run completed successfully with zero regressions detected.',
  },
  {
    title: 'Insights engine',
    description: 'Revenue attribution model refreshed with the latest data ingestion cycle.',
  },
  {
    title: 'Security review',
    description: 'Quarterly compliance checklist is 80% complete and pending stakeholder sign-off.',
  },
];

const OverviewPanel = () => {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-2xl font-semibold text-slate-100">Welcome back to PM0</h1>
        <p className="mt-2 text-sm text-slate-400">
          Monitor progress, surface opportunities, and coordinate delivery across your product matrix.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {highlights.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-inner shadow-slate-950/60"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-100">{item.metric}</p>
            <p className="mt-2 text-xs text-slate-400">{item.trend}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Latest updates</h2>
        <ul className="flex flex-col gap-3">
          {updates.map((update) => (
            <li key={update.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-base font-semibold text-slate-100">{update.title}</p>
              <p className="mt-2 text-sm text-slate-400">{update.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default OverviewPanel;
