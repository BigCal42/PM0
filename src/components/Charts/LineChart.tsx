/**
 * LineChart Component - Lightweight SVG-based line chart
 * No external dependencies for optimal performance
 */

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  showGrid?: boolean;
  color?: string;
  fillColor?: string;
  showDots?: boolean;
  formatValue?: (value: number) => string;
}

export function LineChart({
  data,
  title,
  height = 200,
  showGrid = true,
  color = '#3b82f6',
  fillColor = 'rgba(59, 130, 246, 0.1)',
  showDots = true,
  formatValue = (v) => v.toLocaleString(),
}: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        No data available
      </div>
    );
  }

  const padding = 40;
  const width = 600;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values, 0);
  const valueRange = maxValue - minValue;

  const getX = (index: number) => padding + (index / (data.length - 1)) * chartWidth;
  const getY = (value: number) => padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;

  // Create path for line
  const linePath = data
    .map((point, i) => {
      const x = getX(i);
      const y = getY(point.value);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  // Create path for filled area
  const areaPath = `${linePath} L ${getX(data.length - 1)} ${padding + chartHeight} L ${padding} ${padding + chartHeight} Z`;

  // Grid lines
  const gridLines = showGrid ? [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const y = padding + chartHeight * ratio;
    const value = maxValue - valueRange * ratio;
    return { y, value };
  }) : [];

  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>}
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Grid lines */}
        {showGrid && gridLines.map((line, i) => (
          <g key={i}>
            <line
              x1={padding}
              y1={line.y}
              x2={width - padding}
              y2={line.y}
              stroke="#374151"
              strokeWidth="1"
              strokeDasharray="4"
            />
            <text
              x={padding - 10}
              y={line.y + 4}
              textAnchor="end"
              fill="#9ca3af"
              fontSize="12"
            >
              {formatValue(line.value)}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill={fillColor} />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {showDots && data.map((point, i) => {
          const x = getX(i);
          const y = getY(point.value);
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill={color}
                stroke="#1f2937"
                strokeWidth="2"
              />
              <circle
                cx={x}
                cy={y}
                r="8"
                fill="transparent"
                className="hover:fill-white/10 cursor-pointer transition-all"
              >
                <title>{`${point.label}: ${formatValue(point.value)}`}</title>
              </circle>
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((point, i) => {
          if (i % Math.ceil(data.length / 6) !== 0) return null; // Show max 6 labels
          const x = getX(i);
          return (
            <text
              key={i}
              x={x}
              y={height - padding + 20}
              textAnchor="middle"
              fill="#9ca3af"
              fontSize="12"
            >
              {point.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

