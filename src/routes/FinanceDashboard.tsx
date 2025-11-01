import { useState } from 'react';
import { Card } from '@/components/Card';
import { LineChart, BarChart, DonutChart } from '@/components/Charts';
import { ForecastChart } from '@/components/ForecastChart';
import { ComparisonView } from '@/components/ComparisonView';
import { AdvancedFilter, FilterCriterion } from '@/components/AdvancedFilter';
import { ExportManager } from '@/lib/export/ExportManager';
import { useSmartDataRefresh } from '@/hooks/useDataRefresh';
import { Download, TrendingUp, RefreshCw } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}

const MetricCard = ({ title, value, change, changeLabel, trend = 'neutral', icon }: MetricCardProps) => {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-400',
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
          {change !== undefined && (
            <p className={`mt-2 text-sm ${trendColors[trend]}`}>
              {change > 0 ? '+' : ''}{change}% {changeLabel || 'vs last period'}
            </p>
          )}
        </div>
        {icon && (
          <div className="ml-4 text-3xl opacity-50">{icon}</div>
        )}
      </div>
    </Card>
  );
};

export function FinanceDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('Q1 2025');
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'comparison' | 'forecast'>('overview');
  
  // Real-time data refresh
  const { lastRefresh, isRefreshing, refresh } = useSmartDataRefresh({
    refreshInterval: 60000,
    onRefresh: async () => {
      // Refresh data here
      console.log('Refreshing financial data...');
    },
  });

  // Mock data - will be replaced with real API calls
  const financialMetrics = {
    totalBudget: 25600000,
    actualSpending: 24350000,
    variance: -4.9,
    totalRevenue: 32500000,
    netRevenue: 28750000,
    denialRate: 8.2,
    collectionRate: 88.5,
  };

  // Trend data for charts
  const revenueTrend = [
    { label: 'Jan', value: 10200000 },
    { label: 'Feb', value: 10800000 },
    { label: 'Mar', value: 11500000 },
  ];

  // Cost trend data for future use
  // const costTrend = [
  //   { label: 'Jan', value: 7800000 },
  //   { label: 'Feb', value: 8200000 },
  //   { label: 'Mar', value: 8350000 },
  // ];

  const payerMixData = [
    { label: 'Medicare', value: 12500000, color: '#3b82f6' },
    { label: 'Commercial', value: 9800000, color: '#8b5cf6' },
    { label: 'Medicaid', value: 4200000, color: '#10b981' },
    { label: 'Self-Pay', value: 2250000, color: '#f59e0b' },
  ];

  const historicalData = [
    { date: '2024-10', value: 29500000 },
    { date: '2024-11', value: 30200000 },
    { date: '2024-12', value: 31000000 },
    { date: '2025-01', value: 10200000 },
    { date: '2025-02', value: 10800000 },
    { date: '2025-03', value: 11500000 },
  ];

  const benchmarkData = [
    { label: 'Collection Rate', value: 88.5, benchmark: 92.0 },
    { label: 'Days in A/R', value: 42, benchmark: 35 },
    { label: 'Net Revenue', value: 28750000, benchmark: 30000000 },
    { label: 'Operating Margin', value: 11.2, benchmark: 12.5 },
  ];

  const handleExport = () => {
    const exportData = topCostCenters.map(center => ({
      'Cost Center': center.name,
      'Budget': center.budget,
      'Actual': center.actual,
      'Variance %': center.variance,
    }));
    ExportManager.toExcel(exportData, 'financial-report.xlsx');
  };

  const handleApplyFilters = (filters: FilterCriterion[]) => {
    console.log('Applied filters:', filters);
    // Apply filters to data
  };

  const filterFields = [
    { key: 'costCenter', label: 'Cost Center', type: 'text' as const },
    { key: 'variance', label: 'Variance %', type: 'number' as const },
    { key: 'status', label: 'Status', type: 'select' as const, options: [
      { value: 'on-track', label: 'On Track' },
      { value: 'watch', label: 'Watch' },
      { value: 'alert', label: 'Alert' },
    ]},
  ];

  const budgetAlerts = [
    {
      id: '1',
      severity: 'High' as const,
      title: 'Emergency Dept Over Budget',
      message: 'ED spending is 12% over budget for Q1',
      variance: 12.3,
    },
    {
      id: '2',
      severity: 'Medium' as const,
      title: 'Surgery Revenue Below Target',
      message: 'Surgical services revenue 8% below projection',
      variance: -8.1,
    },
    {
      id: '3',
      severity: 'Critical' as const,
      title: 'Denial Rate Spike',
      message: 'Claims denial rate increased from 6.5% to 8.2%',
      variance: 26.2,
    },
  ];

  const topCostCenters = [
    { name: 'Emergency Department', budget: 5200000, actual: 5850000, variance: 12.5 },
    { name: 'Surgery', budget: 4800000, actual: 4650000, variance: -3.1 },
    { name: 'ICU', budget: 3500000, actual: 3520000, variance: 0.6 },
    { name: 'Medical/Surgical Units', budget: 3200000, actual: 3100000, variance: -3.1 },
    { name: 'Imaging', budget: 2100000, actual: 2050000, variance: -2.4 },
  ];

  const serviceLineProfitability = [
    { service: 'Cardiology', revenue: 6500000, costs: 4200000, margin: 35.4, status: 'High Profit' },
    { service: 'Orthopedics', revenue: 5800000, costs: 3900000, margin: 32.8, status: 'High Profit' },
    { service: 'General Surgery', revenue: 4200000, costs: 3100000, margin: 26.2, status: 'High Profit' },
    { service: 'Emergency Medicine', revenue: 3800000, costs: 3500000, margin: 7.9, status: 'Break Even' },
    { service: 'Primary Care', revenue: 2500000, costs: 2400000, margin: 4.0, status: 'Break Even' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 5) return 'text-red-500';
    if (variance < -5) return 'text-green-500';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Financial Dashboard</h1>
            <p className="mt-1 text-sm text-gray-400">
              Healthcare Finance & Operations Analytics
              {lastRefresh && (
                <span className="ml-2">• Last updated: {lastRefresh.toLocaleTimeString()}</span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={refresh}
              disabled={isRefreshing}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Q1 2025</option>
              <option>Q2 2025</option>
              <option>Q3 2025</option>
              <option>Q4 2025</option>
              <option>Annual 2025</option>
            </select>
            <AdvancedFilter
              fields={filterFields}
              onApplyFilters={handleApplyFilters}
              onClear={() => console.log('Filters cleared')}
            />
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-700">
          {(['overview', 'trends', 'comparison', 'forecast'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Budget"
            value={formatCurrency(financialMetrics.totalBudget)}
            icon="💰"
          />
          <MetricCard
            title="Actual Spending"
            value={formatCurrency(financialMetrics.actualSpending)}
            change={financialMetrics.variance}
            changeLabel="vs budget"
            trend={financialMetrics.variance > 0 ? 'down' : 'up'}
            icon="📊"
          />
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(financialMetrics.totalRevenue)}
            change={5.2}
            trend="up"
            icon="💵"
          />
          <MetricCard
            title="Collection Rate"
            value={`${financialMetrics.collectionRate}%`}
            change={2.1}
            trend="up"
            icon="✅"
          />
        </div>

        {/* Alerts & Budget Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Active Alerts</h2>
            <div className="space-y-3">
              {budgetAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium uppercase">{alert.severity}</span>
                    <span className={`text-sm font-semibold ${getVarianceColor(alert.variance)}`}>
                      {alert.variance > 0 ? '+' : ''}{alert.variance.toFixed(1)}%
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold mb-1">{alert.title}</h3>
                  <p className="text-xs opacity-80">{alert.message}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Revenue Cycle KPIs */}
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-4">Revenue Cycle Performance</h2>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Net Revenue</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(financialMetrics.netRevenue)}
                </p>
                <p className="text-xs text-green-500 mt-1">+3.2% vs last quarter</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Denial Rate</p>
                <p className="text-2xl font-bold text-orange-400">
                  {financialMetrics.denialRate}%
                </p>
                <p className="text-xs text-red-500 mt-1">+1.7% vs last quarter</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Collection Rate</p>
                <p className="text-2xl font-bold text-green-400">
                  {financialMetrics.collectionRate}%
                </p>
                <p className="text-xs text-green-500 mt-1">+2.1% vs last quarter</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-sm font-semibold text-white mb-3">Revenue by Payer Type</h3>
              <div className="space-y-2">
                {[
                  { payer: 'Medicare', amount: 12500000, percentage: 43.5 },
                  { payer: 'Commercial', amount: 9800000, percentage: 34.1 },
                  { payer: 'Medicaid', amount: 4200000, percentage: 14.6 },
                  { payer: 'Self-Pay', amount: 2250000, percentage: 7.8 },
                ].map((item) => (
                  <div key={item.payer} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm text-gray-300 w-24">{item.payer}</span>
                      <div className="flex-1 bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-semibold text-white">{formatCurrency(item.amount)}</p>
                      <p className="text-xs text-gray-400">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Cost Center Performance */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Budget Performance by Cost Center</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Cost Center</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Budget</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Actual</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Variance</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {topCostCenters.map((center) => (
                  <tr key={center.name} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-white">{center.name}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-300">
                      {formatCurrency(center.budget)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-white font-semibold">
                      {formatCurrency(center.actual)}
                    </td>
                    <td className={`py-3 px-4 text-sm text-right font-semibold ${getVarianceColor(center.variance)}`}>
                      {center.variance > 0 ? '+' : ''}{center.variance.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        Math.abs(center.variance) < 5
                          ? 'bg-green-500/20 text-green-400'
                          : Math.abs(center.variance) < 10
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {Math.abs(center.variance) < 5 ? 'On Track' : Math.abs(center.variance) < 10 ? 'Watch' : 'Alert'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Service Line Profitability */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Service Line Profitability Analysis</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Service Line</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Revenue</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Costs</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Margin</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {serviceLineProfitability.map((line) => (
                  <tr key={line.service} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-white font-medium">{line.service}</td>
                    <td className="py-3 px-4 text-sm text-right text-green-400">
                      {formatCurrency(line.revenue)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-orange-400">
                      {formatCurrency(line.costs)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-white font-semibold">
                      {line.margin.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        line.margin >= 20
                          ? 'bg-green-500/20 text-green-400'
                          : line.margin >= 10
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {line.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Tab Content */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            <Card className="p-6">
              <LineChart
                data={revenueTrend}
                title="Revenue Trend"
                height={300}
                color="#10b981"
                formatValue={(v) => formatCurrency(v)}
              />
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <BarChart
                  data={revenueTrend}
                  title="Monthly Revenue"
                  height={250}
                  formatValue={(v) => formatCurrency(v)}
                />
              </Card>
              <Card className="p-6">
                <DonutChart
                  data={payerMixData}
                  title="Payer Mix Distribution"
                  size={220}
                  formatValue={(v) => formatCurrency(v)}
                />
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'comparison' && (
          <Card className="p-6">
            <ComparisonView
              title="Performance vs. Industry Benchmarks"
              data={benchmarkData}
              formatValue={(v) => v >= 1000 ? formatCurrency(v) : v.toFixed(1)}
              showBenchmarks={true}
            />
          </Card>
        )}

        {activeTab === 'forecast' && (
          <Card className="p-6">
            <ForecastChart
              historicalData={historicalData}
              forecastPeriods={6}
              title="Revenue Forecast (Next 6 Months)"
              formatValue={(v) => formatCurrency(v)}
            />
          </Card>
        )}

        {/* Quick Actions */}
        <div className="flex gap-4">
          <button className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Create Budget
          </button>
          <button className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
            Run Variance Analysis
          </button>
          <button className="flex-1 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
            View ROI Tracker
          </button>
        </div>
      </div>
    </div>
  );
}

