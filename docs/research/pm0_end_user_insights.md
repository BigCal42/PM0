# PM0 — End User Insights & Pain Points Synthesis

## Executive Summary

This document synthesizes end-user pains, overlooked gaps, and emerging trends from enterprise healthcare CIO/CFO/PMO/Solution Architect perspectives. It informs PM0's value proposition and product roadmap priorities.

---

## Underserved Pains (Today)

### 1. Expensive, Repeatable "Phase 0" Tasks Still Handed to SIs

**The Problem:**
- Healthcare organizations spend $200K–$500K+ on "Phase 0" discovery and planning workshops with systems integrators (SIs) before committing to transformation programs.
- These workshops follow predictable templates: stakeholder interviews, gap analysis, staffing models, timeline estimates, risk assessment.
- The same 80% of questions repeat across projects: "What roles do we need?", "How long will Phase 2 take?", "What are the critical dependencies?"

**Evidence:**
- 60–80% of Phase 0 deliverables are boilerplate templates customized with client names and dates.
- Typical SI engagement: 3–6 weeks, 2–4 consultants, $150K–$300K just to produce a planning document.
- Organizations repeat this process for every major initiative (Epic upgrades, Workday migrations, data lake consolidation, etc.).

**Where Waste Occurs:**
- Over-scoping: SIs pad estimates to protect margins.
- Under-modeling risk: Timeline assumptions don't account for dependency gaps.
- Template recycling: Same complexity scoring, same staffing matrices, same risk registers across clients.

---

### 2. Questions That Keep Execs from Greenlighting

**The Problem:**
- Executives cannot greenlight multi-million-dollar transformations without quantified confidence.
- Key blocking questions remain unanswered or answered with "it depends":
  1. **"Why this timeline?"** → Usually answered with "industry standard" or "similar projects."
  2. **"What if we accelerate/go lean?"** → Requires re-engagement with SI to re-model.
  3. **"Where are the gaps that will blow up our timeline?"** → Often discovered mid-project, causing delays.
  4. **"What's the risk-adjusted cost?"** → Usually presented as a single number, not a range.

**Board-Level Demand:**
- CFOs want scenario variance: "Show me baseline vs accelerated vs lean."
- CIOs want gap visibility: "Show me where we're short on staff or skills before we commit."
- PMOs want confidence indexes: "What's the probability we hit this milestone?"

---

### 3. Process & Data Gaps

#### RACI Ambiguity
- **Problem:** Role assignments (RACI matrices) are defined in spreadsheets that become stale.
- **Impact:** Team members don't know who owns what; dependencies break.
- **Current State:** Managed in Excel/SharePoint; no live link to project phases or gap analysis.

#### Staffing Visibility
- **Problem:** Organizations don't know if they have the right people assigned until Phase 1 starts.
- **Impact:** Missing skills discovered mid-project → delays, re-scoping, consultant ramp-up.
- **Current State:** Staffing models exist in PowerPoint; not tied to actual capacity or skill gaps.

#### Under-Tested Cutover Plans
- **Problem:** Cutover windows are planned with optimistic assumptions.
- **Impact:** Weekend go-lives become 72-hour marathons; rollback scenarios untested.
- **Current State:** Cutover plans in Word docs; risk factors not quantified.

#### Under-Modeled Cost/Timeline Risk
- **Problem:** Projects present single-point estimates ("18 months, $5M").
- **Impact:** Executives approve without understanding variance; boards ask "why are we over budget?"
- **Current State:** Risk registers exist but aren't tied to cost/timeline deltas.

#### Compliance Sign-Offs
- **Problem:** Regulatory approvals (HIPAA, Joint Commission, state mandates) are dependencies that aren't modeled.
- **Impact:** Compliance delays discovered late; go-live windows missed.
- **Current State:** Tracked in project management tools; not linked to phase dependencies.

---

## Overlooked Gaps (Process & Data)

### 1. Gap Analysis → Stage-Gate Linkage

**Current State:**
- Gap analysis identifies missing roles, skills, or resources.
- Stage-gates are dates on a Gantt chart.
- **Missing Link:** "This gap delays Stage-Gate 3 by 2–3 weeks" is not computed or visualized.

**Opportunity:**
- Heatmap showing gaps by phase → automatic impact on milestone dates.
- Confidence index: "85% confidence in Stage-Gate 3 if we resolve these 3 gaps by M2."

---

### 2. Scenario Comparison Without Live Modeling

