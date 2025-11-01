/**
 * Analytics Engine - Advanced KPI calculations and insights
 */

export interface KPIResult {
  value: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  status: 'good' | 'warning' | 'critical';
  insight: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export class AnalyticsEngine {
  /**
   * Calculate trend between two values
   */
  static calculateTrend(current: number, previous: number): { trend: 'up' | 'down' | 'stable'; percentage: number } {
    if (previous === 0) {
      return { trend: 'stable', percentage: 0 };
    }

    const percentage = ((current - previous) / previous) * 100;
    
    if (Math.abs(percentage) < 0.5) {
      return { trend: 'stable', percentage: 0 };
    }

    return {
      trend: percentage > 0 ? 'up' : 'down',
      percentage: Math.abs(percentage),
    };
  }

  /**
   * Calculate moving average
   */
  static movingAverage(data: number[], window: number): number[] {
    const result: number[] = [];
    
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - window + 1);
      const windowData = data.slice(start, i + 1);
      const avg = windowData.reduce((sum, val) => sum + val, 0) / windowData.length;
      result.push(avg);
    }

    return result;
  }

  /**
   * Simple linear regression for forecasting
   */
  static linearRegression(data: TimeSeriesData[]): { slope: number; intercept: number } {
    const n = data.length;
    const x = data.map((_, i) => i);
    const y = data.map(d => d.value);

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  /**
   * Forecast future values
   */
  static forecast(historicalData: TimeSeriesData[], periods: number): TimeSeriesData[] {
    const { slope, intercept } = this.linearRegression(historicalData);
    const forecast: TimeSeriesData[] = [];
    
    const lastDate = new Date(historicalData[historicalData.length - 1].date);

    for (let i = 1; i <= periods; i++) {
      const x = historicalData.length + i - 1;
      const value = slope * x + intercept;
      
      const forecastDate = new Date(lastDate);
      forecastDate.setMonth(forecastDate.getMonth() + i);
      
      forecast.push({
        date: forecastDate.toISOString().split('T')[0],
        value: Math.max(0, value), // Ensure non-negative
      });
    }

    return forecast;
  }

  /**
   * Calculate variance analysis
   */
  static varianceAnalysis(actual: number, budget: number): {
    variance: number;
    variancePercent: number;
    status: 'favorable' | 'unfavorable' | 'on-track';
  } {
    const variance = actual - budget;
    const variancePercent = budget !== 0 ? (variance / budget) * 100 : 0;

    let status: 'favorable' | 'unfavorable' | 'on-track' = 'on-track';
    if (Math.abs(variancePercent) > 5) {
      status = variance < 0 ? 'favorable' : 'unfavorable';
    }

    return { variance, variancePercent, status };
  }

  /**
   * Calculate correlation between two datasets
   */
  static correlation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denomX = 0;
    let denomY = 0;

    for (let i = 0; i < n; i++) {
      const diffX = x[i] - meanX;
      const diffY = y[i] - meanY;
      numerator += diffX * diffY;
      denomX += diffX * diffX;
      denomY += diffY * diffY;
    }

    const denom = Math.sqrt(denomX * denomY);
    return denom === 0 ? 0 : numerator / denom;
  }

  /**
   * Detect anomalies using standard deviation
   */
  static detectAnomalies(data: number[], threshold: number = 2): number[] {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);

    return data.map((value, index) => {
      const zScore = Math.abs((value - mean) / stdDev);
      return zScore > threshold ? index : -1;
    }).filter(index => index !== -1);
  }

  /**
   * Calculate Year-over-Year growth
   */
  static yoyGrowth(currentYear: number[], previousYear: number[]): number[] {
    return currentYear.map((value, i) => {
      const prev = previousYear[i] || 0;
      return prev === 0 ? 0 : ((value - prev) / prev) * 100;
    });
  }

  /**
   * Calculate rolling metrics (sum, avg, min, max)
   */
  static rollingMetrics(data: number[], window: number): {
    sum: number[];
    avg: number[];
    min: number[];
    max: number[];
  } {
    const result = {
      sum: [] as number[],
      avg: [] as number[],
      min: [] as number[],
      max: [] as number[],
    };

    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - window + 1);
      const windowData = data.slice(start, i + 1);
      
      result.sum.push(windowData.reduce((a, b) => a + b, 0));
      result.avg.push(windowData.reduce((a, b) => a + b, 0) / windowData.length);
      result.min.push(Math.min(...windowData));
      result.max.push(Math.max(...windowData));
    }

    return result;
  }

  /**
   * Benchmark comparison
   */
  static benchmark(value: number, benchmarks: { [key: string]: number }): {
    percentile: number;
    ranking: string;
    comparison: { [key: string]: number };
  } {
    const comparison: { [key: string]: number } = {};
    let betterThan = 0;

    Object.entries(benchmarks).forEach(([key, benchmark]) => {
      const diff = ((value - benchmark) / benchmark) * 100;
      comparison[key] = diff;
      if (value >= benchmark) betterThan++;
    });

    const percentile = (betterThan / Object.keys(benchmarks).length) * 100;
    
    let ranking = 'Poor';
    if (percentile >= 90) ranking = 'Excellent';
    else if (percentile >= 75) ranking = 'Good';
    else if (percentile >= 50) ranking = 'Average';
    else if (percentile >= 25) ranking = 'Below Average';

    return { percentile, ranking, comparison };
  }

  /**
   * Calculate run rate (annualized projection)
   */
  static runRate(valueToDate: number, periodsElapsed: number, totalPeriods: number = 12): number {
    if (periodsElapsed === 0) return 0;
    return (valueToDate / periodsElapsed) * totalPeriods;
  }
}

