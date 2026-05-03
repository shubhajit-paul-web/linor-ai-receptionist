import type { Operation } from './client';
import type {
  Agent,
  Announcement,
  ApiKey,
  AuditEvent,
  Branch,
  Call,
  ComplianceControl,
  Conversation,
  Department,
  FeatureFlag,
  Hospital,
  Incident,
  Invoice,
  Plan,
  ServiceHealth,
  Subscription,
  User,
} from '@/lib/schemas';
import type { PageParams, PageResult } from '@/lib/mocks/db';
import { db, paginate } from '@/lib/mocks/db';

const qs = (p: PageParams): string => {
  const u = new URLSearchParams();
  if (p.q) u.set('q', p.q);
  if (p.page !== undefined) u.set('page', String(p.page));
  if (p.pageSize !== undefined) u.set('pageSize', String(p.pageSize));
  if (p.sort) u.set('sort', p.sort);
  if (p.dir) u.set('dir', p.dir);
  if (p.filters)
    for (const [k, v] of Object.entries(p.filters)) {
      if (v === undefined) continue;
      const arr = Array.isArray(v) ? v : [v];
      arr.forEach((val) => u.append(`f.${k}`, val));
    }
  const s = u.toString();
  return s ? `?${s}` : '';
};

// -------- Hospitals --------
export const listHospitals: Operation<PageParams, PageResult<Hospital>> = {
  name: 'hospitals.list',
  method: 'GET',
  path: (p) => `/hospitals${qs(p)}`,
  mock: (p) => paginate(db.hospitals, p, ['name', 'slug', 'primaryDomain', 'contactEmail']),
};

export const getHospital: Operation<{ id: string }, Hospital> = {
  name: 'hospitals.get',
  method: 'GET',
  path: ({ id }) => `/hospitals/${id}`,
  mock: ({ id }) => {
    const h = db.hospitals.find((x) => x.id === id);
    if (!h) throw new Error(`Hospital not found: ${id}`);
    return h;
  },
};

// -------- Branches / Departments --------
export const listBranches: Operation<{ hospitalId?: string } & PageParams, PageResult<Branch>> = {
  name: 'branches.list',
  method: 'GET',
  path: ({ hospitalId, ...p }) => `/branches${qs({ ...p, filters: { ...p.filters, ...(hospitalId ? { hospitalId } : {}) } })}`,
  mock: ({ hospitalId, ...p }) => {
    const items = hospitalId ? db.branches.filter((b) => b.hospitalId === hospitalId) : db.branches;
    return paginate(items, p, ['name', 'city', 'country']);
  },
};

export const listDepartments: Operation<{ hospitalId?: string; branchId?: string } & PageParams, PageResult<Department>> = {
  name: 'departments.list',
  method: 'GET',
  path: ({ hospitalId, branchId, ...p }) =>
    `/departments${qs({ ...p, filters: { ...p.filters, ...(hospitalId ? { hospitalId } : {}), ...(branchId ? { branchId } : {}) } })}`,
  mock: ({ hospitalId, branchId, ...p }) => {
    let items = db.departments;
    if (hospitalId) items = items.filter((d) => d.hospitalId === hospitalId);
    if (branchId) items = items.filter((d) => d.branchId === branchId);
    return paginate(items, p, ['name', 'specialty']);
  },
};

// -------- Users / Agents --------
export const listUsers: Operation<{ hospitalId?: string; scope?: 'linor' | 'hospital' } & PageParams, PageResult<User>> = {
  name: 'users.list',
  method: 'GET',
  path: ({ hospitalId, scope, ...p }) =>
    `/users${qs({ ...p, filters: { ...p.filters, ...(hospitalId ? { hospitalId } : {}), ...(scope ? { scope } : {}) } })}`,
  mock: ({ hospitalId, scope, ...p }) => {
    let items = db.users;
    if (scope) items = items.filter((u) => u.scope === scope);
    if (hospitalId) items = items.filter((u) => u.hospitalId === hospitalId);
    return paginate(items, p, ['name', 'email']);
  },
};

