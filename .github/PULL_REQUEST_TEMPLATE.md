## Summary
- _Describe the change and the motivation._

## Testing
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] Playwright scenarios (link or describe)

## Mission Checklist
- [ ] Wire Supabase Auth UI (email/password)
- [ ] Implement roles/resources CRUD against Supabase (keep demo mode fallback)
- [ ] Heatmap performance pass (memoization + virtualized rows when > 200 cells)
- [ ] Scenario save/compare with `assumptions/results` JSONB
- [ ] Export Center: PNG for heatmap, PDF for scenario compare, CSVs
- [ ] Add basic Playwright flows to CI (create project → add role/resource → view heatmap)
- [ ] Generate DB types via `scripts/typegen.sh <PROJECT_REF>` → `src/types/database.ts`
- [ ] Integrate `vendor_catalog_rates` into Estimation Engine (cost guidance in KPI)
- [ ] Add feature flags: `VITE_USE_DEMO_DATA`
