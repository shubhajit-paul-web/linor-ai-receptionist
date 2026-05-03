# Linor — Super Admin Panel

The internal control plane for Linor (the AI Receptionist platform). Linear-style dark-first dashboard with hospital tenants, conversations, calls, analytics, billing, infrastructure, governance, and compliance.

## Stack

- **Vite 6** + **React 19** + **TypeScript (strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)**
- **Tailwind v4** with CSS-first `@theme` tokens (OKLCH palette)
- **shadcn/ui** primitives on **Radix** + **Lucide** icons
- **TanStack Router** (file-based, code-split, type-safe) + **TanStack Query v5** + **TanStack Table v8**
- **React Hook Form** + **Zod** for forms; **Zod** for the entire API contract
- **Zustand** for thin client state (sidebar, density, command palette)
- **Recharts** for analytics, **cmdk** for the command palette, **vaul** + **Sonner** for sheets and toasts
- **next-themes** for light / dark / system; density toggle via CSS data attribute
- **`@faker-js/faker`** seeds 50 hospitals, 4,000 conversations, infrastructure events, audit log, and billing history deterministically (`faker.seed(42)`)

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
npm run build
npm run typecheck
npm run lint
```

Demo accounts (mock auth, any password works):

| Email prefix | Role |
|---|---|
| `avery@linor.dev` (or anything) | `SuperAdmin` |
| `ops@…` | `OpsAdmin` |
| `support@…` | `Support` |
| `billing@…` | `Billing` |
| `view@…` | `ReadOnly` |

The `Topbar` user menu also lets you switch role in-session to inspect navigation gating.

## Switching to a real backend

Set `VITE_API_MODE=live` and `VITE_API_BASE_URL=https://your-backend/api/v1` in `.env.local`. Every endpoint declared in `src/lib/api/operations.ts` exposes the same `(input) => output` shape in both `mock` and `live` modes — only the dispatch in `src/lib/api/client.ts` changes. Zod schemas in `src/lib/schemas/` are the single source of truth.

## Project structure

```
src/
  app/
    permissions.ts            RBAC matrix (5 roles, 30+ permissions)
    providers.tsx             Theme + Query + Auth + Tooltip + Toaster + Density sync
  components/
    ui/                       shadcn-style primitives (button, card, badge, input, dialog, …)
    layout/                   AppShell, Sidebar, Topbar, PageHeader, nav-config
    command/command-palette   ⌘K palette (cmdk)
    data-table/               TanStack Table wrapper with sortable headers + skeletons
    charts/                   AreaChart, BarChart, DonutChart, Sparkline, KpiCard, tokens
    feedback/                 EmptyState, ErrorState
  features/
    auth/auth-context.tsx     Mock auth (localStorage), role switcher
  lib/
    api/                      Operation table + adapter (mock | live)
    mocks/                    Deterministic faker seed + paginate/filter/sort helpers
    schemas/                  Zod source-of-truth (Hospital, Branch, User, Agent, …)
    config.ts utils.ts
  routes/                     File-based, auto-split TanStack Router
    __root.tsx
    _auth.tsx + _auth.login.tsx
    _app.tsx                  Auth-gated AppShell
    _app.index.tsx            Overview (KPIs, activity, system health, anomalies)
    _app.hospitals.index.tsx  List + filters
    _app.hospitals.$hospitalId.tsx   Detail with 13 tabs
    _app.{branches,users,agents,conversations,calls,analytics,billing,infra,
          incidents,audit,flags,announcements,support,api-keys,compliance,settings}.tsx
  stores/ui-store.ts          Zustand: sidebar collapsed, density, palette, inspector
  styles/globals.css          Design tokens (`@theme`) + reset + density modes
```

## Key features delivered

- **Linear-style design system**: OKLCH neutrals, single indigo accent, Inter UI font, hairline borders, subtle shadows, density modes, motion respects `prefers-reduced-motion`.
- **Auth-gated app shell** with Sidebar (collapsible, permission-filtered, tooltips when collapsed), Topbar (search trigger, theme + density menu, notifications, role switcher).
- **Command palette (⌘K / Ctrl+K)**: jump to any page or hospital; loads tenants on demand.
- **Overview dashboard**: 6 KPI tiles (with deltas + sparklines), 30-day area chart, outcome donut, system health ribbon, at-risk hospitals, recent activity.
- **Hospitals**: searchable + status-filtered table with row drill-in.
- **Hospital detail**: profile, risk score, 13 tabs (Overview, Branches, Departments, Users, Agents, Conversations, Calls, Knowledge, Integrations, Billing, Usage, Audit, Settings) with live data tables in 7 of them.
- **Cross-tenant pages**: Conversations, Calls, Branches, Users, Agents, Audit, Flags, Announcements, API Keys, Compliance.
- **Analytics**: engagement area chart, outcome donut, channel bar chart, top tenants comparison.
- **Billing**: MRR / ARR / net new MRR / churn KPIs, invoice ledger, plans table.
- **Infra**: per-service health cards (status + p50/p95/p99 + uptime + error budget), incident timeline.
- **Governance**: audit log search, feature flags with rollout %, announcements, API keys, compliance controls (HIPAA / SOC 2 / GDPR / ISO 27001).
- **Settings**: theme + density, role switcher (demo), team / notifications / security / API placeholders.
- **Login**: branded auth screen with role-by-prefix demo helper.
- **404 + error states + skeleton loaders** wired throughout.
- **Strict TypeScript** with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` — passes `npm run typecheck`.
- **Production build**: route-level code splitting (every page is its own chunk), built in ~14 s.

## Pending product confirmation

Documented in the plan file (`linor-super-admin-panel-91d260.md`):

1. Confirm internal RBAC roles (currently SuperAdmin, OpsAdmin, Support, Billing, ReadOnly).
2. Drop in the real Linor logo/wordmark — placeholder mark used.
3. Real backend endpoint list once available — the contract in `src/lib/api/operations.ts` is the swap point.
4. Compliance scope — HIPAA / SOC 2 / GDPR / ISO 27001 controls all modeled; trim or extend as needed.
5. Telephony — currently provider-agnostic; can be specialized to Twilio.

## Phase status

Phases 0-9 of the plan are functional in code (foundation, shell, mock API + schemas, overview, hospitals + detail, cross-tenant pages, billing, infra, governance, polish). Storybook stubs and Playwright e2e specs are scaffold-ready but not yet wired — add when backend contracts firm up.