export const listAgents: Operation<{ hospitalId?: string } & PageParams, PageResult<Agent>> = {
  name: 'agents.list',
  method: 'GET',
  path: ({ hospitalId, ...p }) => `/agents${qs({ ...p, filters: { ...p.filters, ...(hospitalId ? { hospitalId } : {}) } })}`,
  mock: ({ hospitalId, ...p }) => {
    const items = hospitalId ? db.agents.filter((a) => a.hospitalId === hospitalId) : db.agents;
    return paginate(items, p, ['name', 'description', 'model']);
  },
};

// -------- Conversations / Calls --------
export const listConversations: Operation<{ hospitalId?: string } & PageParams, PageResult<Conversation>> = {
  name: 'conversations.list',
  method: 'GET',
  path: ({ hospitalId, ...p }) => `/conversations${qs({ ...p, filters: { ...p.filters, ...(hospitalId ? { hospitalId } : {}) } })}`,
  mock: ({ hospitalId, ...p }) => {
    const items = hospitalId ? db.conversations.filter((c) => c.hospitalId === hospitalId) : db.conversations;
    return paginate(items, p, ['patientName', 'topic']);
  },
};

export const listCalls: Operation<{ hospitalId?: string } & PageParams, PageResult<Call>> = {
  name: 'calls.list',
  method: 'GET',
  path: ({ hospitalId, ...p }) => `/calls${qs({ ...p, filters: { ...p.filters, ...(hospitalId ? { hospitalId } : {}) } })}`,
  mock: ({ hospitalId, ...p }) => {
    const items = hospitalId ? db.calls.filter((c) => c.hospitalId === hospitalId) : db.calls;
    return paginate(items, p, ['fromNumber', 'toNumber']);
  },
};

// -------- Billing --------
export const listPlans: Operation<void, Plan[]> = {
  name: 'plans.list',
  method: 'GET',
  path: () => `/plans`,
  mock: () => db.plans,
};

export const listSubscriptions: Operation<{ hospitalId?: string } & PageParams, PageResult<Subscription>> = {
  name: 'subscriptions.list',
  method: 'GET',
  path: ({ hospitalId, ...p }) => `/subscriptions${qs({ ...p, filters: { ...p.filters, ...(hospitalId ? { hospitalId } : {}) } })}`,
  mock: ({ hospitalId, ...p }) => {
    const items = hospitalId ? db.subscriptions.filter((s) => s.hospitalId === hospitalId) : db.subscriptions;
    return paginate(items, p, []);
  },
};

export const listInvoices: Operation<{ hospitalId?: string } & PageParams, PageResult<Invoice>> = {
  name: 'invoices.list',
  method: 'GET',
  path: ({ hospitalId, ...p }) => `/invoices${qs({ ...p, filters: { ...p.filters, ...(hospitalId ? { hospitalId } : {}) } })}`,
  mock: ({ hospitalId, ...p }) => {
    const items = hospitalId ? db.invoices.filter((i) => i.hospitalId === hospitalId) : db.invoices;
    return paginate(items, p, ['number']);
  },
};

// -------- Infra / Incidents --------
export const listServiceHealth: Operation<void, ServiceHealth[]> = {
  name: 'infra.health.list',
  method: 'GET',
  path: () => `/infra/health`,
  mock: () => db.serviceHealth,
};

export const listIncidents: Operation<PageParams, PageResult<Incident>> = {
  name: 'incidents.list',
  method: 'GET',
  path: (p) => `/incidents${qs(p)}`,
  mock: (p) => paginate(db.incidents, p, ['title', 'commander']),
};

// -------- Governance --------
export const listAuditEvents: Operation<PageParams, PageResult<AuditEvent>> = {
  name: 'audit.list',
  method: 'GET',
  path: (p) => `/audit${qs(p)}`,
  mock: (p) => paginate(db.auditEvents, { ...p, sort: p.sort ?? 'occurredAt', dir: p.dir ?? 'desc' }, ['action', 'actorName', 'resourceType']),
};

export const listFeatureFlags: Operation<PageParams, PageResult<FeatureFlag>> = {
  name: 'flags.list',
  method: 'GET',
  path: (p) => `/flags${qs(p)}`,
  mock: (p) => paginate(db.featureFlags, p, ['key', 'name', 'description']),
};

export const listAnnouncements: Operation<PageParams, PageResult<Announcement>> = {
  name: 'announcements.list',
  method: 'GET',
  path: (p) => `/announcements${qs(p)}`,
  mock: (p) => paginate(db.announcements, p, ['title', 'body']),
};

