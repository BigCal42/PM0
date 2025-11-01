/**
 * Comparison View - Compare multiple metrics or periods side-by-side
 */

import { BarChart } from './Charts/BarChart';

interface ComparisonItem {
  label: string;
  value: number;
  benchmark?: number;
}

interface ComparisonViewProps {
  title: string;
  data: ComparisonItem[];
  formatValue?: (value: number) => string;
  showBenchmarks?: boolean;
}

export function ComparisonView({
  title,
  data,
  formatValue = (v) => v.toLocaleString(),
  showBenchmarks = true,
}: ComparisonViewProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>

      {/* Chart */}
      <BarChart
        data={data.map(item => ({
          label: item.label,
          value: item.value,
          color: item.benchmark && item.value >= item.benchmark ? '#10b981' : '#3b82f6',
        }))}
        height={300}
        formatValue={formatValue}
      />

      {/* Detailed Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-dark-text-muted">
                Metric
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-dark-text-muted">
                Value
              </th>
              {showBenchmarks && (
                <>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-dark-text-muted">
                    Benchmark
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-dark-text-muted">
                    Variance
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-text-muted">
                    Status
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const variance = item.benchmark
                ? ((item.value - item.benchmark) / item.benchmark) * 100
                : null;
              const status = variance
                ? variance >= 0
                  ? 'Above'
                  : 'Below'
                : null;

              return (
                <tr
                  key={index}
                  className="border-b border-dark-border/50 hover:bg-dark-hover transition-colors"
                >
                  <td className="py-3 px-4 text-white">{item.label}</td>
                  <td className="py-3 px-4 text-right font-semibold text-white">
                    {formatValue(item.value)}
                  </td>
                  {showBenchmarks && (
                    <>
                      <td className="py-3 px-4 text-right text-dark-text-muted">
                        {item.benchmark ? formatValue(item.benchmark) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {variance !== null ? (
                          <span
                            className={
                              variance >= 0 ? 'text-green-400' : 'text-red-400'
                            }
                          >
                            {variance >= 0 ? '+' : ''}
                            {variance.toFixed(1)}%
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {status && (
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              status === 'Above'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {status}
                          </span>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Statistics */}
      {showBenchmarks && data.some(d => d.benchmark) && (
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="bg-dark-hover p-4 rounded-lg">
            <div className="text-xs text-dark-text-muted mb-1">Above Benchmark</div>
            <div className="text-2xl font-bold text-green-400">
              {data.filter(d => d.benchmark && d.value >= d.benchmark).length}
            </div>
          </div>
          <div className="bg-dark-hover p-4 rounded-lg">
            <div className="text-xs text-dark-text-muted mb-1">Below Benchmark</div>
            <div className="text-2xl font-bold text-red-400">
              {data.filter(d => d.benchmark && d.value < d.benchmark).length}
            </div>
          </div>
          <div className="bg-dark-hover p-4 rounded-lg">
            <div className="text-xs text-dark-text-muted mb-1">Avg Performance</div>
            <div className="text-2xl font-bold text-white">
              {(
                (data.filter(d => d.benchmark && d.value >= d.benchmark).length / data.filter(d => d.benchmark).length) *
                100
              ).toFixed(0)}
              %
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

