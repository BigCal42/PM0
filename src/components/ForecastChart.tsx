/**
 * Forecast Chart - Shows historical data with forecasted values
 */

import { LineChart } from './Charts/LineChart';
import { AnalyticsEngine, TimeSeriesData } from '../lib/analytics/AnalyticsEngine';

interface ForecastChartProps {
  historicalData: TimeSeriesData[];
  forecastPeriods: number;
  title?: string;
  formatValue?: (value: number) => string;
}

export function ForecastChart({
  historicalData,
  forecastPeriods,
  title = 'Forecast',
  formatValue = (v) => v.toLocaleString(),
}: ForecastChartProps) {
  // Generate forecast
  const forecast = AnalyticsEngine.forecast(historicalData, forecastPeriods);

  // Combine historical and forecast data
  const chartData = [
    ...historicalData.map(d => ({ label: d.date, value: d.value })),
    ...forecast.map(d => ({ label: d.date, value: d.value })),
  ];

  // Create confidence intervals (simplified)
  const historicalValues = historicalData.map(d => d.value);
  const mean = historicalValues.reduce((a, b) => a + b, 0) / historicalValues.length;
  const variance = historicalValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / historicalValues.length;
  const stdDev = Math.sqrt(variance);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span className="text-sm text-dark-text-muted">Historical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded" />
          <span className="text-sm text-dark-text-muted">Forecast</span>
        </div>
      </div>

      <div className="relative">
        <LineChart
          data={chartData}
          title={title}
          height={300}
          color="#3b82f6"
          formatValue={formatValue}
        />

        {/* Forecast section overlay */}
        <div
          className="absolute top-0 bottom-0 bg-purple-500/5 border-l border-purple-500/30"
          style={{
            left: `${(historicalData.length / chartData.length) * 100}%`,
            right: 0,
          }}
        >
          <div className="absolute top-2 left-2 text-xs text-purple-400 font-semibold">
            Forecast
          </div>
        </div>
      </div>

      {/* Forecast Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-dark-hover p-3 rounded-lg">
          <div className="text-xs text-dark-text-muted mb-1">Avg Forecast</div>
          <div className="text-lg font-semibold text-white">
            {formatValue(forecast.reduce((sum, d) => sum + d.value, 0) / forecast.length)}
          </div>
        </div>
        <div className="bg-dark-hover p-3 rounded-lg">
          <div className="text-xs text-dark-text-muted mb-1">Confidence</div>
          <div className="text-lg font-semibold text-white">
            ±{formatValue(stdDev * 1.96)}
          </div>
        </div>
        <div className="bg-dark-hover p-3 rounded-lg">
          <div className="text-xs text-dark-text-muted mb-1">Trend</div>
          <div className="text-lg font-semibold text-white">
            {forecast[forecast.length - 1].value > historicalData[historicalData.length - 1].value
              ? '↗ Increasing'
              : '↘ Decreasing'}
          </div>
        </div>
      </div>
    </div>
  );
}