export const listApiKeys: Operation<PageParams, PageResult<ApiKey>> = {
  name: 'apikeys.list',
  method: 'GET',
  path: (p) => `/apikeys${qs(p)}`,
  mock: (p) => paginate(db.apiKeys, p, ['name', 'prefix']),
};

export const listComplianceControls: Operation<PageParams, PageResult<ComplianceControl>> = {
  name: 'compliance.list',
  method: 'GET',
  path: (p) => `/compliance${qs(p)}`,
  mock: (p) => paginate(db.complianceControls, p, ['title', 'controlId', 'owner']),
};

// -------- Aggregate / Overview --------
export interface OverviewSummary {
  activeHospitals: number;
  totalHospitals: number;
  monthlyConversations: number;
  monthlyCalls: number;
  mrrUsd: number;
  bookingRate: number;
  avgCsat: number;
  uptimePct: number;
  openIncidents: number;
  topRiskHospitals: Array<{ id: string; name: string; riskScore: number }>;
  conversationTrend: Array<{ date: string; conversations: number; calls: number }>;
  outcomeBreakdown: Array<{ outcome: string; value: number }>;
  channelBreakdown: Array<{ channel: string; value: number }>;
  recentActivity: AuditEvent[];
}

export const getOverview: Operation<void, OverviewSummary> = {
  name: 'overview.get',
  method: 'GET',
  path: () => `/overview`,
  mock: () => {
    const hospitals = db.hospitals;
    const active = hospitals.filter((h) => h.status === 'active');
    const totalConvos = hospitals.reduce((s, h) => s + h.monthlyConversations, 0);
    const totalCalls = hospitals.reduce((s, h) => s + h.monthlyCalls, 0);
    const mrr = hospitals.reduce((s, h) => s + h.mrrUsd, 0);
    const avgBooking = hospitals.reduce((s, h) => s + h.bookingRate, 0) / Math.max(hospitals.length, 1);
    const avgCsat = hospitals.reduce((s, h) => s + h.csat, 0) / Math.max(hospitals.length, 1);
    const avgUptime = hospitals.reduce((s, h) => s + h.uptimePct, 0) / Math.max(hospitals.length, 1);
    const openIncidents = db.incidents.filter((i) => i.status !== 'resolved').length;

    const topRisk = [...hospitals]
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5)
      .map((h) => ({ id: h.id, name: h.name, riskScore: h.riskScore }));

    // 30-day trend, deterministic by day index.
    const trend: OverviewSummary['conversationTrend'] = [];
    const now = Date.now();
    for (let d = 29; d >= 0; d--) {
      const date = new Date(now - d * 86_400_000);
      const baseline = totalConvos / 30;
      const wobble = Math.sin(d / 3.7) * 0.18 + Math.sin(d / 1.3) * 0.06;
      const conversations = Math.round(baseline * (1 + wobble));
      const calls = Math.round(conversations * 0.55);
      trend.push({
        date: date.toISOString().slice(0, 10),
        conversations,
        calls,
      });
    }

    const outcomeMap = new Map<string, number>();
    for (const c of db.conversations) outcomeMap.set(c.outcome, (outcomeMap.get(c.outcome) ?? 0) + 1);
    const outcomeBreakdown = [...outcomeMap.entries()].map(([outcome, value]) => ({ outcome, value }));

    const channelMap = new Map<string, number>();
    for (const c of db.conversations) channelMap.set(c.channel, (channelMap.get(c.channel) ?? 0) + 1);
    const channelBreakdown = [...channelMap.entries()].map(([channel, value]) => ({ channel, value }));

    const recentActivity = [...db.auditEvents]
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
      .slice(0, 8);

    return {
      activeHospitals: active.length,
      totalHospitals: hospitals.length,
      monthlyConversations: totalConvos,
      monthlyCalls: totalCalls,
      mrrUsd: mrr,
      bookingRate: avgBooking,
      avgCsat,
      uptimePct: avgUptime,
      openIncidents,
      topRiskHospitals: topRisk,
      conversationTrend: trend,
      outcomeBreakdown,
      channelBreakdown,
      recentActivity,
    };
  },
};
