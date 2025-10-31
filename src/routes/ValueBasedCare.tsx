import { useState } from 'react';
import { Card } from '@/components/Card';

interface VBCMetricCardProps {
  title: string;
  value: string;
  benchmark?: string;
  trend: 'up' | 'down' | 'neutral';
  status: 'success' | 'warning' | 'danger';
}

const VBCMetricCard = ({ title, value, benchmark, trend, status }: VBCMetricCardProps) => {
  const statusColors = {
    success: 'border-green-500/50 bg-green-500/10',
    warning: 'border-yellow-500/50 bg-yellow-500/10',
    danger: 'border-red-500/50 bg-red-500/10',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${statusColors[status]}`}>
      <p className="text-sm text-gray-400 mb-2">{title}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-white">{value}</p>
          {benchmark && (
            <p className="text-xs text-gray-400 mt-1">Benchmark: {benchmark}</p>
          )}
        </div>
        <span className="text-2xl text-gray-400">{trendIcons[trend]}</span>
      </div>
    </div>
  );
};

export function ValueBasedCare() {
  const [selectedPeriod, setSelectedPeriod] = useState('2025');
  const [selectedContract, setSelectedContract] = useState('All Contracts');

  // Mock Value-Based Care Metrics
  const vbcMetrics = {
    totalCostOfCare: 8250,
    qualityScore: 4.3,
    patientSatisfaction: 87.5,
    sharedSavings: 2850000,
    acoPerformance: 92.3,
    readmissionRate: 11.2,
  };

  const qualityMetrics = [
    { metric: 'Diabetes HbA1c Control', score: 88.5, target: 85.0, status: 'success' },
    { metric: 'Blood Pressure Control', score: 82.1, target: 80.0, status: 'success' },
    { metric: 'Colorectal Cancer Screening', score: 76.3, target: 80.0, status: 'warning' },
    { metric: 'Breast Cancer Screening', score: 91.2, target: 85.0, status: 'success' },
    { metric: 'Preventive Care Visits', score: 68.5, target: 75.0, status: 'danger' },
    { metric: 'Medication Adherence', score: 79.8, target: 75.0, status: 'success' },
  ];

  const vbcContracts = [
    {
      name: 'Medicare MSSP ACO',
      type: 'Shared Savings',
      patients: 12450,
      totalCost: 95800000,
      quality: 93.2,
      savings: 1850000,
      status: 'On Track',
    },
    {
      name: 'Commercial Bundle - Hip/Knee',
      type: 'Bundled Payment',
      patients: 285,
      totalCost: 8500000,
      quality: 96.5,
      savings: 650000,
      status: 'Exceeding',
    },
    {
      name: 'Medicaid ACO',
      type: 'Shared Savings',
      patients: 8750,
      totalCost: 62400000,
      quality: 88.7,
      savings: 350000,
      status: 'At Risk',
    },
    {
      name: 'Commercial Upside/Downside',
      type: 'Two-Sided Risk',
      patients: 5240,
      totalCost: 48200000,
      quality: 91.5,
      savings: -125000,
      status: 'At Risk',
    },
  ];

  const costOfCareDrivers = [
    { category: 'Inpatient Admissions', cost: 3200, benchmark: 3500, variance: -8.6 },
    { category: 'Emergency Department', cost: 850, benchmark: 720, variance: 18.1 },
    { category: 'Outpatient Procedures', cost: 1450, benchmark: 1380, variance: 5.1 },
    { category: 'Primary Care', cost: 520, benchmark: 480, variance: 8.3 },
    { category: 'Specialty Care', cost: 1180, benchmark: 1100, variance: 7.3 },
    { category: 'Pharmacy', cost: 1050, benchmark: 950, variance: 10.5 },
  ];

  const riskAdjustment = [
    { condition: 'Diabetes with Complications', patients: 1245, hccScore: 2.8, impact: 'High' },
    { condition: 'Congestive Heart Failure', patients: 876, hccScore: 3.2, impact: 'High' },
    { condition: 'Chronic Kidney Disease', patients: 654, hccScore: 2.4, impact: 'Medium' },
    { condition: 'COPD', patients: 892, hccScore: 2.1, impact: 'Medium' },
    { condition: 'Depression', patients: 1534, hccScore: 1.5, impact: 'Low' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Exceeding':
      case 'On Track':
        return 'text-green-400';
      case 'At Risk':
        return 'text-yellow-400';
      case 'Below Target':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };


  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Value-Based Care Analytics</h1>
            <p className="mt-1 text-sm text-gray-400">
              ACO Performance, Quality Metrics & Cost of Care Analysis
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedContract}
              onChange={(e) => setSelectedContract(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Contracts</option>
              <option>Medicare MSSP ACO</option>
              <option>Commercial Bundle</option>
              <option>Medicaid ACO</option>
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>2025</option>
              <option>2024</option>
              <option>Q1 2025</option>
              <option>Q2 2025</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Key VBC Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <VBCMetricCard
            title="Total Cost of Care (PMPM)"
            value={`$${vbcMetrics.totalCostOfCare}`}
            benchmark="$8,500"
            trend="down"
            status="success"
          />
          <VBCMetricCard
            title="Quality Score"
            value={`${vbcMetrics.qualityScore}/5.0`}
            benchmark="4.0"
            trend="up"
            status="success"
          />
          <VBCMetricCard
            title="Shared Savings"
            value={formatCurrency(vbcMetrics.sharedSavings)}
            trend="up"
            status="success"
          />
          <VBCMetricCard
            title="ACO Performance"
            value={`${vbcMetrics.acoPerformance}%`}
            benchmark="85%"
            trend="up"
            status="success"
          />
        </div>

        {/* VBC Contracts Performance */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Value-Based Contracts Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Contract Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Type</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Patients</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Total Cost</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Quality Score</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Savings/(Loss)</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {vbcContracts.map((contract) => (
                  <tr key={contract.name} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-white font-medium">{contract.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{contract.type}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-300">
                      {contract.patients.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-white">
                      {formatCurrency(contract.totalCost)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-white">{contract.quality}%</td>
                    <td className={`py-3 px-4 text-sm text-right font-semibold ${
                      contract.savings >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatCurrency(contract.savings)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`text-sm font-semibold ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quality Metrics */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quality Metrics Performance</h2>
          <div className="space-y-4">
            {qualityMetrics.map((metric) => (
              <div key={metric.metric} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">{metric.metric}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">Target: {metric.target}%</span>
                    <span className={`text-sm font-semibold ${
                      metric.status === 'success' ? 'text-green-400' :
                      metric.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {metric.score}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      metric.status === 'success' ? 'bg-green-500' :
                      metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Cost of Care Drivers */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Cost of Care Drivers (PMPM)</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Category</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Actual PMPM</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Benchmark</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Variance</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Opportunity</th>
                </tr>
              </thead>
              <tbody>
                {costOfCareDrivers.map((driver) => (
                  <tr key={driver.category} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-white">{driver.category}</td>
                    <td className="py-3 px-4 text-sm text-right text-white font-semibold">
                      ${driver.cost}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-300">
                      ${driver.benchmark}
                    </td>
                    <td className={`py-3 px-4 text-sm text-right font-semibold ${
                      driver.variance < 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {driver.variance > 0 ? '+' : ''}{driver.variance.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-white">
                      {driver.variance > 0 ? formatCurrency((driver.cost - driver.benchmark) * 12450 * 12) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Risk Adjustment */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Risk Adjustment & HCC Coding</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Condition</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Patients</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">HCC Score</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Financial Impact</th>
                </tr>
              </thead>
              <tbody>
                {riskAdjustment.map((item) => (
                  <tr key={item.condition} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-white">{item.condition}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-300">{item.patients}</td>
                    <td className="py-3 px-4 text-sm text-right text-white font-semibold">{item.hccScore}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.impact === 'High' ? 'bg-red-500/20 text-red-400' :
                        item.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {item.impact}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-3">Value-Based Care Recommendations</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <p className="text-sm font-semibold text-blue-400 mb-2">Cost Reduction Opportunity</p>
                  <p className="text-sm text-gray-300">
                    Reducing ED utilization to benchmark levels could save $1.6M annually. Implement care coordination and telehealth programs.
                  </p>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <p className="text-sm font-semibold text-green-400 mb-2">Quality Improvement</p>
                  <p className="text-sm text-gray-300">
                    Colorectal and preventive care screening rates below target. Focus on outreach and patient engagement to improve quality scores.
                  </p>
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <p className="text-sm font-semibold text-orange-400 mb-2">Risk Adjustment</p>
                  <p className="text-sm text-gray-300">
                    Improve HCC coding accuracy to capture true patient complexity. Estimated opportunity: $850K in additional risk adjustment revenue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

