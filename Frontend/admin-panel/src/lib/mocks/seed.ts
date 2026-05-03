import { faker } from '@faker-js/faker';
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
  PlanTier,
  ServiceHealth,
  Subscription,
  User,
} from '@/lib/schemas';

faker.seed(42);

const REGIONS = ['us-east', 'us-west', 'eu-west', 'ap-south', 'ap-southeast'] as const;
const TIERS: PlanTier[] = ['Starter', 'Growth', 'Scale', 'Enterprise'];
const TIER_MRR: Record<PlanTier, number> = {
  Starter: 199,
  Growth: 999,
  Scale: 2999,
  Enterprise: 9999,
};
const TIER_INCLUDED_CONVERSATIONS: Record<PlanTier, number> = {
  Starter: 1000,
  Growth: 10_000,
  Scale: 50_000,
  Enterprise: 1_000_000,
};
const TIER_INCLUDED_SEATS: Record<PlanTier, number> = {
  Starter: 3,
  Growth: 10,
  Scale: 40,
  Enterprise: 200,
};
const SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'Oncology',
  'Neurology',
  'Radiology',
  'Endocrinology',
  'Psychiatry',
  'Ophthalmology',
  'Urology',
  'ENT',
  'General Medicine',
  'Emergency',
  'Maternity',
];
const TOPICS = [
  'Appointment booking',
  'Prescription refill',
  'Insurance verification',
  'Lab results',
  'Billing inquiry',
  'Specialist referral',
  'Symptom triage',
  'Procedure prep',
  'Follow-up scheduling',
  'Records request',
];
const TAGS = ['VIP', 'High-volume', 'Pilot', 'Enterprise', 'Beta', 'Strategic', 'At-risk'];

function pick<T>(arr: readonly T[]): T {
  const item = arr[Math.floor(Math.random() * arr.length)];
  if (item === undefined) throw new Error('pick from empty array');
  return item;
}

function pickN<T>(arr: readonly T[], n: number): T[] {
  return faker.helpers.arrayElements(arr as T[], n);
}

function isoDaysAgo(days: number): string {
  return faker.date.recent({ days: Math.max(1, days), refDate: new Date() }).toISOString();
}

function isoMonthsAgo(months: number): string {
  return faker.date.past({ years: months / 12 }).toISOString();
}

