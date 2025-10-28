import React, { useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Section } from '../../components/Section';
import { useProjectStore } from '../../store/useProjectStore';

type VirtualState = {
  startIndex: number;
  endIndex: number;
};

const ROW_HEIGHT = 44;
const VIRTUAL_PADDING = 5;

const severityStyles: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-900',
  medium: 'bg-amber-100 text-amber-900',
  high: 'bg-rose-100 text-rose-900',
};

export const HeatmapPlanner: React.FC = () => {
  const { roles, heatmap } = useProjectStore((state) => ({ roles: state.roles, heatmap: state.heatmap }));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [virtualState, setVirtualState] = useState<VirtualState>({ startIndex: 0, endIndex: 20 });

  const roleIds = useMemo(() => roles.map((role) => role.id), [roles]);
  const months = useMemo(() => Array.from(new Set(heatmap.map((cell) => cell.month))).sort(), [heatmap]);

  const rows = useMemo(() => {
    return roleIds.map((roleId) => ({
      role: roles.find((role) => role.id === roleId),
      cells: months.map((month) => heatmap.find((cell) => cell.roleId === roleId && cell.month === month)),
    }));
  }, [heatmap, months, roleIds, roles]);

  const handleScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
    const { scrollTop, clientHeight } = event.currentTarget;
    const startIndex = Math.max(Math.floor(scrollTop / ROW_HEIGHT) - VIRTUAL_PADDING, 0);
    const endIndex = Math.min(
      rows.length,
      Math.ceil((scrollTop + clientHeight) / ROW_HEIGHT) + VIRTUAL_PADDING,
    );
    setVirtualState({ startIndex, endIndex });
  };

  const shouldVirtualize = rows.length * months.length > 200;
  const visibleRows = shouldVirtualize ? rows.slice(virtualState.startIndex, virtualState.endIndex) : rows;

  return (
    <Section
      title="Heatmap Planner"
      actions={
        <span className="text-xs font-medium text-slate-500">
          {rows.length} roles × {months.length} months
        </span>
      }
    >
      <div className="overflow-x-auto" data-testid="heatmap-grid">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[220px_repeat(auto-fill,minmax(120px,1fr))] gap-px rounded-md border border-slate-200 bg-slate-200 text-xs">
            <div className="bg-slate-50 px-3 py-2 font-semibold uppercase tracking-wide text-slate-500">Role</div>
            {months.map((month) => (
              <div key={month} className="bg-slate-50 px-3 py-2 font-semibold uppercase tracking-wide text-slate-500">
                {new Date(month + '-01').toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
              </div>
            ))}
          </div>
          <div
            ref={containerRef}
            onScroll={handleScroll}
            style={{ maxHeight: shouldVirtualize ? 400 : 'auto' }}
            className={classNames('mt-1 overflow-y-auto rounded-md border border-slate-200 bg-slate-100', {
              'relative': shouldVirtualize,
            })}
          >
            <div
              style={{
                height: shouldVirtualize ? rows.length * ROW_HEIGHT : undefined,
                position: shouldVirtualize ? 'relative' : undefined,
              }}
            >
              {(shouldVirtualize ? visibleRows : rows).map((row, index) => {
                const rowIndex = shouldVirtualize ? virtualState.startIndex + index : index;
                return (
                  <div
                    key={row.role?.id ?? rowIndex}
                    className={classNames(
                      'grid grid-cols-[220px_repeat(auto-fill,minmax(120px,1fr))] gap-px',
                      shouldVirtualize ? 'absolute left-0 right-0' : 'relative',
                    )}
                    style={{
                      top: shouldVirtualize ? rowIndex * ROW_HEIGHT : undefined,
                      height: shouldVirtualize ? ROW_HEIGHT : undefined,
                    }}
                  >
                    <div className="flex items-center bg-white px-3 text-sm font-medium text-slate-900">
                      <div>
                        <p>{row.role?.name ?? 'Unknown role'}</p>
                        <p className="text-xs text-slate-500">Capacity: {row.role?.monthlyCapacity ?? 0} hrs</p>
                      </div>
                    </div>
                    {row.cells.map((cell, cellIndex) => (
                      <div
                        key={cell?.id ?? `${row.role?.id ?? rowIndex}-${months[cellIndex]}`}
                        className={classNames('flex items-center justify-center px-3 text-xs font-semibold', {
                          'bg-white text-slate-400': !cell,
                          [severityStyles[cell?.severity ?? 'low'] ?? severityStyles.low]: Boolean(cell),
                        })}
                      >
                        {cell ? `${Math.round(cell.gap * 100)}% gap` : '—'}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
