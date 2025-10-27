# PM0 v2.0 Open Questions

1. **Vendor Catalog Scope**
   - Should the estimation engine pull vendor rate cards from Supabase Storage or remain hard-coded in `/data/vendor_rates.json`?
2. **Checklist Automations**
   - Are we integrating Workday API hooks to auto-complete readiness checklist items, or will completion remain manual?
3. **Scenario Export Formats**
   - Do executives prefer combined PDF + CSV bundles, or is PDF sufficient if KPI tables are embedded?
4. **Localization Strategy**
   - Planned support for Canadian French in Q3—need confirmation on translation vendor and budget.
5. **Heatmap Performance Thresholds**
   - When should we introduce worker-based computations for monthly rollups (>2k cells)?
6. **RLS for External Auditors**
   - Is there a requirement to grant read-only access to auditors across multiple projects, bypassing standard membership policies?
7. **Integrations Roadmap**
   - Integration with Workday PSA backlog remains tentative; product to confirm by next planning cycle.
