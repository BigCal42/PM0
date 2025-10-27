# PM0 v2.0 Traceability Appendix

| Requirement | Source | Implementation Artifact | Test Coverage |
|-------------|--------|-------------------------|---------------|
| Heatmap supports severity logic | Product Spec §3.1 | `supabase/migrations/202403200001_init.sql` (`heatmap_cells`, `severity_thresholds`) | `tests/heatmap.smoke.spec.ts` |
| Scenario generator with templates | Product Spec §4 | `data/scenarios.json`, `scripts/generate_demo_scenarios.ts`, `supabase/migrations/...` (`scenarios`) | `tests/scenario.smoke.spec.ts` |
| RLS across projects | Security Memo §2 | Policies in `supabase/migrations/202403200001_init.sql` | `tests/auth.smoke.spec.ts` |
| Estimation engine KPIs | Analytics Charter §2.3 | `supabase/migrations/...` (`scenario_results` view) | `tests/scenario.smoke.spec.ts` |
| Demo mode toggle | GTM Checklist §1.4 | `data/*`, `scripts/generate_demo_scenarios.ts` | `tests/demo-mode.spec.ts` |
| Readiness checklist | Customer Feedback §5 | `supabase/migrations/...` (`checklist_items`) | `tests/checklist.smoke.spec.ts` |

## Change Log References
- See `docs/PM0_Diff_Summary_v2.0.md` for high-level overview.
- `CHANGELOG.md` contains chronological updates.

## Testing Notes
- Playwright tests assume seeded Supabase with `demo@acmehealth.com` and project `orion`.
- To run locally: `npm run test:e2e` (alias for `npx playwright test`).