export interface SeedDb {
  hospitals: Hospital[];
  branches: Branch[];
  departments: Department[];
  users: User[];
  agents: Agent[];
  conversations: Conversation[];
  calls: Call[];
  plans: Plan[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  serviceHealth: ServiceHealth[];
  incidents: Incident[];
  auditEvents: AuditEvent[];
  featureFlags: FeatureFlag[];
  announcements: Announcement[];
  apiKeys: ApiKey[];
  complianceControls: ComplianceControl[];
}

function generatePlans(): Plan[] {
  const features: Record<PlanTier, string[]> = {
    Starter: ['1,000 conversations / mo', '3 seats', 'Voice + Chat', 'Email support'],
    Growth: ['10,000 conversations / mo', '10 seats', 'All channels', 'Priority email'],
    Scale: ['50,000 conversations / mo', '40 seats', 'SSO + audit log', 'Dedicated support'],
    Enterprise: ['Unlimited', 'Custom seats', 'BAA + SOC2', 'TAM + 99.99% SLA'],
  };
  return TIERS.map((tier) => ({
    id: `plan_${tier.toLowerCase()}`,
    tier,
    name: tier,
    monthlyPriceUsd: TIER_MRR[tier],
    annualPriceUsd: TIER_MRR[tier] * 10,
    includedConversations: TIER_INCLUDED_CONVERSATIONS[tier],
    includedSeats: TIER_INCLUDED_SEATS[tier],
    features: features[tier],
    active: true,
    createdAt: isoMonthsAgo(18),
  }));
}

function generateHospitals(count: number): Hospital[] {
  const out: Hospital[] = [];
  for (let i = 0; i < count; i++) {
    const name = `${faker.company.name().replace(/[,.]/g, '')} ${pick(['Health', 'Medical', 'Hospital', 'Clinic Group', 'Care'])}`;
    const slug = faker.helpers.slugify(name).toLowerCase();
    const tier = faker.helpers.weightedArrayElement<PlanTier>([
      { value: 'Starter', weight: 3 },
      { value: 'Growth', weight: 5 },
      { value: 'Scale', weight: 3 },
      { value: 'Enterprise', weight: 1 },
    ]);
    const status = faker.helpers.weightedArrayElement([
      { value: 'active', weight: 8 },
      { value: 'trialing', weight: 2 },
      { value: 'paused', weight: 1 },
      { value: 'suspended', weight: 0.5 },
      { value: 'archived', weight: 0.3 },
    ] as const);
    const branchCount = faker.number.int({ min: 1, max: tier === 'Enterprise' ? 12 : tier === 'Scale' ? 6 : 3 });
    const userCount = faker.number.int({ min: 5, max: tier === 'Enterprise' ? 200 : 50 });
    const agentCount = faker.number.int({ min: 1, max: tier === 'Enterprise' ? 18 : 6 });
    const monthlyConversations = faker.number.int({ min: 200, max: tier === 'Enterprise' ? 80_000 : 12_000 });

    out.push({
      id: `hosp_${i.toString().padStart(4, '0')}`,
      slug,
      name,
      legalName: `${name} ${pick(['LLC', 'Inc.', 'Pvt. Ltd.', 'GmbH', 'Pte. Ltd.'])}`,
      logoUrl: null,
      status,
      planTier: tier,
      region: pick(REGIONS),
      primaryDomain: `${slug}.com`,
      contactEmail: faker.internet.email().toLowerCase(),
      phone: faker.phone.number(),
      branchCount,
      departmentCount: branchCount * faker.number.int({ min: 3, max: 8 }),
      userCount,
      agentCount,
      monthlyConversations,
      monthlyCalls: Math.floor(monthlyConversations * faker.number.float({ min: 0.3, max: 0.7 })),
      bookingRate: faker.number.float({ min: 0.32, max: 0.86, fractionDigits: 3 }),
      csat: faker.number.float({ min: 3.4, max: 4.9, fractionDigits: 2 }),
      mrrUsd: TIER_MRR[tier],
      uptimePct: faker.number.float({ min: 0.985, max: 0.9999, fractionDigits: 4 }),
      riskScore: faker.number.int({ min: 0, max: 100 }),
      createdAt: isoMonthsAgo(faker.number.int({ min: 1, max: 36 })),
      updatedAt: isoDaysAgo(faker.number.int({ min: 1, max: 30 })),
      tags: pickN(TAGS, faker.number.int({ min: 0, max: 3 })),
      baaStatus: faker.helpers.weightedArrayElement([
        { value: 'signed', weight: 6 },
        { value: 'pending', weight: 2 },
        { value: 'not-started', weight: 1 },
        { value: 'expired', weight: 0.5 },
      ] as const),
      baaSignedAt: status === 'active' ? isoMonthsAgo(faker.number.int({ min: 1, max: 12 })) : null,
      hipaaStatus: faker.helpers.weightedArrayElement([
        { value: 'compliant', weight: 5 },
        { value: 'review-needed', weight: 3 },
        { value: 'non-compliant', weight: 1 },
        { value: 'exempt', weight: 0.5 },
      ] as const),
      dpaSignedAt: faker.datatype.boolean(0.6) ? isoMonthsAgo(faker.number.int({ min: 1, max: 18 })) : null,
      dataResidencyAcknowledged: faker.datatype.boolean(0.75),
    });
  }
  return out;
}

function generateBranches(hospitals: Hospital[]): Branch[] {
  const out: Branch[] = [];
  for (const h of hospitals) {
    for (let i = 0; i < h.branchCount; i++) {
      out.push({
        id: `${h.id}_br${i.toString().padStart(2, '0')}`,
        hospitalId: h.id,
        name: i === 0 ? `${h.name} — Main` : `${h.name} — ${faker.location.city()}`,
        city: faker.location.city(),
        country: faker.location.country(),
        timezone: faker.location.timeZone(),
        beds: faker.number.int({ min: 20, max: 800 }),
        staffCount: faker.number.int({ min: 30, max: 1500 }),
        status: faker.helpers.weightedArrayElement([
          { value: 'active' as const, weight: 9 },
          { value: 'inactive' as const, weight: 1 },
        ]),
        createdAt: isoMonthsAgo(faker.number.int({ min: 1, max: 24 })),
      });
    }
  }
  return out;
}

function generateDepartments(branches: Branch[]): Department[] {
  const out: Department[] = [];
  for (const b of branches) {
    const deptCount = faker.number.int({ min: 3, max: 7 });
    const specialties = pickN(SPECIALTIES, deptCount);
    for (const spec of specialties) {
      out.push({
        id: `${b.id}_d_${faker.string.alphanumeric(6)}`,
        hospitalId: b.hospitalId,
        branchId: b.id,
        name: spec,
        specialty: spec,
        headPhysician: faker.helpers.maybe(() => `Dr. ${faker.person.fullName()}`, { probability: 0.85 }) ?? null,
        staffCount: faker.number.int({ min: 4, max: 60 }),
        monthlyAppointments: faker.number.int({ min: 50, max: 4000 }),
        createdAt: isoMonthsAgo(faker.number.int({ min: 1, max: 18 })),
      });
    }
  }
  return out;
}

function generateUsers(hospitals: Hospital[]): User[] {
  const out: User[] = [];
  // Linor internal
  const linorRoles = ['SuperAdmin', 'OpsAdmin', 'Support', 'Billing', 'ReadOnly'] as const;
  for (let i = 0; i < 12; i++) {
    out.push({
      id: `u_linor_${i.toString().padStart(3, '0')}`,
      scope: 'linor',
      hospitalId: null,
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      role: pick(linorRoles),
      title: faker.person.jobTitle(),
      status: faker.helpers.weightedArrayElement([
        { value: 'active' as const, weight: 9 },
        { value: 'invited' as const, weight: 1 },
      ]),
      lastSeenAt: isoDaysAgo(faker.number.int({ min: 0, max: 14 })),
      mfaEnabled: faker.datatype.boolean({ probability: 0.85 }),
      createdAt: isoMonthsAgo(faker.number.int({ min: 1, max: 24 })),
    });
  }
  // Hospital staff
  for (const h of hospitals) {
    for (let i = 0; i < Math.min(h.userCount, 8); i++) {
      out.push({
        id: `u_${h.id}_${i.toString().padStart(3, '0')}`,
        scope: 'hospital',
        hospitalId: h.id,
        name: faker.person.fullName(),
        email: faker.internet.email({ provider: h.primaryDomain }).toLowerCase(),
        role: pick(['Owner', 'Admin', 'Receptionist', 'Manager', 'Clinician']),
        title: faker.person.jobTitle(),
        status: faker.helpers.weightedArrayElement([
          { value: 'active' as const, weight: 9 },
          { value: 'invited' as const, weight: 1 },
          { value: 'disabled' as const, weight: 0.5 },
        ]),
        lastSeenAt: faker.helpers.maybe(() => isoDaysAgo(faker.number.int({ min: 0, max: 30 })), { probability: 0.9 }) ?? null,
        mfaEnabled: faker.datatype.boolean({ probability: 0.6 }),
        createdAt: isoMonthsAgo(faker.number.int({ min: 1, max: 24 })),
      });
    }
  }
  return out;
}

function generateAgents(hospitals: Hospital[]): Agent[] {
  const out: Agent[] = [];
  const models = ['gpt-4o', 'gpt-4o-mini', 'claude-3.5-sonnet', 'gemini-1.5-pro', 'llama-3.1-70b'];
  const voices = ['nova', 'shimmer', 'onyx', 'alloy', 'echo', 'fable'];
  const langs = ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'hi-IN'];
  for (const h of hospitals) {
    for (let i = 0; i < h.agentCount; i++) {
      const channels = pickN(['voice', 'chat', 'sms', 'whatsapp'] as const, faker.number.int({ min: 1, max: 3 }));
      out.push({
        id: `agent_${h.id}_${i.toString().padStart(2, '0')}`,
        hospitalId: h.id,
        name: i === 0 ? `${h.name.split(' ')[0]} Receptionist` : `${pick(['Aria', 'Nova', 'Sage', 'Atlas', 'Iris'])} ${i}`,
        description: faker.lorem.sentence(),
        status: faker.helpers.weightedArrayElement([
          { value: 'live' as const, weight: 7 },
          { value: 'training' as const, weight: 1 },
          { value: 'paused' as const, weight: 1 },
          { value: 'draft' as const, weight: 1 },
        ]),
        channels: channels.length ? channels : ['voice'],
        model: pick(models),
        voice: channels.includes('voice') ? pick(voices) : null,
        language: pick(langs),
        knowledgeBaseId: null,
        monthlyConversations: faker.number.int({ min: 50, max: 12_000 }),
        avgLatencyMs: faker.number.int({ min: 380, max: 1400 }),
        successRate: faker.number.float({ min: 0.7, max: 0.98, fractionDigits: 3 }),
        csat: faker.number.float({ min: 3.6, max: 4.9, fractionDigits: 2 }),
        createdAt: isoMonthsAgo(faker.number.int({ min: 1, max: 18 })),
        updatedAt: isoDaysAgo(faker.number.int({ min: 0, max: 30 })),
      });
    }
  }
  return out;
}

