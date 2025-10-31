# 🧠 PM0 Architecture & Execution Plan (v2)

This folder documents the **updated reference architecture** and **execution roadmap** for the PM0 project — tuned for high reliability, performance, and developer velocity on **Vercel**.

---

## 📘 Diagrams

### 1. PM0 – Reference Architecture (Vercel + Vite + React, v2)

![Reference Architecture](PM0-Reference-Architecture-v2.png)

**Highlights**
- Vite + React 18 with code-splitting and lazy loading
- Supabase Edge Functions for AI orchestration
- React Query for zero-latency UX with optimistic updates
- Supabase Realtime for multi-user collaboration
- Observability (Sentry, Vercel Analytics, Speed Insights)
- Feature flags + rate limiting for safe rollouts
- Service Worker for offline-first capabilities

**Architecture Stack:**
- **Frontend:** Vite + React 18 + TypeScript (strict mode)
- **State Management:** React Query (TanStack Query) + React Context
- **Backend:** Supabase (PostgreSQL + Edge Functions + Realtime)
- **AI:** OpenAI API via Supabase Edge Functions
- **Deployment:** Vercel (Edge Network + Automatic Git Deployments)
- **Monitoring:** Sentry + Vercel Analytics + Custom metrics

### 2. PM0 – 4‑Week Execution Plan (v2)

![Execution Plan](PM0-Execution-Plan-v2.png)

**Week 1:** Auth + Data Layer + Discovery Workflow Foundation  
**Week 2:** Complexity Scoring Engine + Baseline Scenario Generator  
**Week 3:** AI Integration (OpenAI) + Advanced Scenarios  
**Week 4:** Real-time Collaboration + Export Features + UX Polish

**Quick Wins (This Week):**
- React Query setup (2 hours)
- Supabase Auth integration (4 hours)
- Toast notifications (1 hour)
- Loading states + Suspense (2 hours)
- Error monitoring (Sentry) (1 hour)

---

## 🏗️ Architecture Decisions

### Why Vite + React (Not Next.js)?

1. **Faster DX:** Vite's HMR is instant (<50ms), Next.js requires full page reloads in dev
2. **Smaller Bundle:** No React Server Components overhead for client-heavy app
3. **Simpler Mental Model:** Pure client-side app, easier for team to reason about
4. **Edge Functions Strategy:** AI/API logic in Supabase Edge Functions (not API routes)

### Why React Query?

1. **Zero-Latency UX:** Optimistic updates make UI feel instant
2. **Built-in Caching:** Reduces API calls, improves performance
3. **Background Refetch:** Keeps data fresh without user action
4. **Error Handling:** Retry logic + error boundaries out of the box

### Why Supabase Realtime?

1. **Multi-user Collaboration:** Presence indicators + live updates
2. **No Polling:** WebSocket-based, reduces server load
3. **Built-in RLS:** Security at database level, not application level
4. **Edge-Native:** Runs on Supabase edge network, low latency

---

## 🧩 How to Use

- Drop architecture diagrams into this folder as PNG files
- Keep all diagrams versioned alongside major architecture changes
- Use FigJam or Mermaid for future diagram updates
- Reference this folder in technical briefs and PRDs

**File Naming Convention:**
- `PM0-Reference-Architecture-v2.png` - System architecture diagram
- `PM0-Execution-Plan-v2.png` - Timeline/Gantt chart
- `PM0-Data-Flow-v2.png` - Data flow diagrams (if needed)
- `PM0-User-Journey-v2.png` - UX flows (if needed)

---

## 📊 Key Metrics & SLOs

**Performance Targets:**
- First Contentful Paint: <1.2s
- Time to Interactive: <2.5s
- Lighthouse Score: >95
- Bundle Size: <300KB gzipped (initial load)

**Reliability Targets:**
- Uptime: 99.9% (Vercel SLA)
- Error Rate: <0.1% (monitored via Sentry)
- API Latency: p95 <200ms (Supabase Edge Functions)

**Developer Experience:**
- Build Time: <30s (Vite)
- Test Coverage: >80%
- Type Safety: 100% (strict TypeScript)

---

## 🔗 Related Documentation

- [Strategic Product Blueprint](../../PM0_Strategic_Product_Blueprint_v2.0.md)
- [Repository Knowledge Base](../../PM0_REPO_KNOWLEDGE_BASE.md)
- [CI/CD Workflow](../../.github/workflows/ci.yml)

---

© 2025 PM0 Engineering – "Plan Smarter. Start Aligned."

