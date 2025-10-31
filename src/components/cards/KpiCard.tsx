/**
 * KPI Card component
 * Displays a key performance indicator with value and optional description
 */

import { ReactNode } from 'react';
import { Card } from '@/components/Card';

interface KpiCardProps {
  title: string;
  value: string | number | ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function KpiCard({
  title,
  value,
  description,
  trend,
  trendValue,
  className = '',
}: KpiCardProps) {
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '';

  return (
    <Card className={className}>
      <div className="flex flex-col">
        <h4 className="text-sm font-medium text-gray-600 mb-1">{title}</h4>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {trend && trendValue && (
            <span
              className={`text-sm font-medium ${
                trend === 'up'
                  ? 'text-green-600'
                  : trend === 'down'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {trendIcon} {trendValue}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        )}
      </div>
    </Card>
  );
}