function generateConversations(agents: Agent[], hospitals: Hospital[], targetCount: number): Conversation[] {
  const out: Conversation[] = [];
  const byHospital = new Map(hospitals.map((h) => [h.id, h]));
  for (let i = 0; i < targetCount; i++) {
    const a = pick(agents);
    if (!byHospital.has(a.hospitalId)) continue;
    const startedAt = faker.date.recent({ days: 60 });
    const durationSec = faker.number.int({ min: 28, max: 720 });
    out.push({
      id: `conv_${i.toString().padStart(6, '0')}`,
      hospitalId: a.hospitalId,
      agentId: a.id,
      channel: pick(a.channels),
      patientName: faker.person.fullName(),
      startedAt: startedAt.toISOString(),
      endedAt: new Date(startedAt.getTime() + durationSec * 1000).toISOString(),
      durationSec,
      messageCount: faker.number.int({ min: 4, max: 60 }),
      sentiment: faker.helpers.weightedArrayElement([
        { value: 'positive' as const, weight: 5 },
        { value: 'neutral' as const, weight: 4 },
        { value: 'negative' as const, weight: 1 },
      ]),
      outcome: faker.helpers.weightedArrayElement([
        { value: 'booked' as const, weight: 4 },
        { value: 'rescheduled' as const, weight: 1 },
        { value: 'cancelled' as const, weight: 1 },
        { value: 'info-only' as const, weight: 3 },
        { value: 'transferred' as const, weight: 1 },
        { value: 'unresolved' as const, weight: 1 },
      ]),
      language: a.language,
      csat: faker.helpers.maybe(() => faker.number.float({ min: 3, max: 5, fractionDigits: 1 }), { probability: 0.55 }) ?? null,
      topic: pick(TOPICS),
      flagged: faker.datatype.boolean({ probability: 0.04 }),
    });
  }
  return out;
}

