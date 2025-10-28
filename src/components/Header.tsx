import { useProjectStore } from '@/store/useProjectStore';

const Header = () => {
  const { projectName } = useProjectStore((state) => ({ projectName: state.projectName }));
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
        <div className="hidden items-center gap-3 text-sm font-medium text-slate-300 md:flex">
          <span className="rounded-full border border-slate-700 px-3 py-1">Docs</span>
          <span className="rounded-full border border-slate-700 px-3 py-1">Changelog</span>
          <span className="rounded-full border border-slate-700 px-3 py-1">Support</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
