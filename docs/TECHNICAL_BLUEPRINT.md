# 🧱 PM0 Technical Blueprint

**Version:** 2.0  
**Last Updated:** 2025-01-30  
**Status:** Production-Ready Architecture

---

## 🏗️ Architecture Overview

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite + TypeScript + Tailwind | Dynamic wizard + dashboard + chart components |
| **State Management** | TanStack Query + Zustand | Cache + local state for intake/scenario data |
| **Backend** | Supabase (Postgres + RLS + Edge Functions) | Secure multi-tenant data model |
| **Auth** | Supabase Auth (RLS enforced) | Email/magic link, org/user role tables |
| **AI Layer** | OpenAI GPT API | Text summary, risk narratives, scenario advisor |
| **Hosting** | Vercel | Continuous deployment + environment management |
| **Analytics** | PostHog or Plausible (opt-in) | User behavior tracking |
| **CI/CD** | GitHub Actions + semantic-release | Automated testing and deployment |
| **Compliance** | HIPAA / SOC 2 | Encryption at rest/in transit, audit logging |

---

## 📊 Data Model

### Core Tables

**Organizations & Access Control**
- `organizations` - Multi-tenant org management
- `project_members` - RLS enforcement via project membership
- `users` - Supabase Auth integration

**Project Management**
- `projects` - Transformation projects
- `phases` - Project phases/stages
- `requirements` - Project requirements

**Resources & Roles**
- `roles` - Role definitions (PM, Architect, Developer, etc.)
- `resources` - Resource inventory
- `assignments` - Role-to-phase assignments

**Scenario Modeling**
- `scenarios` - Scenario definitions (Baseline, Accelerated, Lean, High-Scope)
- `scenario_results` - Computed scenario outputs

### Row Level Security (RLS)

All tables protected via `project_members`:
- Users can only access projects they're members of
- Organization-level isolation
- Role-based permissions (viewer, editor, admin)

### Database Functions (RPCs)

```sql
-- List all phases for a project
list_project_phases(project_id UUID)

-- Compute resource/capability gaps for a phase
compute_phase_gaps(phase_id UUID)

-- Store computed scenario from gap analysis
store_scenario_from_gaps(
  project_id UUID,
  scenario_type TEXT,
  gaps JSONB
)
```

---

## 🔌 Integrations

### Vendor APIs

| Vendor | Purpose | Status |
|--------|---------|--------|
| **Workday** | HR system readiness checks | Planned |
| **Oracle Cloud** | ERP integration | Planned |
| **Epic** | Healthcare EHR integration | Planned |
| **ServiceNow** | ITSM/CMDB integration | Planned |
| **Salesforce** | CRM integration | Planned |

### Export Formats

- **CSV** - Tabular data export
- **XLSX** - Excel-compatible spreadsheets
- **PDF** - Executive reports and presentations
- **Markdown** - Documentation and version control

---

## 💼 Commercial Model

### Pricing Tiers

| Tier | Description | Price (USD/mo) | Value |
|------|-------------|----------------|--------|
| **Core** | Single org, up to 3 projects | $499 | Guided intake + estimation engine |
| **Professional** | 10 projects + AI Insights | $1,499 | Scenario Modeler + Risk Matrix |
| **Enterprise** | Unlimited + SSO + Integrations | Custom (>$5K) | Vendor APIs + Governance Dashboard |
| **Consulting Partner** | Whitelabel for SIs | Rev-Share / Seat | PM0 embedded in consulting toolkits |

**Land & Expand Strategy:**
- Start with transformation pilot
- Expand to portfolio license
- ROI Narrative: Every $1 spent on PM0 saves $5–$10 in consulting hours

---

## 🚀 Go-to-Market Plan

### Positioning

> "PM0 — The Digital PMO for Healthcare Transformations.  
> Plan smarter. Start aligned."

### Motions

1. **Direct Sales:** CEO/CIO-targeted demos via LinkedIn + Definitive HC account lists
2. **Channel:** Partner with management consultancies to co-brand PM0
3. **Content:** Thought-leadership on "Phase Minus Zero" / AI Transformation Planning
4. **Proof:** Publish anonymized baseline vs accelerated scenario benchmarks

### Enablement Assets

- 1-pager PDF
- Demo deck
- ROI calculator
- RFP response template

---

## 📅 12-Month Roadmap

| Phase | Months | Focus | Milestones |
|-------|---------|-------|-------------|
| **Concept** | 0–1 | Finalize MVP scope + funding model | Product vision + design system |
| **Build Alpha** | 1–3 | Supabase schema + RLS + core UI | Auth, Intake, Estimation, Gaps RPC |
| **Pilot Launch** | 3–6 | AI Insights + Scenario Compare | 3 Pilot Health Systems live |
| **Commercial Release** | 6–9 | Multi-tenant + Integrations | Vercel scale + partner channels |
| **Scale** | 9–12 | Enterprise SSO + Analytics + RFP library | ARR >$2M + SOC 2 Type I |

**Current Status:** Week 1 Complete (Auth + Data Layer)

---

## 📊 Metrics Framework

| Category | KPI | Target | Tool |
|-----------|-----|--------|------|
| **Activation** | % of users creating project in first session | >70% | Supabase Events |
| **Adoption** | Weekly active projects | +10% MoM | Mixpanel / PostHog |
| **Value** | Consultant cost saved / project | >$50K | Customer ROI calc |
| **Retention** | NRR | 120%+ | Billing / CRM |
| **Sentiment** | NPS | >60 | In-app survey |
| **Compliance** | Security audit pass | 100% | Vanta / SOC reports |

---

## 🧰 Command Set

Use these triggers to generate focused artifacts quickly:

| Command | Output |
|----------|---------|
| **📈 Plan MVP** | MVP scope + architecture + 3-month sprint plan |
| **🧠 Generate Vision Brief** | Problem → ICP → Differentiation → Metrics |
| **🧩 Build Roadmap** | Concept → Build → Launch → Scale timeline |
| **🧾 Model Pricing** | Tier table + ROI rationale |
| **🧰 Generate GTM Kit** | 1-pager, deck outline, ROI calc, enablement content |
| **⚙️ Design Architecture** | Tech + API + data model diagram |
| **📊 Define Metrics** | KPI framework + reporting stack |
| **📜 Draft Governance** | HIPAA / SOC 2 / audit model |

---

## 🔐 Security & Compliance

### HIPAA Considerations

- PHI handling: Encrypted at rest (Supabase), encrypted in transit (HTTPS)
- RLS policies: Database-level access control
- Audit logs: Track all data access
- BAA: Supabase BAA required for production

### SOC 2 Requirements

- Access controls via RLS
- Encryption at rest and in transit
- Audit logging for all data access
- Regular security audits (Vanta)

---

## 💬 Founder's Note

> PM0 isn't just software — it's the democratization of transformation planning.  
> We are giving organizations a cockpit that merges consulting expertise with AI precision.  
> Every click, dashboard, and dataset should make the user feel smarter, faster, and more in control.  
> Let's build it beautifully, scalably, and responsibly — one release at a time.

---

**Last Updated:** 2025-01-30  
**Version:** 2.0  
**Status:** Production-Ready Architecture