function generateCalls(conversations: Conversation[]): Call[] {
  const voice = conversations.filter((c) => c.channel === 'voice');
  return voice.map((c, i) => ({
    id: `call_${i.toString().padStart(6, '0')}`,
    hospitalId: c.hospitalId,
    agentId: c.agentId,
    conversationId: c.id,
    fromNumber: faker.phone.number(),
    toNumber: faker.phone.number(),
    startedAt: c.startedAt,
    durationSec: c.durationSec,
    status: faker.helpers.weightedArrayElement([
      { value: 'completed' as const, weight: 8 },
      { value: 'missed' as const, weight: 1 },
      { value: 'voicemail' as const, weight: 1 },
      { value: 'failed' as const, weight: 0.4 },
    ]),
    recordingUrl: null,
    asrConfidence: faker.number.float({ min: 0.78, max: 0.99, fractionDigits: 3 }),
    ttsLatencyMs: faker.number.int({ min: 80, max: 380 }),
    llmLatencyMs: faker.number.int({ min: 220, max: 1100 }),
    endToEndLatencyMs: faker.number.int({ min: 380, max: 1600 }),
  }));
}

function generateSubscriptions(hospitals: Hospital[], plans: Plan[]): Subscription[] {
  const planByTier = new Map(plans.map((p) => [p.tier, p]));
  return hospitals.map((h, i) => {
    const plan = planByTier.get(h.planTier);
    if (!plan) throw new Error(`No plan for tier ${h.planTier}`);
    const start = faker.date.recent({ days: 28 });
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    return {
      id: `sub_${i.toString().padStart(4, '0')}`,
      hospitalId: h.id,
      planId: plan.id,
      status: h.status === 'trialing' ? 'trialing' : h.status === 'paused' ? 'paused' : 'active',
      currentPeriodStart: start.toISOString(),
      currentPeriodEnd: end.toISOString(),
      cancelAtPeriodEnd: faker.datatype.boolean({ probability: 0.05 }),
      seats: plan.includedSeats,
    };
  });
}

