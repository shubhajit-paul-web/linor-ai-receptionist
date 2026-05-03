import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarCheck, Clock, MessageSquare, CheckCircle2,
  HelpCircle, Code2, MoreHorizontal, ArrowRight,
  Sparkles, ShieldCheck, Zap, ChevronRight,
} from 'lucide-react';
import useClinicStore from '../store/useClinicStore';
import useUIStore from '../store/useUIStore';
import { StatCard } from '../components/shared/StatCard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { PageHeader, Section } from '../components/shared/PageHeader';
import { AppointmentsAreaChart } from '../components/charts/AppointmentsAreaChart';
import { ServicesPieChart } from '../components/charts/ServicesPieChart';
import { ResolutionLineChart } from '../components/charts/ResolutionLineChart';
import { HourHeatmap } from '../components/charts/HourHeatmap';
import { formatDate, cn } from '../lib/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Card primitive — shared chrome for every dashboard panel. */
function Card({ title, description, action, children, className, contentClassName }) {
  return (
    <div
      className={cn(
        'flex flex-col bg-surface border border-border rounded-xl overflow-hidden',
        className,
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-border">
          <div className="min-w-0">
            {title && (
              <h3 className="text-[13.5px] font-semibold text-text-primary truncate">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-[11.5px] text-text-muted mt-0.5 truncate">{description}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn('flex-1', contentClassName ?? 'p-5')}>{children}</div>
    </div>
  );
}

// ─── Setup Checklist ─────────────────────────────────────────────────────────

/**
 * Onboarding nudge — only shown until all setup steps are complete.
 * Restrained, single-card design; no decorative blur orbs.
 */
function SetupChecklist({ clinic }) {
  const steps = [
    { key: 'clinicInfo',   label: 'Add clinic info',   desc: 'Name, address, contact.', path: '/settings' },
    { key: 'faqs',         label: 'Add 5 FAQs',        desc: 'Train the AI on common questions.', path: '/faqs' },
    { key: 'workingHours', label: 'Configure hours',   desc: 'When patients can book.',  path: '/working-hours' },
    { key: 'embedWidget',  label: 'Embed widget',      desc: 'Drop the snippet on your site.', path: '/embed' },
  ];

  const done = Object.values(clinic.setupSteps).filter(Boolean).length;
  const total = steps.length;
  const pct = Math.round((done / total) * 100);

  return (
    <Card
      className="bg-gradient-to-br from-surface to-primary-light/30"
      contentClassName="p-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-md bg-primary-light text-primary border border-primary/20 grid place-items-center">
              <Sparkles size={14} />
            </span>
            <h2 className="text-[15px] font-semibold text-text-primary tracking-tight">
              Finish setting up your AI receptionist
            </h2>
          </div>
          <p className="text-[13px] text-text-muted max-w-xl leading-relaxed mb-4">
            A complete profile lifts AI accuracy and patient trust. You're {pct}% there.
          </p>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div
              className="flex-1 max-w-md h-1.5 bg-surface-secondary rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-primary rounded-full"
              />
            </div>
            <span className="text-[12px] font-semibold text-text-secondary tabular-nums">
              {done}/{total}
            </span>
          </div>
        </div>

        {/* Step list */}
        <ul className="flex flex-col gap-1.5 w-full md:w-[280px]">
          {steps.map((s) => {
            const isDone = clinic.setupSteps[s.key];
            return (
              <li key={s.key}>
                <Link
                  to={s.path}
                  className={cn(
                    'flex items-center gap-3 px-3 h-9 rounded-md text-[12.5px] font-medium border transition-colors group',
                    isDone
                      ? 'border-transparent text-text-muted hover:bg-surface-secondary'
                      : 'bg-surface border-border text-text-primary hover:border-primary/40',
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 size={14} className="text-success flex-shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-border-strong group-hover:border-primary transition-colors flex-shrink-0" />
                  )}
                  <span className={cn('truncate', isDone && 'line-through opacity-60')}>
                    {s.label}
                  </span>
                  {!isDone && (
                    <ChevronRight
                      size={14}
                      className="ml-auto text-text-muted group-hover:text-primary transition-colors"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}

// ─── Quick actions ────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: 'Manage FAQs',     icon: HelpCircle,    path: '/faqs',  desc: 'AI knowledge base' },
  { label: 'Review chat logs',icon: MessageSquare, path: '/logs',  desc: 'Patient conversations' },
  { label: 'Get embed code',  icon: Code2,         path: '/embed', desc: 'Install widget on site' },
];

// ─── Skeleton Components ─────────────────────────────────────────────────────

function SkeletonBlock({ className }) {
  return <div className={cn('skeleton rounded-lg', className)} />;
}

function SkeletonSetupChecklist() {
  return (
    <div className="flex flex-col bg-surface border border-border rounded-xl p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <SkeletonBlock className="w-7 h-7 rounded-md" />
            <SkeletonBlock className="h-4 w-52" />
          </div>
          <SkeletonBlock className="h-3 w-80" />
          <div className="flex items-center gap-3 mt-4">
            <SkeletonBlock className="h-1.5 flex-1 max-w-md" />
            <SkeletonBlock className="h-3 w-8" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 w-full md:w-[280px]">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-9 w-full rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonKPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface">
          <div className="flex items-start justify-between gap-2">
            <SkeletonBlock className="h-2.5 w-20" />
            <SkeletonBlock className="h-7 w-7 rounded-md" />
          </div>
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1.5">
              <SkeletonBlock className="h-6 w-14" />
              <SkeletonBlock className="h-2.5 w-24" />
            </div>
            <SkeletonBlock className="h-8 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonChartCard({ className, chartHeight = 260 }) {
  return (
    <div className={cn('flex flex-col bg-surface border border-border rounded-xl overflow-hidden', className)}>
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border">
        <div className="space-y-1.5">
          <SkeletonBlock className="h-3.5 w-36" />
          <SkeletonBlock className="h-2.5 w-44" />
        </div>
      </div>
      <div className="p-5 pt-3">
        <div className="skeleton rounded-lg w-full" style={{ height: chartHeight }} />
      </div>
    </div>
  );
}

function SkeletonRecentTable() {
  return (
    <div className="flex flex-col bg-surface border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-border">
        <div className="space-y-1.5">
          <SkeletonBlock className="h-3.5 w-20" />
          <SkeletonBlock className="h-2.5 w-44" />
        </div>
        <SkeletonBlock className="h-4 w-16" />
      </div>
      <div className="overflow-x-auto">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {[140, 100, 80, 56, 64, 32].map((w, j) => (
                  <td key={j}>
                    <div className="skeleton h-3.5 rounded" style={{ width: w }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SkeletonQuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-surface">
          <SkeletonBlock className="w-9 h-9 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <SkeletonBlock className="h-3.5 w-24" />
            <SkeletonBlock className="h-2.5 w-32" />
          </div>
          <SkeletonBlock className="w-4 h-4 rounded" />
        </div>
      ))}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { appointments, clinic, loadProfileFromApi } = useClinicStore();
  const welcomeDismissed = useUIStore((s) => s.welcomeDismissed);
  const dismissWelcome = useUIStore((s) => s.dismissWelcome);

  // Hydrate clinic profile from API on mount.
  // Errors are logged but don't block the page — store has demo defaults.
  useEffect(() => {
    loadProfileFromApi().catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Failed to load clinic profile:', err);
    });
  }, [loadProfileFromApi]);

  const [isLoading, setIsLoading] = useState(true);

  // Simulate async data fetch — resolves after 1.3 s
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1300);
    return () => clearTimeout(t);
  }, []);

  // ── Derived counters ────────────────────────────────────────
  const pending = appointments.filter((a) => a.status === 'Pending').length;
  const sessions = 342;          // mock total chat sessions
  const resolutionRate = 87;     // mock resolution %
  const recent = useMemo(() => appointments.slice(0, 5), [appointments]);
  const setupDone = Object.values(clinic.setupSteps).filter(Boolean).length;
  const showSetup = setupDone < 4;

  // Tiny mock spark series for KPI cards
  const spark = (seed) =>
    Array.from({ length: 12 }, (_, i) => ({
      value: Math.round(seed * (0.7 + Math.sin(i * 0.7 + seed) * 0.15 + Math.random() * 0.2)),
    }));

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page header ───────────────────────────────────────── */}
      <PageHeader
        title={`Good day, ${clinic.name || 'team'}`}
        description="Here's how Linor is performing for your clinic today."
        meta={
          <>
            <StatusBadge status="Online" />
            {!welcomeDismissed && (
              <button
                onClick={dismissWelcome}
                className="text-[11px] text-text-muted hover:text-text-secondary transition-colors"
              >
                Dismiss tour
              </button>
            )}
          </>
        }
        actions={
          <Link
            to="/appointments"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-on text-[12.5px] font-semibold hover:bg-primary-hover transition-colors"
          >
            View appointments
            <ChevronRight size={13} />
          </Link>
        }
      />

      {/* ── Setup checklist (conditional) ─────────────────────── */}
      {isLoading ? (
        <SkeletonSetupChecklist />
      ) : (
        showSetup && <SetupChecklist clinic={clinic} />
      )}

      {/* ── KPI row ───────────────────────────────────────────── */}
      <Section
        title="Key metrics"
        description="Last 30 days vs prior period"
      >
        {isLoading ? (
          <SkeletonKPICards />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <StatCard
              label="Total appointments"
              value={appointments.length}
              delta={{ value: 12.0, label: 'wow' }}
              icon={CalendarCheck}
              iconBg="bg-primary-light"
              iconColor="text-primary"
              sparkline={spark(appointments.length || 30)}
            />
            <StatCard
              label="Pending confirmations"
              value={pending}
              delta={pending ? { value: -3.4, label: 'wow' } : undefined}
              icon={Clock}
              iconBg="bg-warning-light"
              iconColor="text-warning"
              sparkline={spark(pending || 5)}
            />
            <StatCard
              label="Chat sessions"
              value={sessions}
              delta={{ value: 8.2, label: 'wow' }}
              icon={MessageSquare}
              iconBg="bg-info-light"
              iconColor="text-info"
              sparkline={spark(sessions / 10)}
            />
            <StatCard
              label="AI resolution rate"
              value={resolutionRate}
              suffix="%"
              delta={{ value: 2.0, label: 'wow' }}
              icon={ShieldCheck}
              iconBg="bg-success-light"
              iconColor="text-success"
              sparkline={spark(resolutionRate)}
            />
          </div>
        )}
      </Section>

      {/* ── Trends + service breakdown ────────────────────────── */}
      <Section title="Trends">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            <SkeletonChartCard className="lg:col-span-3" chartHeight={260} />
            <SkeletonChartCard className="lg:col-span-2" chartHeight={260} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            <Card
              className="lg:col-span-3"
              title="Appointments over time"
              description="Bookings created via AI"
              contentClassName="p-5 pt-3"
            >
              <div className="h-[260px]">
                <AppointmentsAreaChart />
              </div>
            </Card>

            <Card
              className="lg:col-span-2"
              title="Appointments by service"
              description="Distribution across categories"
              contentClassName="p-5 pt-3"
            >
              <div className="h-[260px]">
                <ServicesPieChart />
              </div>
            </Card>
          </div>
        )}
      </Section>

      {/* ── Resolution + heatmap ──────────────────────────────── */}
      <Section title="Quality & coverage">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <SkeletonChartCard chartHeight={220} />
            <SkeletonChartCard chartHeight={220} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card
              title="AI resolution rate"
              description="% of conversations resolved without handoff"
              contentClassName="p-5 pt-3"
            >
              <div className="h-[220px]">
                <ResolutionLineChart />
              </div>
            </Card>

            <Card
              title="Patient activity by hour"
              description="Demand heatmap, last 7 days"
              contentClassName="p-5"
            >
              <HourHeatmap />
            </Card>
          </div>
        )}
      </Section>

      {/* ── Recent appointments ───────────────────────────────── */}
      <Section title="Recent appointments">
        {isLoading ? (
          <SkeletonRecentTable />
        ) : (
        <Card
          action={
            <Link
              to="/appointments"
              className="text-[12px] font-medium text-text-secondary hover:text-text-primary inline-flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          }
          title="Latest 5"
          description="Patient bookings created by Linor"
          contentClassName="p-0"
        >
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th className="w-10" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-text-muted py-8">
                      No appointments yet — they'll appear here as the AI books them.
                    </td>
                  </tr>
                ) : (
                  recent.map((appt) => (
                    <tr key={appt.id} className="group">
                      <td className="font-semibold text-text-primary">{appt.patient}</td>
                      <td>{appt.service}</td>
                      <td>{formatDate(appt.date)}</td>
                      <td className="font-mono tabular-nums">{appt.time}</td>
                      <td>
                        <StatusBadge status={appt.status} />
                      </td>
                      <td className="text-right">
                        <button
                          className="text-text-muted hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 p-1.5 hover:bg-surface-secondary rounded-md"
                          aria-label="Row actions"
                        >
                          <MoreHorizontal size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
        )}
      </Section>

      {/* ── Quick actions ─────────────────────────────────────── */}
      <Section title="Jump back in">
        {isLoading ? (
          <SkeletonQuickActions />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.path}
                  to={action.path}
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-xl border border-border bg-surface',
                    'hover:border-primary/40 hover:bg-surface-secondary transition-colors',
                  )}
                >
                  <span className="w-9 h-9 rounded-lg bg-surface-secondary border border-border grid place-items-center text-text-muted group-hover:text-primary group-hover:bg-primary-light group-hover:border-primary/30 transition-colors">
                    <Icon size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[13.5px] text-text-primary truncate">
                      {action.label}
                    </div>
                    <div className="text-[11.5px] text-text-muted truncate">{action.desc}</div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  />
                </Link>
              );
            })}
          </div>
        )}
      </Section>

      {/* ── Trust footer ──────────────────────────────────────── */}
      <p className="text-[11px] text-text-muted flex items-center gap-1.5 justify-center pt-2">
        <Zap size={11} className="text-primary" />
        Linor handles patient interactions with HIPAA-conscious encryption.
      </p>
    </div>
  );
}
