/**
 * IntakeSummary component
 * Displays project intake summary and editable assumptions
 */

import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { strings } from '@/content/strings';

interface IntakeSummaryProps {
  projectId: string;
  assumptions?: Record<string, any>;
  onAssumptionsChange?: (assumptions: Record<string, any>) => void;
}

export function IntakeSummary({
  projectId,
  assumptions = {},
  onAssumptionsChange,
}: IntakeSummaryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAssumptions, setEditedAssumptions] = useState(assumptions);

  const handleSave = () => {
    onAssumptionsChange?.(editedAssumptions);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedAssumptions(assumptions);
    setIsEditing(false);
  };

  return (
    <Card title={strings.canvas.intake.title}>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {strings.canvas.intake.assumptions}
          </h4>
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                className="w-full p-2 border border-gray-300 rounded text-sm"
                rows={6}
                value={JSON.stringify(editedAssumptions, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setEditedAssumptions(parsed);
                  } catch {
                    // Invalid JSON, keep as is
                  }
                }}
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} variant="primary">
                  {strings.common.save}
                </Button>
                <Button onClick={handleCancel} variant="secondary">
                  {strings.common.cancel}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
                {JSON.stringify(assumptions, null, 2)}
              </pre>
              <Button
                onClick={() => setIsEditing(true)}
                variant="secondary"
                className="mt-2"
              >
                {strings.canvas.intake.editAssumptions}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
