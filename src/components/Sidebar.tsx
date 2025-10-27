const navigation = [
  {
    label: 'Overview',
    description: 'Your project pulse at a glance.',
    isActive: true,
  },
  {
    label: 'Workflows',
    description: 'Automations and pipelines.',
    isActive: false,
  },
  {
    label: 'Integrations',
    description: 'Connect data across the stack.',
    isActive: false,
  },
  {
    label: 'Reports',
    description: 'Insights and performance metrics.',
    isActive: false,
  },
];

const Sidebar = () => {
  return (
    <aside className="flex w-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 shadow-lg sm:p-5 lg:w-72">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Navigation</h2>
      <nav className="flex flex-col gap-3">
        {navigation.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`rounded-xl border px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500 ${
              item.isActive
                ? 'border-sky-500/60 bg-sky-500/10 text-sky-100 shadow-inner'
                : 'border-slate-800 bg-slate-950/30 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            <p className="text-sm font-semibold">{item.label}</p>
            <p className="text-xs text-slate-400">{item.description}</p>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
