import React from 'react';
import classNames from 'classnames';

type SectionProps = React.PropsWithChildren<{
  title: string;
  actions?: React.ReactNode;
  className?: string;
}>;

export const Section: React.FC<SectionProps> = ({ title, actions, className, children }) => {
  return (
    <section className={classNames('rounded-lg border border-slate-200 bg-white p-6 shadow-sm', className)}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="space-y-4 text-sm text-slate-700">{children}</div>
    </section>
  );
};