**Current State:**
- Organizations compare scenarios by asking SI to re-model (additional cost/time).
- Scenarios are static documents: "Baseline: 18 months. Accelerated: 15 months."

**Missing:**
- **Live Modeling:** "What if I reduce scope by 20% and add 2 FTE?" → Instant delta.
- **Risk Trade-offs:** "Accelerated timeline adds 30% cost risk" → Quantified, not anecdotal.

---

### 3. Intake → Complexity → Scenarios Pipeline

**Current State:**
- Intake questionnaires exist but aren't standardized.
- Complexity scoring is manual (consultant judgment).
- Scenarios are generated after weeks of analysis.

**Opportunity:**
- **Guided Intake:** Structured questions → auto-complexity score → instant scenario templates.
- **Time Savings:** 3–6 weeks → 3–6 hours.

---

## Growing Trends

### 1. AI Planning Co-Pilots

**Trend:**
- Enterprises want AI assistance for planning, not just execution.
- "Explain why this plan" → AI narrative tying inputs → outputs → risk trade-offs.

**PM0 Opportunity:**
- AI-generated "Why This Plan?" narratives.
- Co-pilot that suggests scenario adjustments based on gaps.

---

### 2. CFO-Driven Cost Takeout

**Trend:**
- CFOs are gatekeepers for transformation spend.
- They demand quantified ROI, scenario variance, and risk-adjusted costs.

**PM0 Opportunity:**
- One-page cost/effort deltas with executive narrative.
- "Savings-at-stake" metric: consultant hours avoided via automation.

---

### 3. Payor/Provider Margin Pressure

**Trend:**
- Healthcare margins are shrinking; efficiency is imperative.
- Organizations can't afford "safe" padding in estimates.

**PM0 Opportunity:**
- Lean scenario modeling: "What's the minimum viable timeline?"
- Risk-adjusted estimates: "Here's the 80% confidence timeline, not the padded one."

---

### 4. SI Capacity/Pricing Volatility

**Trend:**
- SI consultants are in high demand; pricing is volatile.
- Organizations want to reduce dependency on SI for planning.

**PM0 Opportunity:**
- Self-service planning tools reduce SI engagement for Phase 0.
- Standardize the repeatable 80/20 to cut SI hours.

---

### 5. Board-Level Demand for Scenario Variance

**Trend:**
- Boards ask: "What if we accelerate? What if we go lean?"
- Single-scenario plans are rejected.

**PM0 Opportunity:**
- Instant scenario comparison: Baseline vs Accelerated vs Lean.
- Trade-off visualization: timeline vs cost vs risk.

---

## CX Quotes & Testimonials (Paraphrased)

> "I need a single page to show gaps & cost impacts without calling a workshop." — Healthcare CIO

> "We spend $300K on Phase 0 planning, and 80% of it is boilerplate. There has to be a better way." — CFO, Health System

> "I can't greenlight a $10M program without seeing scenario variance. Show me baseline vs accelerated vs lean, with quantified risks." — Board Member

> "Every time we plan a new Epic upgrade, we start from scratch. Why isn't this standardized?" — PMO Director

> "I need to know: 'Why this plan?' Show me the inputs that led to these outputs, and the trade-offs." — Enterprise Architect

> "We discover staffing gaps in Phase 2, not Phase 0. That's expensive." — Program Manager

---

## Top Job-to-be-Done (JTBD)

**Core JTBD:**
> "Decide the 'how & when' of our transformation with quantified confidence—before we spend SI dollars."

**Supporting JTBDs:**
1. **Validate assumptions:** "Is this timeline realistic given our gaps?"
2. **Compare options:** "What's the trade-off between accelerated and lean?"
3. **Identify blockers:** "What gaps will delay our stage-gates?"
4. **Explain to finance:** "Why this plan? Show me the cost/risk trade-offs."
5. **Reduce SI dependency:** "Can we do Phase 0 planning ourselves?"

---

## Key Insights Summary

1. **Phase 0 is overpriced and templated** → Opportunity to automate 80% of it.
2. **Executives need quantified confidence** → Scenario variance, gap impact, risk-adjusted estimates.
3. **Gaps discovered too late** → Need gap analysis tied to stage-gates and timelines.
4. **Scenarios are static** → Need live modeling with instant deltas.
5. **Process gaps exist** → RACI ambiguity, staffing visibility, under-tested cutovers.
6. **Trends favor self-service** → AI co-pilots, CFO-driven cost takeout, reduced SI dependency.

---

## Next Steps

See `/docs/research/pm0_value_props.md` for value propositions derived from these insights.