function generateInvoices(hospitals: Hospital[]): Invoice[] {
  const out: Invoice[] = [];
  let counter = 1000;
  for (const h of hospitals) {
    const months = faker.number.int({ min: 3, max: 18 });
    for (let m = 0; m < months; m++) {
      const issued = faker.date.past({ years: months / 12 });
      const due = new Date(issued);
      due.setDate(due.getDate() + 14);
      const status = faker.helpers.weightedArrayElement([
        { value: 'paid' as const, weight: 9 },
        { value: 'open' as const, weight: 1 },
        { value: 'void' as const, weight: 0.2 },
        { value: 'uncollectible' as const, weight: 0.1 },
      ]);
      out.push({
        id: `inv_${(counter++).toString()}`,
        number: `LIN-${(counter - 1).toString().padStart(6, '0')}`,
        hospitalId: h.id,
        amountUsd: h.mrrUsd + faker.number.int({ min: 0, max: 500 }),
        status,
        issuedAt: issued.toISOString(),
        dueAt: due.toISOString(),
        paidAt: status === 'paid' ? new Date(due.getTime() - 86_400_000).toISOString() : null,
        pdfUrl: null,
      });
    }
  }
  return out;
}

function generateServiceHealth(): ServiceHealth[] {
  const services = [
    { name: 'API Gateway', category: 'api' as const },
    { name: 'Conversation Orchestrator', category: 'api' as const },
    { name: 'Voice Pipeline', category: 'telephony' as const },
    { name: 'ASR (Whisper)', category: 'model' as const },
    { name: 'TTS (Eleven)', category: 'model' as const },
    { name: 'LLM Router', category: 'model' as const },
    { name: 'Knowledge Embeddings', category: 'worker' as const },
    { name: 'Postgres Primary', category: 'storage' as const },
    { name: 'Vector Store', category: 'storage' as const },
    { name: 'Redis Queue', category: 'queue' as const },
    { name: 'Twilio Bridge', category: 'integration' as const },
    { name: 'Calendar Sync Worker', category: 'worker' as const },
  ];
  return services.map((s, i) => ({
    id: `svc_${i.toString().padStart(2, '0')}`,
    name: s.name,
    category: s.category,
    status: faker.helpers.weightedArrayElement([
      { value: 'operational' as const, weight: 16 },
      { value: 'degraded' as const, weight: 2 },
      { value: 'partial-outage' as const, weight: 0.5 },
      { value: 'maintenance' as const, weight: 0.3 },
    ]),
    uptime30d: faker.number.float({ min: 0.985, max: 0.9999, fractionDigits: 4 }),
    p50LatencyMs: faker.number.int({ min: 18, max: 120 }),
    p95LatencyMs: faker.number.int({ min: 80, max: 480 }),
    p99LatencyMs: faker.number.int({ min: 220, max: 1400 }),
    errorRate: faker.number.float({ min: 0, max: 0.02, fractionDigits: 4 }),
    errorBudgetRemaining: faker.number.float({ min: 0.2, max: 1, fractionDigits: 2 }),
    region: pick(['us-east-1', 'us-west-2', 'eu-west-1', 'ap-south-1']),
    lastIncidentAt: faker.helpers.maybe(() => isoDaysAgo(faker.number.int({ min: 1, max: 90 })), {
      probability: 0.5,
    }) ?? null,
  }));
}

