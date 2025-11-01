/**
 * DonutChart Component - SVG-based donut/pie chart
 */

interface DataPoint {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DataPoint[];
  title?: string;
  size?: number;
  innerRadius?: number;
  showLegend?: boolean;
  showPercentages?: boolean;
  formatValue?: (value: number) => string;
}

export function DonutChart({
  data,
  title,
  size = 200,
  innerRadius = 0.6,
  showLegend = true,
  showPercentages = true,
  formatValue = (v) => v.toLocaleString(),
}: DonutChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        No data available
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 10;
  const innerR = radius * innerRadius;

  let currentAngle = -90; // Start at top

  const paths = data.map((point) => {
    const percentage = (point.value / total) * 100;
    const angle = (percentage / 100) * 360;
    
    const startAngle = (currentAngle * Math.PI) / 180;
    const endAngle = ((currentAngle + angle) * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const innerX1 = centerX + innerR * Math.cos(startAngle);
    const innerY1 = centerY + innerR * Math.sin(startAngle);
    const innerX2 = centerX + innerR * Math.cos(endAngle);
    const innerY2 = centerY + innerR * Math.sin(endAngle);

    const largeArc = angle > 180 ? 1 : 0;

    const path = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${innerX2} ${innerY2}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerX1} ${innerY1}`,
      'Z',
    ].join(' ');

    currentAngle += angle;

    return {
      path,
      percentage,
      ...point,
    };
  });

  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>}
      <div className="flex items-center gap-8">
        {/* Chart */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {paths.map((segment, i) => (
              <g key={i}>
                <path
                  d={segment.path}
                  fill={segment.color}
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  strokeWidth="2"
                  stroke="#1f2937"
                >
                  <title>{`${segment.label}: ${formatValue(segment.value)} (${segment.percentage.toFixed(1)}%)`}</title>
                </path>
              </g>
            ))}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-white">{formatValue(total)}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="flex-1 space-y-2">
            {paths.map((segment, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-gray-300">{segment.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">
                    {formatValue(segment.value)}
                  </span>
                  {showPercentages && (
                    <span className="text-gray-400 text-xs w-12 text-right">
                      {segment.percentage.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

