/**
 * QuickWhyThisPlan component
 * AI-powered explanation of why a plan makes sense
 * Only renders if VITE_USE_AI_GUIDANCE=1
 */

import { isAiGuidanceEnabled } from '@/lib/flags';
import { Card } from '@/components/Card';

interface QuickWhyThisPlanProps {
  projectId?: string;
  scenarioType?: 'baseline' | 'accelerated' | 'lean';
}

export function QuickWhyThisPlan({ projectId, scenarioType = 'baseline' }: QuickWhyThisPlanProps) {
  if (!isAiGuidanceEnabled()) {
    return null;
  }

  // Placeholder AI narrative - in production, this would call an AI service
  const narratives = {
    baseline:
      'This baseline plan balances timeline, cost, and risk. It follows industry-standard phases with adequate staffing levels, providing a solid foundation for successful delivery.',
    accelerated:
      'The accelerated timeline reduces duration by 25% but requires 28% more FTE allocation. This increases cost and risk, suitable when time-to-market is critical.',
    lean:
      'The lean approach reduces scope by 15% and timeline by 15%, optimizing cost while maintaining core functionality. Risk remains moderate, making it ideal for budget-constrained initiatives.',
  };

  return (
    <Card className="bg-blue-50 border-blue-200">
      <h4 className="text-sm font-semibold text-blue-900 mb-2">Why This Plan?</h4>
      <p className="text-sm text-blue-800">{narratives[scenarioType]}</p>
    </Card>
  );
}