function generateIncidents(): Incident[] {
  return Array.from({ length: 8 }, (_, i) => {
    const opened = faker.date.recent({ days: 60 });
    const resolved = faker.helpers.maybe(
      () => new Date(opened.getTime() + faker.number.int({ min: 600_000, max: 14_400_000 })),
      { probability: 0.7 },
    );
    return {
      id: `inc_${i.toString().padStart(3, '0')}`,
      title: pick([
        'Elevated latency on voice pipeline',
        'Twilio webhook delivery delays',
        'LLM provider rate limit',
        'Vector store read failures',
        'Calendar sync backlog',
        'Auth service brief outage',
      ]),
      severity: pick(['SEV-1', 'SEV-2', 'SEV-3', 'SEV-4']),
      status: resolved ? 'resolved' : pick(['investigating', 'identified', 'monitoring']),
      affectedServices: pickN(['Voice Pipeline', 'LLM Router', 'API Gateway', 'TTS (Eleven)', 'Twilio Bridge'], 2),
      openedAt: opened.toISOString(),
      resolvedAt: resolved ? resolved.toISOString() : null,
      commander: faker.person.fullName(),
      summary: faker.lorem.paragraph(),
    };
  });
}

function generateAuditEvents(hospitals: Hospital[], users: User[]): AuditEvent[] {
  const actions = [
    'hospital.created',
    'hospital.updated',
    'hospital.suspended',
    'plan.changed',
    'agent.deployed',
    'agent.config.updated',
    'user.invited',
    'user.role.changed',
    'apikey.rotated',
    'flag.toggled',
    'integration.connected',
  ];
  return Array.from({ length: 240 }, (_, i) => {
    const actor = pick(users.filter((u) => u.scope === 'linor'));
    const h = pick(hospitals);
    return {
      id: `ev_${i.toString().padStart(5, '0')}`,
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: pick(actions),
      resourceType: pick(['hospital', 'agent', 'user', 'plan', 'flag', 'apikey']),
      resourceId: h.id,
      hospitalId: h.id,
      before: null,
      after: null,
      ip: faker.internet.ip(),
      userAgent: faker.internet.userAgent(),
      occurredAt: isoDaysAgo(faker.number.int({ min: 0, max: 90 })),
    };
  });
}

function generateFeatureFlags(hospitals: Hospital[]): FeatureFlag[] {
  const flags = [
    { key: 'voice.barge-in', name: 'Voice barge-in' },
    { key: 'kb.streaming-ingest', name: 'Streaming KB ingest' },
    { key: 'analytics.cohorts', name: 'Cohort comparison' },
    { key: 'agents.tool-use', name: 'Agent tool-use' },
    { key: 'billing.usage-overage', name: 'Usage overage billing' },
    { key: 'ui.command-palette-v2', name: 'Command palette v2' },
  ];
  return flags.map((f, i) => ({
    id: `ff_${i.toString().padStart(2, '0')}`,
    key: f.key,
    name: f.name,
    description: faker.lorem.sentence(),
    enabled: faker.datatype.boolean({ probability: 0.7 }),
    rolloutPct: faker.number.int({ min: 0, max: 100 }),
    targetHospitals: pickN(hospitals, faker.number.int({ min: 0, max: 5 })).map((h) => h.id),
    environment: pick(['development', 'staging', 'production']),
    updatedAt: isoDaysAgo(faker.number.int({ min: 0, max: 30 })),
    updatedBy: faker.person.fullName(),
  }));
}

function generateAnnouncements(): Announcement[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: `ann_${i.toString().padStart(2, '0')}`,
    title: pick([
      'Scheduled maintenance: Voice Pipeline',
      'New: Cohort comparison in Analytics',
      'Action required: rotate API keys',
      'Holiday support coverage',
      'Pricing update for Scale plan',
    ]),
    body: faker.lorem.paragraph(),
    severity: pick(['info', 'warning', 'critical']),
    audience: pick(['all', 'admins', 'specific']),
    targetHospitalIds: [],
    scheduledFor: faker.helpers.maybe(() => faker.date.soon({ days: 14 }).toISOString(), { probability: 0.4 }) ?? null,
    publishedAt: faker.helpers.maybe(() => isoDaysAgo(faker.number.int({ min: 0, max: 60 })), { probability: 0.7 }) ?? null,
    createdAt: isoDaysAgo(faker.number.int({ min: 0, max: 90 })),
    createdBy: faker.person.fullName(),
  }));
}

