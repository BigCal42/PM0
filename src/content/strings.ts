/**
 * Content strings for PM0 Playground
 * Plain-English microcopy aligned to value propositions
 */

export const strings = {
  // Home Hub
  hub: {
    title: 'PM0 Playground',
    subtitle: 'Plan Smarter. Start Aligned.',
    kpi: {
      activeProjects: 'Active Projects',
      unresolvedGaps: 'Scenarios with Unresolved Gaps',
      daysToStageGate: 'Days to Next Stage-Gate',
    },
    insights: {
      topBlockers: 'Top 3 Blockers',
      savingsAtStake: 'Savings-at-Stake',
      confidenceIndex: 'Confidence Index',
      savingsDescription: 'Consultant hours avoided via automation',
      confidenceDescription: 'Capacity coverage and gap analysis',
    },
    cta: {
      openCanvas: 'Open Project Canvas',
      startIntake: 'Start New Intake',
      jumpToLab: 'Jump to Scenario Lab',
    },
  },

  // Project Canvas
  canvas: {
    title: 'Project Canvas',
    intake: {
      title: 'Intake Summary',
      assumptions: 'Assumptions',
      editAssumptions: 'Edit Assumptions',
    },
    complexity: {
      title: 'Complexity Score',
      dial: 'Complexity Dial',
    },
    gaps: {
      title: 'Gaps Matrix',
      subtitle: 'Phase × Role Analysis',
      phase: 'Phase',
      role: 'Role',
      required: 'Required',
      assigned: 'Assigned',
      gap: 'Gap',
      severity: 'Severity',
      totals: 'Totals',
    },
    scenarios: {
      title: 'Scenario Compare',
      baseline: 'Baseline',
      accelerated: 'Accelerated',
      lean: 'Lean',
      timeline: 'Timeline',
      fte: 'FTE',
      cost: 'Cost',
      risk: 'Risk',
      whatChanged: 'What Changed',
      deltas: 'Deltas',
    },
  },

  // Scenario Lab
  lab: {
    title: 'Scenario Lab',
    subtitle: 'Tweak levers and see live deltas',
    levers: {
      title: 'Levers',
      timeline: 'Timeline',
      scope: 'Scope',
      fte: 'FTE Parallelization',
      testing: 'Testing Compression',
      reset: 'Reset to Baseline',
    },
    metrics: {
      title: 'Derived Metrics',
      months: 'Months',
      avgFte: 'Avg FTE',
      costEstimate: 'Cost Estimate',
      riskLevel: 'Risk Level',
    },
    risks: {
      title: 'Risk Callouts',
      noRisks: 'No significant risks identified',
    },
    snapshot: {
      button: 'Snapshot to Scenario',
      success: 'Scenario saved successfully',
      error: 'Connect DB to save scenarios',
      placeholder: 'Enter scenario name...',
    },
  },

  // Value propositions (microcopy)
  valueProps: {
    whyThisMatters: 'Every 10% gap in required vs assigned capacity delays your stage-gate ~2–3 weeks.',
    savingsAtStake: 'You\'re carrying {hours} analyst-hours we can automate via intake + scenario templates.',
    confidenceHint: 'Raising tester coverage in {phase} from {from} to {to} boosts confidence by {points} pts.',
    planInHours: 'Plan in Hours, Not Weeks',
    cutConsulting: 'Cut 20–40% of Pre-Project Consulting Spend',
    makeRiskVisible: 'Make Risk Visible, Not Inevitable',
    explainToFinance: 'Explain It to Finance',
    fromOpinionToOptions: 'From Opinion to Options',
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    noData: 'No data available',
    offline: 'Database offline. Showing cached data.',
    emptyState: 'No data to display',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    close: 'Close',
  },
};

/**
 * Format string with variables
 */
export function formatString(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return vars[key]?.toString() || '';
  });
}
