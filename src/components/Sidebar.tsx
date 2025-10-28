export type SidebarItem = {
  id: string;
  label: string;
  description: string;
};

type SidebarProps = {
  items: SidebarItem[];
  activeItemId: string;
  onSelect: (id: string) => void;
};

const Sidebar = ({ items, activeItemId, onSelect }: SidebarProps) => {
  return (
    <aside className="flex w-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 shadow-lg sm:p-5 lg:w-72">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Navigation</h2>
      <nav className="flex flex-col gap-3">
        {items.map((item) => {
          const isActive = item.id === activeItemId;
          return (
            <button
              key={item.label}
              type="button"
              role="link"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onSelect(item.id)}
            className={`rounded-xl border px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500 ${
              isActive
                ? 'border-sky-500/60 bg-sky-500/10 text-sky-100 shadow-inner'
                : 'border-slate-800 bg-slate-950/30 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-slate-400">{item.description}</p>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