function generateApiKeys(): ApiKey[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `key_${i.toString().padStart(2, '0')}`,
    name: pick(['CI', 'Webhook signer', 'Internal dashboard', 'Data export', 'Mobile gateway']),
    prefix: `lk_${faker.string.alphanumeric(6)}`,
    scopes: pickN(['hospitals.read', 'hospitals.write', 'analytics.read', 'billing.read'], 2),
    hospitalId: null,
    lastUsedAt: faker.helpers.maybe(() => isoDaysAgo(faker.number.int({ min: 0, max: 14 })), { probability: 0.8 }) ?? null,
    createdAt: isoMonthsAgo(faker.number.int({ min: 1, max: 18 })),
    createdBy: faker.person.fullName(),
    expiresAt: faker.helpers.maybe(() => faker.date.future({ years: 1 }).toISOString(), { probability: 0.5 }) ?? null,
    revoked: faker.datatype.boolean({ probability: 0.1 }),
  }));
}

function generateComplianceControls(): ComplianceControl[] {
  const items: Array<{ framework: ComplianceControl['framework']; controlId: string; title: string }> = [
    { framework: 'HIPAA', controlId: '164.308(a)(1)', title: 'Security Management Process' },
    { framework: 'HIPAA', controlId: '164.312(a)(1)', title: 'Access Control' },
    { framework: 'HIPAA', controlId: '164.312(b)', title: 'Audit Controls' },
    { framework: 'HIPAA', controlId: '164.312(e)(1)', title: 'Transmission Security' },
    { framework: 'SOC2', controlId: 'CC6.1', title: 'Logical access security controls' },
    { framework: 'SOC2', controlId: 'CC7.2', title: 'System monitoring' },
    { framework: 'GDPR', controlId: 'Art.32', title: 'Security of processing' },
    { framework: 'GDPR', controlId: 'Art.33', title: 'Breach notification' },
    { framework: 'ISO27001', controlId: 'A.9.2', title: 'User access management' },
  ];
  return items.map((i, idx) => ({
    id: `ctrl_${idx.toString().padStart(3, '0')}`,
    framework: i.framework,
    controlId: i.controlId,
    title: i.title,
    description: faker.lorem.sentence(),
    status: faker.helpers.weightedArrayElement([
      { value: 'compliant' as const, weight: 7 },
      { value: 'in-progress' as const, weight: 2 },
      { value: 'gap' as const, weight: 1 },
    ]),
    owner: faker.person.fullName(),
    evidenceCount: faker.number.int({ min: 0, max: 24 }),
    lastReviewedAt: isoDaysAgo(faker.number.int({ min: 1, max: 90 })),
  }));
}

let cached: SeedDb | null = null;

export function getSeedDb(): SeedDb {
  if (cached) return cached;
  const plans = generatePlans();
  const hospitals = generateHospitals(50);
  const branches = generateBranches(hospitals);
  const departments = generateDepartments(branches);
  const users = generateUsers(hospitals);
  const agents = generateAgents(hospitals);
  const conversations = generateConversations(agents, hospitals, 4_000);
  const calls = generateCalls(conversations);
  const subscriptions = generateSubscriptions(hospitals, plans);
  const invoices = generateInvoices(hospitals);
  const serviceHealth = generateServiceHealth();
  const incidents = generateIncidents();
  const auditEvents = generateAuditEvents(hospitals, users);
  const featureFlags = generateFeatureFlags(hospitals);
  const announcements = generateAnnouncements();
  const apiKeys = generateApiKeys();
  const complianceControls = generateComplianceControls();
  cached = {
    hospitals,
    branches,
    departments,
    users,
    agents,
    conversations,
    calls,
    plans,
    subscriptions,
    invoices,
    serviceHealth,
    incidents,
    auditEvents,
    featureFlags,
    announcements,
    apiKeys,
    complianceControls,
  };
  return cached;
}
