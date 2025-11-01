import { useState } from 'react';
import { Card } from '@/components/Card';

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  target?: string;
  status: 'success' | 'warning' | 'danger' | 'neutral';
}

const KPICard = ({ title, value, change, target, status }: KPICardProps) => {
  const statusColors = {
    success: 'border-green-500/50 bg-green-500/10',
    warning: 'border-yellow-500/50 bg-yellow-500/10',
    danger: 'border-red-500/50 bg-red-500/10',
    neutral: 'border-gray-700 bg-gray-800/50',
  };

  const changeColors = {
    success: 'text-green-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400',
    neutral: 'text-gray-400',
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${statusColors[status]} transition-all`}>
      <p className="text-sm font-medium text-gray-400 mb-2">{title}</p>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${changeColors[status]}`}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>
        {target && (
          <span className="text-xs text-gray-400">Target: {target}</span>
        )}
      </div>
    </div>
  );
};

export function ExecutiveDashboard() {
  const [selectedView, setSelectedView] = useState<'overview' | 'financial' | 'workforce' | 'clinical'>('overview');
  const [timeframe, setTimeframe] = useState('Q1 2025');

  // Unified Executive Metrics
  const executiveMetrics = {
    financial: {
      operatingMargin: 3.2,
      operatingMarginChange: -0.8,
      operatingMarginTarget: '5.0%',
      netRevenue: 87500000,
      revenueChange: 4.2,
      laborCostRatio: 52.3,
      laborCostChange: 1.5,
      daysInAR: 48.5,
      daysInARChange: -3.2,
    },
    workforce: {
      totalFTE: 1156.5,
      fteChange: 2.1,
      turnoverRate: 14.2,
      turnoverChange: -2.3,
      overtimeRate: 12.3,
      overtimeChange: 1.8,
      satisfactionScore: 3.8,
      satisfactionChange: 0.3,
    },
    clinical: {
      patientSatisfaction: 4.2,
      patientSatisfactionChange: 0.5,
      coreMetrics: 94.8,
      coreMetricsChange: 1.2,
      readmissionRate: 12.1,
      readmissionChange: -1.5,
      lengthOfStay: 4.3,
      lengthOfStayChange: -0.2,
    },
  };

  const criticalAlerts = [
    { id: '1', category: 'Financial', severity: 'Critical', title: 'Operating Margin Below Target', impact: 'High', action: 'Cost reduction plan needed' },
    { id: '2', category: 'Workforce', severity: 'High', title: 'ICU Burnout Risk Elevated', impact: 'High', action: 'Immediate intervention required' },
    { id: '3', category: 'Financial', severity: 'High', title: 'ED Budget Variance', impact: 'Medium', action: 'Review staffing model' },
    { id: '4', category: 'Clinical', severity: 'Medium', title: 'Quality Metrics Trending Down', impact: 'Medium', action: 'Quality improvement review' },
  ];

  const strategicInitiatives = [
    {
      name: 'Labor Cost Optimization',
      category: 'Cost Reduction',
      progress: 65,
      status: 'On Track',
      investment: 250000,
      projectedSavings: 3500000,
      roi: 1300,
      owner: 'COO',
    },
    {
      name: 'Revenue Cycle Enhancement',
      category: 'Revenue Growth',
      progress: 42,
      status: 'At Risk',
      investment: 500000,
      projectedSavings: 2800000,
      roi: 460,
      owner: 'CFO',
    },
    {
      name: 'Retention & Engagement Program',
      category: 'Workforce',
      progress: 78,
      status: 'Ahead',
      investment: 350000,
      projectedSavings: 2100000,
      roi: 500,
      owner: 'CHRO',
    },
    {
      name: 'Value-Based Care Transition',
      category: 'Strategic',
      progress: 35,
      status: 'On Track',
      investment: 1200000,
      projectedSavings: 5000000,
      roi: 317,
      owner: 'CEO',
    },
  ];

  const departmentPerformance = [
    { dept: 'Emergency', financial: 78, workforce: 65, clinical: 92, overall: 78 },
    { dept: 'Surgery', financial: 92, workforce: 88, clinical: 95, overall: 92 },
    { dept: 'ICU', financial: 85, workforce: 62, clinical: 93, overall: 80 },
    { dept: 'Med/Surg', financial: 88, workforce: 91, clinical: 89, overall: 89 },
    { dept: 'Outpatient', financial: 94, workforce: 93, clinical: 91, overall: 93 },
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
        return 'bg-red-500 text-white';
      case 'High':
        return 'bg-orange-500 text-white';
      case 'Medium':
        return 'bg-yellow-500 text-gray-900';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ahead':
        return 'text-green-400';
      case 'On Track':
        return 'text-blue-400';
      case 'At Risk':
        return 'text-yellow-400';
      case 'Behind':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-blue-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Executive Dashboard</h1>
            <p className="mt-1 text-sm text-gray-400">
              360° Operational Performance View - Healthcare Finance & Operations
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Q1 2025</option>
              <option>Q2 2025</option>
              <option>Q3 2025</option>
              <option>Q4 2025</option>
              <option>Annual 2025</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Export Board Report
            </button>
          </div>
        </div>

        {/* View Selector */}
        <div className="flex gap-2 p-1 bg-gray-900 rounded-lg border border-gray-800">
          {(['overview', 'financial', 'workforce', 'clinical'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view)}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                selectedView === view
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        {/* Enterprise KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Operating Margin"
            value={`${executiveMetrics.financial.operatingMargin}%`}
            change={executiveMetrics.financial.operatingMarginChange}
            target={executiveMetrics.financial.operatingMarginTarget}
            status="danger"
          />
          <KPICard
            title="Labor Cost Ratio"
            value={`${executiveMetrics.financial.laborCostRatio}%`}
            change={executiveMetrics.financial.laborCostChange}
            target="<50%"
            status="warning"
          />
          <KPICard
            title="Turnover Rate"
            value={`${executiveMetrics.workforce.turnoverRate}%`}
            change={-executiveMetrics.workforce.turnoverChange}
            target="<12%"
            status="success"
          />
          <KPICard
            title="Patient Satisfaction"
            value={`${executiveMetrics.clinical.patientSatisfaction}/5`}
            change={executiveMetrics.clinical.patientSatisfactionChange}
            target=">4.5"
            status="warning"
          />
        </div>

        {/* Critical Alerts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Executive Alerts</h2>
            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
              {criticalAlerts.filter(a => a.severity === 'Critical' || a.severity === 'High').length} High Priority
            </span>
          </div>
          <div className="space-y-3">
            {criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400 font-medium">{alert.category}</span>
                      <span className="text-white font-semibold">{alert.title}</span>
                    </div>
                    <p className="text-sm text-gray-400">{alert.action}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                  Review
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Strategic Initiatives */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Strategic Initiatives & ROI Tracking</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Initiative</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Owner</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">Progress</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Investment</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Projected Savings</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">ROI</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {strategicInitiatives.map((initiative) => (
                  <tr key={initiative.name} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="text-sm text-white font-medium">{initiative.name}</div>
                      <div className="text-xs text-gray-400">{initiative.category}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">{initiative.owner}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${initiative.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-white font-medium w-12 text-right">{initiative.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-orange-400">
                      {formatCurrency(initiative.investment)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-green-400 font-semibold">
                      {formatCurrency(initiative.projectedSavings)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-white font-bold">
                      {initiative.roi}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`text-sm font-semibold ${getStatusColor(initiative.status)}`}>
                        {initiative.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-gray-700">
                <tr>
                  <td className="py-3 px-4 text-sm font-semibold text-white" colSpan={3}>Total</td>
                  <td className="py-3 px-4 text-sm text-right font-semibold text-orange-400">
                    {formatCurrency(strategicInitiatives.reduce((sum, i) => sum + i.investment, 0))}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-semibold text-green-400">
                    {formatCurrency(strategicInitiatives.reduce((sum, i) => sum + i.projectedSavings, 0))}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-bold text-white">
                    {Math.round(
                      (strategicInitiatives.reduce((sum, i) => sum + i.projectedSavings, 0) /
                        strategicInitiatives.reduce((sum, i) => sum + i.investment, 0) - 1) * 100
                    )}%
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* Department Performance Scorecard */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Department Performance Scorecard</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Department</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">Financial</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">Workforce</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">Clinical</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">Overall Score</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-400">Performance</th>
                </tr>
              </thead>
              <tbody>
                {departmentPerformance.map((dept) => (
                  <tr key={dept.dept} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-white font-medium">{dept.dept}</td>
                    <td className={`py-3 px-4 text-center text-sm font-semibold ${getScoreColor(dept.financial)}`}>
                      {dept.financial}
                    </td>
                    <td className={`py-3 px-4 text-center text-sm font-semibold ${getScoreColor(dept.workforce)}`}>
                      {dept.workforce}
                    </td>
                    <td className={`py-3 px-4 text-center text-sm font-semibold ${getScoreColor(dept.clinical)}`}>
                      {dept.clinical}
                    </td>
                    <td className={`py-3 px-4 text-center text-lg font-bold ${getScoreColor(dept.overall)}`}>
                      {dept.overall}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-8 rounded ${
                              i < Math.round(dept.overall / 20)
                                ? dept.overall >= 90
                                  ? 'bg-green-500'
                                  : dept.overall >= 75
                                  ? 'bg-blue-500'
                                  : dept.overall >= 60
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                                : 'bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* AI Insights */}
        <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🤖</div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Insights</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-blue-400">Cost Optimization:</span> Analysis shows reducing ED overtime by 5% and optimizing surgery scheduling could save $1.2M annually while maintaining quality metrics.
                  </p>
                </div>
                <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-green-400">Revenue Opportunity:</span> Predictive model identifies 15% increase in outpatient volume possible by extending hours in Cardiology and Orthopedics.
                  </p>
                </div>
                <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-orange-400">Retention Risk:</span> Early warning system flagged 23 high-performing staff at elevated turnover risk. Recommended intervention: targeted retention packages and workload rebalancing.
                  </p>
                </div>
              </div>
              <button className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                View All AI Recommendations
              </button>
            </div>
          </div>
        </Card>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-6 bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-2 border-blue-500/50 hover:border-blue-500 rounded-lg text-left transition-all group">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
              Financial Deep Dive
            </h3>
            <p className="text-sm text-gray-400">
              Budget performance, revenue cycle, service line profitability
            </p>
          </button>
          <button className="p-6 bg-gradient-to-br from-green-600/20 to-green-700/20 border-2 border-green-500/50 hover:border-green-500 rounded-lg text-left transition-all group">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
              Workforce Analytics
            </h3>
            <p className="text-sm text-gray-400">
              Labor costs, productivity, engagement, turnover analysis
            </p>
          </button>
          <button className="p-6 bg-gradient-to-br from-purple-600/20 to-purple-700/20 border-2 border-purple-500/50 hover:border-purple-500 rounded-lg text-left transition-all group">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
              Clinical Quality
            </h3>
            <p className="text-sm text-gray-400">
              Quality metrics, patient outcomes, safety indicators
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

