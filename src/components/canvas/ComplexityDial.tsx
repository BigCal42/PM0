/**
 * ComplexityDial component
 * Visual display of complexity score with dial visualization
 */

import { Card } from '@/components/Card';
import { calculateComplexity, getComplexityColor, type ComplexityFactors } from '@/lib/derive/complexity';
import { strings } from '@/content/strings';

interface ComplexityDialProps {
  factors: ComplexityFactors;
}

export function ComplexityDial({ factors }: ComplexityDialProps) {
  const complexity = calculateComplexity(factors);

  // Calculate dial rotation (0-180 degrees for 0-100 score)
  const rotation = (complexity.score / 100) * 180;

  return (
    <Card title={strings.canvas.complexity.title}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background arc */}
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Score arc */}
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke={complexity.band === 'critical' ? '#dc2626' : complexity.band === 'high' ? '#ea580c' : complexity.band === 'medium' ? '#f59e0b' : '#10b981'}
              strokeWidth="8"
              strokeDasharray={`${(rotation / 180) * 352} 352`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{complexity.score}</span>
          </div>
        </div>
        <div className="text-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getComplexityColor(complexity.band)}`}>
            {complexity.label}
          </span>
          <p className="text-xs text-gray-600 mt-2">{complexity.description}</p>
        </div>
      </div>
    </Card>
  );
}
