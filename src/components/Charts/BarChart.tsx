/**
 * BarChart Component - Lightweight SVG-based bar chart
 */

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  showGrid?: boolean;
  showValues?: boolean;
  formatValue?: (value: number) => string;
  horizontal?: boolean;
}

export function BarChart({
  data,
  title,
  height = 300,
  showGrid = true,
  showValues = true,
  formatValue = (v) => v.toLocaleString(),
  horizontal = false,
}: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        No data available
      </div>
    );
  }

  const padding = { top: 20, right: 40, bottom: 60, left: 80 };
  const width = 600;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values);

  if (horizontal) {
    const barHeight = chartHeight / data.length;
    const barPadding = barHeight * 0.2;

    return (
      <div className="w-full">
        {title && <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>}
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Grid lines */}
          {showGrid && [0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const x = padding.left + chartWidth * ratio;
            return (
              <line
                key={i}
                x1={x}
                y1={padding.top}
                x2={x}
                y2={height - padding.bottom}
                stroke="#374151"
                strokeWidth="1"
                strokeDasharray="4"
              />
            );
          })}

          {/* Bars */}
          {data.map((point, i) => {
            const barWidth = (point.value / maxValue) * chartWidth;
            const y = padding.top + i * barHeight + barPadding / 2;

            return (
              <g key={i}>
                {/* Bar */}
                <rect
                  x={padding.left}
                  y={y}
                  width={barWidth}
                  height={barHeight - barPadding}
                  fill={point.color || '#3b82f6'}
                  rx="4"
                  className="transition-all duration-300 hover:opacity-80"
                >
                  <title>{`${point.label}: ${formatValue(point.value)}`}</title>
                </rect>

                {/* Label */}
                <text
                  x={padding.left - 10}
                  y={y + (barHeight - barPadding) / 2 + 5}
                  textAnchor="end"
                  fill="#e5e7eb"
                  fontSize="12"
                  fontWeight="500"
                >
                  {point.label}
                </text>

                {/* Value */}
                {showValues && (
                  <text
                    x={padding.left + barWidth + 10}
                    y={y + (barHeight - barPadding) / 2 + 5}
                    fill="#9ca3af"
                    fontSize="12"
                  >
                    {formatValue(point.value)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  // Vertical bars
  const barWidth = chartWidth / data.length;
  const barPadding = barWidth * 0.2;

  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>}
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grid lines */}
        {showGrid && [0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + chartHeight * (1 - ratio);
          const value = maxValue * ratio;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#374151"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                fill="#9ca3af"
                fontSize="12"
              >
                {formatValue(value)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((point, i) => {
          const barHeight = (point.value / maxValue) * chartHeight;
          const x = padding.left + i * barWidth + barPadding / 2;
          const y = padding.top + chartHeight - barHeight;

          return (
            <g key={i}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth - barPadding}
                height={barHeight}
                fill={point.color || '#3b82f6'}
                rx="4"
                className="transition-all duration-300 hover:opacity-80"
              >
                <title>{`${point.label}: ${formatValue(point.value)}`}</title>
              </rect>

              {/* Value on top */}
              {showValues && (
                <text
                  x={x + (barWidth - barPadding) / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fill="#9ca3af"
                  fontSize="12"
                >
                  {formatValue(point.value)}
                </text>
              )}

              {/* Label */}
              <text
                x={x + (barWidth - barPadding) / 2}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                fill="#e5e7eb"
                fontSize="12"
                fontWeight="500"
              >
                {point.label.length > 10 ? point.label.substring(0, 10) + '...' : point.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

