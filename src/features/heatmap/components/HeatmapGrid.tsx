import { memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { UIEvent } from 'react';
import type { HeatmapCell, HeatmapMatrixRow } from '../types';
import { severityToClass } from '../utils/severity';
import { formatGap, formatShortNumber } from '@/lib/format';

interface HeatmapGridProps {
  matrix: HeatmapMatrixRow[];
  months: string[];
}

function HeatmapGridComponent({ matrix, months }: HeatmapGridProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [viewportHeight, setViewportHeight] = useState(520);
  const [scrollTop, setScrollTop] = useState(0);

  useLayoutEffect(() => {
    const element = parentRef.current;
    if (!element) {
      return;
    }

    const update = () => setViewportHeight(element.clientHeight);
    update();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(update);
      observer.observe(element);
      return () => observer.disconnect();
    }

    return undefined;
  }, []);

  const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  const rowHeight = 64;
  const overscan = 6;
  const totalHeight = matrix.length * rowHeight;
  const visibleCount = Math.max(1, Math.ceil(viewportHeight / rowHeight));
  const startIndex = Math.max(Math.floor(scrollTop / rowHeight) - overscan, 0);
  const endIndex = Math.min(startIndex + visibleCount + overscan * 2, matrix.length);
  const offsetTop = startIndex * rowHeight;

  const visibleRows = useMemo(
    () => matrix.slice(startIndex, endIndex),
    [matrix, startIndex, endIndex],
  );

  const gridTemplateColumns = useMemo(
    () => `minmax(220px, 1.25fr) repeat(${months.length}, minmax(104px, 1fr))`,
    [months.length],
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div
        className="grid items-center gap-px border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase text-slate-500"
        style={{ gridTemplateColumns }}
      >
        <span className="text-left text-slate-600">Role</span>
        {months.map((month) => (
          <span key={month} className="text-center text-slate-500">
            {month}
          </span>
        ))}
      </div>

      <div ref={parentRef} className="h-[520px] overflow-auto" onScroll={handleScroll}>
        <div className="relative" style={{ height: `${totalHeight}px`, width: '100%' }}>
          <div
            className="absolute left-0 right-0"
            style={{ transform: `translateY(${offsetTop}px)` }}
          >
            {visibleRows.map((row) => (
              <div
                key={row.role.id}
                className="grid gap-px border-b border-slate-100 bg-white px-3 py-3 text-sm text-slate-700"
                style={{
                  gridTemplateColumns,
                  height: `${rowHeight}px`,
                }}
              >
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-slate-900">{row.role.name}</span>
                  <span className="text-xs text-slate-500">{row.role.practice}</span>
                  <span className="text-xs text-slate-400">Δ {formatShortNumber(row.totalGap)}</span>
                </div>
                {row.cells.map((cell) => (
                  <HeatmapCellView key={`${row.role.id}-${cell.month}`} cell={cell} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const HeatmapCellView = memo(({ cell }: { cell: HeatmapCell }) => {
  const severityClass = severityToClass[cell.severity];

  return (
    <div className={`${severityClass} rounded-lg px-3 py-2 text-center transition-colors`}>
      <p className="text-sm font-semibold">{formatGap(cell.gap)}</p>
      <p className="text-[11px] opacity-80">{formatShortNumber(cell.supply)} • {formatShortNumber(cell.demand)}</p>
    </div>
  );
});

HeatmapCellView.displayName = 'HeatmapCellView';

export default memo(HeatmapGridComponent);
