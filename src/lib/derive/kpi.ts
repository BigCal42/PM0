/**
 * KPI derivation utilities
 * Confidence index, blockers, and other metrics derived from project data
 */

export interface PhaseGap {
  phaseId: string;
  phaseName: string;
  roleId: string;
  roleName: string;
  requiredCapacity: number; // Required FTE or capacity
  assignedCapacity: number; // Assigned FTE or capacity
  gap: number; // requiredCapacity - assignedCapacity
}

export interface GapSummary {
  totalGaps: number;
  criticalGaps: number; // Gaps > 20% of required capacity
  moderateGaps: number; // Gaps 10-20% of required capacity
  minorGaps: number; // Gaps < 10% of required capacity
}

export interface ConfidenceIndex {
  score: number; // 0-100
  label: string;
  description: string;
  breakdown: {
    coverage: number; // 0-100
    gapSeverity: number; // 0-100
    staffing: number; // 0-100
  };
}

export interface TopBlocker {
  phaseId: string;
  phaseName: string;
  roleId: string;
  roleName: string;
  gap: number;
  gapPercent: number;
  impact: string; // Estimated impact on stage-gate
}

/**
 * Calculate confidence index from gaps
 * Confidence = coverage of required vs assigned capacity across phases
 */
export function calculateConfidenceIndex(gaps: PhaseGap[]): ConfidenceIndex {
  if (gaps.length === 0) {
    return {
      score: 100,
      label: 'Complete',
      description: 'All capacity requirements are met',
      breakdown: {
        coverage: 100,
        gapSeverity: 100,
        staffing: 100,
      },
    };
  }

  // Calculate coverage (assigned / required)
  const totalRequired = gaps.reduce((sum, gap) => sum + gap.requiredCapacity, 0);
  const totalAssigned = gaps.reduce((sum, gap) => sum + gap.assignedCapacity, 0);
  const coverage = totalRequired > 0 ? (totalAssigned / totalRequired) * 100 : 100;

  // Calculate gap severity (lower gaps = higher score)
  const avgGapPercent = gaps.reduce((sum, gap) => {
    const gapPercent = gap.requiredCapacity > 0 
      ? (gap.gap / gap.requiredCapacity) * 100 
      : 0;
    return sum + gapPercent;
  }, 0) / gaps.length;
  const gapSeverity = Math.max(0, 100 - avgGapPercent * 2); // Penalize gaps

  // Calculate staffing score (based on critical gaps)
  const criticalGaps = gaps.filter(g => {
    const gapPercent = g.requiredCapacity > 0 
      ? (g.gap / g.requiredCapacity) * 100 
      : 0;
    return gapPercent > 20;
  });
  const staffing = Math.max(0, 100 - criticalGaps.length * 10);

  // Composite score (weighted average)
  const score = Math.round(
    coverage * 0.4 + 
    gapSeverity * 0.4 + 
    staffing * 0.2
  );

  // Determine label
  let label: string;
  let description: string;
  if (score >= 85) {
    label = 'High Confidence';
    description = 'Strong capacity coverage with minimal gaps';
  } else if (score >= 70) {
    label = 'Moderate Confidence';
    description = 'Good capacity coverage with some gaps to address';
  } else if (score >= 55) {
    label = 'Low Confidence';
    description = 'Significant gaps that may impact timeline';
  } else {
    label = 'Critical Gaps';
    description = 'Major capacity gaps require immediate attention';
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    label,
    description,
    breakdown: {
      coverage: Math.round(coverage),
      gapSeverity: Math.round(gapSeverity),
      staffing: Math.round(staffing),
    },
  };
}

/**
 * Identify top blockers from gaps
 * Returns top 3 largest gaps
 */
export function identifyTopBlockers(gaps: PhaseGap[]): TopBlocker[] {
  if (gaps.length === 0) return [];

  // Calculate gap percentage for each gap
  const gapsWithPercent = gaps
    .map(gap => ({
      ...gap,
      gapPercent: gap.requiredCapacity > 0 
        ? (gap.gap / gap.requiredCapacity) * 100 
        : 0,
    }))
    .filter(g => g.gap > 0) // Only gaps (not surpluses)
    .sort((a, b) => b.gapPercent - a.gapPercent) // Sort by gap percentage descending
    .slice(0, 3); // Top 3

  return gapsWithPercent.map(gap => ({
    phaseId: gap.phaseId,
    phaseName: gap.phaseName,
    roleId: gap.roleId,
    roleName: gap.roleName,
    gap: gap.gap,
    gapPercent: Math.round(gap.gapPercent),
    impact: estimateImpact(gap.gapPercent),
  }));
}

/**
 * Estimate impact on stage-gate based on gap percentage
 * Rule of thumb: Every 10% gap in required vs assigned capacity delays stage-gate ~2–3 weeks
 */
function estimateImpact(gapPercent: number): string {
  if (gapPercent < 10) {
    return 'Minor delay (1-2 weeks)';
  } else if (gapPercent < 20) {
    return 'Moderate delay (2-3 weeks)';
  } else if (gapPercent < 30) {
    return 'Significant delay (3-4 weeks)';
  } else {
    return 'Major delay (4+ weeks)';
  }
}

/**
 * Calculate gap summary statistics
 */
export function calculateGapSummary(gaps: PhaseGap[]): GapSummary {
  const totalGaps = gaps.filter(g => g.gap > 0).length;
  
  let criticalGaps = 0;
  let moderateGaps = 0;
  let minorGaps = 0;

  gaps.forEach(gap => {
    if (gap.gap <= 0) return;
    
    const gapPercent = gap.requiredCapacity > 0 
      ? (gap.gap / gap.requiredCapacity) * 100 
      : 0;

    if (gapPercent > 20) {
      criticalGaps++;
    } else if (gapPercent >= 10) {
      moderateGaps++;
    } else {
      minorGaps++;
    }
  });

  return {
    totalGaps,
    criticalGaps,
    moderateGaps,
    minorGaps,
  };
}

/**
 * Calculate estimated savings-at-stake
 * Consultant hours avoided estimate based on automation
 */
export function calculateSavingsAtStake(
  projectCount: number,
  avgConsultantHoursPerProject: number = 120
): {
  consultantHours: number;
  costSavings: number; // Assuming $200/hour consultant rate
} {
  const consultantHours = projectCount * avgConsultantHoursPerProject * 0.8; // 80% automation
  const costSavings = consultantHours * 200; // $200/hour

  return {
    consultantHours: Math.round(consultantHours),
    costSavings: Math.round(costSavings),
  };
}

/**
 * Get confidence color for UI
 */
export function getConfidenceColor(score: number): string {
  if (score >= 85) return 'bg-green-100 text-green-800';
  if (score >= 70) return 'bg-yellow-100 text-yellow-800';
  if (score >= 55) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
}
