import { useState } from 'react';
import { Card } from '@/components/Card';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  icon?: string;
}

const MetricCard = ({ title, value, subtitle, trend = 'neutral', trendValue, icon }: MetricCardProps) => {
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
          {subtitle && (
            <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
          )}
          {trendValue !== undefined && (
            <p className={`mt-2 text-sm ${trendColors[trend]}`}>
              {trendValue > 0 ? '+' : ''}{trendValue.toFixed(1)}% vs last month
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

export function WorkforceDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('January 2025');

  // Mock data - will be replaced with real API calls
  const workforceMetrics = {
    totalEmployees: 1247,
    activeFTE: 1156.5,
    totalLaborCost: 8750000,
    overtimePercentage: 12.3,
    productivityIndex: 98.5,
    avgSatisfaction: 3.8,
    burnoutRisk: 18.5,
    turnoverRate: 14.2,
  };

  const workforceAlerts = [
    {
      id: '1',
      severity: 'Critical' as const,
      title: 'High Burnout Risk in ICU',
      message: '32% of ICU staff showing high burnout indicators',
      value: 32,
    },
    {
      id: '2',
      severity: 'High' as const,
      title: 'Overtime Spike in ED',
      message: 'Emergency Dept overtime increased 28% this month',
      value: 28,
    },
    {
      id: '3',
      severity: 'Medium' as const,
      title: 'Understaffing Alert',
      message: 'Surgery unit 15% below recommended staffing levels',
      value: -15,
    },
  ];

  const departmentMetrics = [
    {
      name: 'Emergency Department',
      employees: 145,
      fte: 138.5,
      overtime: 18.5,
      productivity: 95.2,
      satisfaction: 3.2,
      status: 'attention',
    },
    {
      name: 'ICU',
      employees: 98,
      fte: 95.0,
      overtime: 22.1,
      productivity: 101.3,
      satisfaction: 3.4,
      status: 'critical',
    },
    {
      name: 'Medical/Surgical',
      employees: 287,
      fte: 265.5,
      overtime: 8.3,
      productivity: 98.7,
      satisfaction: 4.1,
      status: 'good',
    },
    {
      name: 'Surgery',
      employees: 156,
      fte: 148.0,
      overtime: 11.2,
      productivity: 102.1,
      satisfaction: 4.3,
      status: 'good',
    },
    {
      name: 'Outpatient Clinics',
      employees: 218,
      fte: 198.5,
      overtime: 5.1,
      productivity: 96.8,
      satisfaction: 4.2,
      status: 'good',
    },
  ];

  const staffingForecasts = [
    { date: 'Feb 1', predictedVolume: 485, recommendedFTE: 142.5, currentFTE: 138.5, gap: -4.0 },
    { date: 'Feb 2', predictedVolume: 512, recommendedFTE: 148.0, currentFTE: 138.5, gap: -9.5 },
    { date: 'Feb 3', predictedVolume: 498, recommendedFTE: 145.5, currentFTE: 140.0, gap: -5.5 },
    { date: 'Feb 4', predictedVolume: 465, recommendedFTE: 138.0, currentFTE: 140.0, gap: 2.0 },
    { date: 'Feb 5', predictedVolume: 478, recommendedFTE: 141.0, currentFTE: 138.5, gap: -2.5 },
  ];

  const turnoverByCategory = [
    { category: 'RN - Registered Nurse', count: 12, rate: 18.5, regrettable: 9 },
    { category: 'Physician', count: 3, rate: 8.1, regrettable: 2 },
    { category: 'Nurse Practitioner', count: 2, rate: 11.2, regrettable: 2 },
    { category: 'Medical Tech', count: 8, rate: 16.3, regrettable: 5 },
    { category: 'Support Staff', count: 15, rate: 22.1, regrettable: 6 },
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500/20 text-green-400';
      case 'attention':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'critical':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Workforce Dashboard</h1>
            <p className="mt-1 text-sm text-gray-400">
              Workforce Optimization & Employee Engagement Analytics
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>January 2025</option>
              <option>February 2025</option>
              <option>March 2025</option>
              <option>Q1 2025</option>
              <option>Annual 2025</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Employees"
            value={workforceMetrics.totalEmployees.toString()}
            subtitle={`${workforceMetrics.activeFTE} FTE`}
            icon="👥"
          />
          <MetricCard
            title="Labor Costs"
            value={formatCurrency(workforceMetrics.totalLaborCost)}
            trend="down"
            trendValue={-2.3}
            icon="💰"
          />
          <MetricCard
            title="Overtime Rate"
            value={`${workforceMetrics.overtimePercentage}%`}
            trend="down"
            trendValue={1.8}
            icon="⏰"
          />
          <MetricCard
            title="Productivity Index"
            value={workforceMetrics.productivityIndex.toString()}
            trend="up"
            trendValue={2.1}
            icon="📈"
          />
        </div>

        {/* Alerts & Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Workforce Alerts */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Active Alerts</h2>
            <div className="space-y-3">
              {workforceAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium uppercase">{alert.severity}</span>
                    <span className="text-sm font-semibold">
                      {Math.abs(alert.value)}%
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold mb-1">{alert.title}</h3>
                  <p className="text-xs opacity-80">{alert.message}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Engagement & Burnout */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Employee Engagement</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Average Satisfaction</span>
                  <span className="text-2xl font-bold text-white">
                    {workforceMetrics.avgSatisfaction}/5.0
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: `${(workforceMetrics.avgSatisfaction / 5) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Based on 847 survey responses</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">High Burnout Risk</span>
                  <span className="text-2xl font-bold text-orange-400">
                    {workforceMetrics.burnoutRisk}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-orange-500 h-3 rounded-full"
                    style={{ width: `${workforceMetrics.burnoutRisk}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  231 employees showing burnout indicators
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Annual Turnover Rate</span>
                  <span className="text-2xl font-bold text-red-400">
                    {workforceMetrics.turnoverRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-red-500 h-3 rounded-full"
                    style={{ width: `${workforceMetrics.turnoverRate}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Target: &lt;12% | Industry Avg: 17.8%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Department Performance */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Department Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Department</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Employees</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">FTE</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Overtime %</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Productivity</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Satisfaction</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {departmentMetrics.map((dept) => (
                  <tr key={dept.name} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-white font-medium">{dept.name}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-300">{dept.employees}</td>
                    <td className="py-3 px-4 text-sm text-right text-white">{dept.fte}</td>
                    <td className={`py-3 px-4 text-sm text-right font-semibold ${
                      dept.overtime > 15 ? 'text-red-400' : dept.overtime > 10 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {dept.overtime.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-white">{dept.productivity}</td>
                    <td className="py-3 px-4 text-sm text-right text-white">{dept.satisfaction.toFixed(1)}/5</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${getStatusColor(dept.status)}`}>
                        {dept.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* AI Staffing Forecasts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">AI Staffing Forecasts</h2>
              <p className="text-sm text-gray-400 mt-1">Next 5 days - Emergency Department</p>
            </div>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
              AI-Powered
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Predicted Volume</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Recommended FTE</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Current FTE</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Staffing Gap</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {staffingForecasts.map((forecast) => (
                  <tr key={forecast.date} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-white font-medium">{forecast.date}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-300">{forecast.predictedVolume}</td>
                    <td className="py-3 px-4 text-sm text-right text-blue-400 font-semibold">{forecast.recommendedFTE}</td>
                    <td className="py-3 px-4 text-sm text-right text-white">{forecast.currentFTE}</td>
                    <td className={`py-3 px-4 text-sm text-right font-semibold ${
                      forecast.gap < -5 ? 'text-red-400' : forecast.gap < 0 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {forecast.gap > 0 ? '+' : ''}{forecast.gap.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {forecast.gap < -5 && (
                        <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors">
                          Add Staff
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Turnover Analysis */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Turnover Analysis by Job Category</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Job Category</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Terminations (YTD)</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Turnover Rate</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Regrettable</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Est. Replacement Cost</th>
                </tr>
              </thead>
              <tbody>
                {turnoverByCategory.map((item) => (
                  <tr key={item.category} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-white">{item.category}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-300">{item.count}</td>
                    <td className={`py-3 px-4 text-sm text-right font-semibold ${
                      item.rate > 20 ? 'text-red-400' : item.rate > 15 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {item.rate.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-orange-400 font-semibold">{item.regrettable}</td>
                    <td className="py-3 px-4 text-sm text-right text-white">
                      {formatCurrency(item.count * 75000)} {/* Avg replacement cost */}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-gray-700">
                <tr>
                  <td className="py-3 px-4 text-sm font-semibold text-white">Total</td>
                  <td className="py-3 px-4 text-sm text-right font-semibold text-white">
                    {turnoverByCategory.reduce((sum, item) => sum + item.count, 0)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-semibold text-white">
                    {workforceMetrics.turnoverRate}%
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-semibold text-orange-400">
                    {turnoverByCategory.reduce((sum, item) => sum + item.regrettable, 0)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-semibold text-white">
                    {formatCurrency(turnoverByCategory.reduce((sum, item) => sum + item.count, 0) * 75000)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
            Create Schedule
          </button>
          <button className="py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
            Run Engagement Survey
          </button>
          <button className="py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
            View Analytics
          </button>
          <button className="py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
            Retention Plan
          </button>
        </div>
      </div>
    </div>
  );
}

