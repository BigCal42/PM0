/**
 * Complexity scoring utilities
 * Maps intake factors → 0–100 score with labeled bands
 */

export interface ComplexityFactors {
  systemCount?: number;
  integrationCount?: number;
  userCount?: number;
  regulatoryRequirements?: string[];
  legacySystemCount?: number;
  geographicLocations?: number;
  customizations?: number;
}

export interface ComplexityScore {
  score: number;
  band: 'low' | 'medium' | 'high' | 'critical';
  label: string;
  description: string;
}

/**
 * Calculate complexity score from intake factors
 * Returns a score 0-100 with labeled band
 */
export function calculateComplexity(factors: ComplexityFactors): ComplexityScore {
  let score = 0;

  // System count (0-20 points)
  if (factors.systemCount) {
    score += Math.min(factors.systemCount * 2, 20);
  }

  // Integration count (0-20 points)
  if (factors.integrationCount) {
    score += Math.min(factors.integrationCount * 2, 20);
  }

  // User count (0-15 points)
  if (factors.userCount) {
    if (factors.userCount < 1000) score += 5;
    else if (factors.userCount < 10000) score += 10;
    else score += 15;
  }

  // Regulatory requirements (0-15 points)
  if (factors.regulatoryRequirements) {
    score += Math.min(factors.regulatoryRequirements.length * 3, 15);
  }

  // Legacy systems (0-15 points)
  if (factors.legacySystemCount) {
    score += Math.min(factors.legacySystemCount * 3, 15);
  }

  // Geographic locations (0-10 points)
  if (factors.geographicLocations) {
    score += Math.min(factors.geographicLocations * 2, 10);
  }

  // Customizations (0-15 points)
  if (factors.customizations) {
    score += Math.min(factors.customizations * 2, 15);
  }

  // Determine band
  let band: 'low' | 'medium' | 'high' | 'critical';
  let label: string;
  let description: string;

  if (score < 30) {
    band = 'low';
    label = 'Low Complexity';
    description = 'Straightforward implementation with minimal risk';
  } else if (score < 55) {
    band = 'medium';
    label = 'Medium Complexity';
    description = 'Standard implementation with moderate risk factors';
  } else if (score < 80) {
    band = 'high';
    label = 'High Complexity';
    description = 'Complex implementation requiring careful planning and risk mitigation';
  } else {
    band = 'critical';
    label = 'Critical Complexity';
    description = 'Highly complex implementation with significant risk factors';
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    band,
    label,
    description,
  };
}

/**
 * Get complexity band color for UI
 */
export function getComplexityColor(band: ComplexityScore['band']): string {
  switch (band) {
    case 'low':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'critical':
      return 'bg-red-100 text-red-800';
  }
}
