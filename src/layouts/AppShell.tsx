import type { ReactNode } from 'react';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

type AppShellProps = {
  children?: ReactNode;
};

const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Header />
      <div className="flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-10 lg:flex-row lg:items-start lg:px-8">
          <Sidebar />
          <main className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg backdrop-blur">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppShell;
