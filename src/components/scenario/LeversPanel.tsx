/**
 * LeversPanel component
 * Interactive sliders for adjusting scenario levers
 */

import { Card } from '@/components/Card';
import { strings } from '@/content/strings';

export interface LeverValues {
  timelinePercent: number; // Percentage of baseline timeline (e.g., 75 = 25% reduction)
  scopePercent: number; // Percentage of baseline scope (e.g., 85 = 15% reduction)
  fteParallelization: number; // FTE multiplier (e.g., 1.28 = 28% increase)
  testingCompression: number; // Testing time multiplier (e.g., 0.8 = 20% compression)
}

interface LeversPanelProps {
  values: LeverValues;
  onChange: (values: LeverValues) => void;
}

export function LeversPanel({ values, onChange }: LeversPanelProps) {
  const handleChange = (key: keyof LeverValues, value: number) => {
    onChange({
      ...values,
      [key]: value,
    });
  };

  return (
    <Card title={strings.lab.levers.title}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {strings.lab.levers.timeline}: {values.timelinePercent}%
          </label>
          <input
            type="range"
            min="50"
            max="100"
            value={values.timelinePercent}
            onChange={(e) => handleChange('timelinePercent', Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>50% (2x faster)</span>
            <span>100% (baseline)</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {strings.lab.levers.scope}: {values.scopePercent}%
          </label>
          <input
            type="range"
            min="50"
            max="100"
            value={values.scopePercent}
            onChange={(e) => handleChange('scopePercent', Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>50% (reduced)</span>
            <span>100% (baseline)</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {strings.lab.levers.fte}: {values.fteParallelization.toFixed(2)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={values.fteParallelization}
            onChange={(e) => handleChange('fteParallelization', Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.5x</span>
            <span>2.0x</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {strings.lab.levers.testing}: {values.testingCompression.toFixed(2)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="1.0"
            step="0.1"
            value={values.testingCompression}
            onChange={(e) => handleChange('testingCompression', Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.5x (compressed)</span>
            <span>1.0x (baseline)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
