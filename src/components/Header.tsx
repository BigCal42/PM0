import { useProjectStore } from '@/store/useProjectStore';
import { useFeatureFlags } from '@/store/useFeatureFlags';

const Header = () => {
  const { projectName } = useProjectStore((state) => ({ projectName: state.projectName }));
  const { useDemoData, setUseDemoData, toggleDemoData } = useFeatureFlags();

  const handleToggle = () => {
    if (useDemoData) {
      setUseDemoData(false);
      return;
    }
    toggleDemoData();
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-lg font-semibold text-slate-950">
            PM
          </div>
          <div>
            <p className="text-lg font-semibold">{projectName ?? 'Project Matrix 0'}</p>
            <p className="text-sm text-slate-400">
              {projectName ? 'Active project workspace' : 'Foundational workspace shell'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
          {useDemoData && (
            <span
              data-testid="demo-banner"
              className="inline-flex rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1 text-emerald-200"
            >
              Demo data active
            </span>
          )}
          <button
            type="button"
            onClick={handleToggle}
            className="rounded-full border border-sky-500/60 px-4 py-2 font-semibold text-sky-200 transition hover:border-sky-400 hover:text-white"
          >
            {useDemoData ? 'Switch to live data' : 'Use demo mode'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
