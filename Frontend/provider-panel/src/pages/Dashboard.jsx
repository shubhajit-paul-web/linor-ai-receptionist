import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarCheck, Clock, MessageSquare, CheckCircle2,
  X, HelpCircle, Code2, MoreHorizontal, ArrowRight,
  Sparkles, Activity, ShieldCheck, Zap
} from 'lucide-react';
import useClinicStore from '../store/useClinicStore';
import useUIStore from '../store/useUIStore';
import { StatCard } from '../components/shared/StatCard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { AppointmentsAreaChart } from '../components/charts/AppointmentsAreaChart';
import { ServicesPieChart } from '../components/charts/ServicesPieChart';
import { ResolutionLineChart } from '../components/charts/ResolutionLineChart';
import { HourHeatmap } from '../components/charts/HourHeatmap';
import { formatDate, formatTime, cn } from '../lib/utils';

// ─── Setup Checklist ─────────────────────────────────────────────────────────

function SetupChecklist({ clinic }) {
  const steps = [
    { key: 'clinicInfo',   label: 'Add clinic info',      path: '/settings' },
    { key: 'faqs',         label: 'Add 5 FAQs',           path: '/faqs' },
    { key: 'workingHours', label: 'Configure hours',      path: '/working-hours' },
    { key: 'embedWidget',  label: 'Embed widget',         path: '/embed' },
  ];

  const done = Object.values(clinic.setupSteps).filter(Boolean).length;
  const total = steps.length;
  const pct = Math.round((done / total) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-surface-secondary/20 border border-border/50 rounded-3xl p-8 mb-8 backdrop-blur-xl"
    >
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
               <Sparkles size={18} className="text-primary" />
            </div>
            <h2 className="text-[18px] text-text-primary font-semibold tracking-tight">
              Welcome aboard! Let's get you set up.
            </h2>
          </div>
          <p className="text-[14px] text-text-muted mb-6 max-w-xl leading-relaxed">
            Complete these essential steps to unleash the full power of your AI receptionist. A fully configured AI provides the best patient experience.
          </p>
          
          <div className="flex items-center gap-4">
             <div className="flex-1 max-w-md h-1.5 bg-border/40 rounded-full overflow-hidden relative">
               <motion.div
                 initial={{ width: 0 }}
                 animate={{ width: `${pct}%` }}
                 transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                 className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-purple-500 rounded-full shadow-[0_0_10px_rgba(75,127,232,0.5)]"
               />
             </div>
             <span className="text-[13px] font-semibold text-text-primary">{done}/{total} Complete</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 min-w-[240px]">
          {steps.map((s) => {
            const isDone = clinic.setupSteps[s.key];
            return (
              <Link
                key={s.key}
                to={s.path}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-medium transition-all duration-300",
                  isDone 
                    ? "bg-surface/30 border border-border/50 text-text-muted hover:bg-surface/60"
                    : "bg-surface border border-border/80 shadow-sm text-text-primary hover:border-primary/50 hover:shadow-md group"
                )}
              >
                <div className="flex items-center gap-3">
                  {isDone ? (
                    <CheckCircle2 size={16} className="text-success" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-text-muted group-hover:border-primary transition-colors" />
                  )}
                  <span className={cn(isDone && "line-through opacity-70")}>{s.label}</span>
                </div>
                {!isDone && <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary transition-all duration-300" />}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Quick Actions ────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: 'Manage FAQs',    icon: HelpCircle,    path: '/faqs',    desc: 'Add and edit AI knowledge base' },
  { label: 'View Chat Logs', icon: MessageSquare, path: '/logs',    desc: 'Review patient conversations' },
  { label: 'Get Embed Code', icon: Code2,         path: '/embed',   desc: 'Install chatbot on your website' },
];

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const { appointments, clinic, loadProfileFromApi } = useClinicStore();
  const { welcomeDismissed, dismissWelcome } = useUIStore();

  // Load clinic profile from API on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        await loadProfileFromApi();
      } catch (error) {
        console.error('Failed to load clinic profile:', error);
      }
    };
    loadProfile();
  }, [loadProfileFromApi]);

  const pending   = appointments.filter((a) => a.status === 'Pending').length;
  const sessions  = 342; // mock total chat sessions
  const recent    = appointments.slice(0, 5);

  const setupDone = Object.values(clinic.setupSteps).filter(Boolean).length;
  const showSetup = setupDone < 4;

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto pb-16">
      {/* ── Welcome Banner ─────────────────────────────────────── */}
      {!welcomeDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 backdrop-blur-xl shadow-sm"
        >
          <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
          <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <button
            onClick={dismissWelcome}
            className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary bg-surface/40 hover:bg-surface rounded-full transition-all backdrop-blur-md border border-border/50"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(75,127,232,0.15)] flex-shrink-0">
              <Zap size={22} className="text-primary" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-text-primary tracking-tight">
                Welcome to {clinic.name}, your AI is online! 🚀
              </h2>
              <p className="text-[14px] text-text-muted mt-1 leading-relaxed max-w-3xl">
                Linor is now actively managing your incoming queries. Complete your setup checklist to ensure maximum resolution rates and seamless patient onboarding.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Setup Checklist ────────────────────────────────────── */}
      {showSetup && <SetupChecklist clinic={clinic} />}

      {/* ── AI Insights Widget (New) ───────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
         <div className="md:col-span-2 bg-surface-secondary/30 border border-border/60 rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full blur-[50px]" />
            <div className="relative z-10 flex items-center justify-between gap-4">
               <div>
                 <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-success" />
                    <span className="text-[13px] font-semibold tracking-wide uppercase text-success">AI Performance Insight</span>
                 </div>
                 <h3 className="text-[20px] font-bold text-text-primary mb-1">Saved ~14 hours this week</h3>
                 <p className="text-[14px] text-text-muted">Linor successfully resolved 87% of inquiries automatically, preventing 142 support tickets.</p>
               </div>
               <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-full border-[4px] border-success/20 relative">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth="4" className="text-success" strokeDasharray="163" strokeDashoffset="21" strokeLinecap="round" />
                  </svg>
                  <span className="text-[14px] font-bold text-success">87%</span>
               </div>
            </div>
         </div>

         {/* Upgrade CTA */}
         <Link to="/billing" className="bg-gradient-to-br from-surface to-surface-secondary border border-primary/30 rounded-3xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors flex flex-col justify-between">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(75,127,232,0.2)]">
                 <Zap size={16} className="text-primary" />
              </div>
              <h3 className="text-[16px] font-semibold text-text-primary mb-1">Upgrade to Pro</h3>
              <p className="text-[13px] text-text-muted">Unlock advanced analytics and multi-location support.</p>
            </div>
            <div className="relative z-10 flex justify-end mt-4">
              <span className="text-[13px] font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                 View Plans <ArrowRight size={14} />
              </span>
            </div>
         </Link>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          label="Total Appointments"
          value={appointments.length}
          trend="up"
          trendValue="↑ 12% vs last week"
          icon={CalendarCheck}
          iconBg="bg-primary/10 border border-primary/20 text-primary"
        />
        <StatCard
          label="Pending Confirmations"
          value={pending}
          trendValue={`${pending} awaiting confirmation`}
          icon={Clock}
          iconBg="bg-warning/10 border border-warning/20 text-warning"
        />
        <StatCard
          label="Chat Sessions"
          value={sessions}
          trend="up"
          trendValue="↑ 8% vs last week"
          icon={MessageSquare}
          iconBg="bg-purple-500/10 border border-purple-500/20 text-purple-400"
        />
        <StatCard
          label="AI Resolution Rate"
          value={87}
          suffix="%"
          trend="up"
          trendValue="↑ 2% vs last week"
          icon={ShieldCheck}
          iconBg="bg-success/10 border border-success/20 text-success"
        />
      </div>

      {/* ── Charts Row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Area chart — 3/5 width */}
        <div className="lg:col-span-3 bg-surface/40 backdrop-blur-xl border border-border/60 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden" style={{ minHeight: 380 }}>
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-border-strong to-transparent opacity-50" />
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[16px] font-semibold text-text-primary tracking-tight flex items-center gap-2">
              <Activity size={18} className="text-primary" /> Appointments Over Time
            </h3>
            <div className="flex items-center gap-1 bg-surface-secondary/50 border border-border/60 rounded-xl p-1 backdrop-blur-md">
              <button className="px-4 py-1.5 text-[12px] font-semibold bg-surface text-text-primary rounded-lg shadow-sm border border-border/50">30 Days</button>
              <button className="px-4 py-1.5 text-[12px] font-semibold text-text-muted hover:text-text-primary rounded-lg transition-colors">90 Days</button>
            </div>
          </div>
          <div className="flex-1 min-h-[240px]">
            <AppointmentsAreaChart />
          </div>
        </div>

        {/* Pie chart — 2/5 width */}
        <div className="lg:col-span-2 bg-surface/40 backdrop-blur-xl border border-border/60 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden" style={{ minHeight: 380 }}>
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-border-strong to-transparent opacity-50" />
          <h3 className="text-[16px] font-semibold text-text-primary tracking-tight mb-8">Appointments by Service</h3>
          <div className="flex-1 min-h-[240px]">
            <ServicesPieChart />
          </div>
        </div>
      </div>

      {/* ── Analytics Row 2 ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resolution rate */}
        <div className="bg-surface/40 backdrop-blur-xl border border-border/60 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm">
          <h3 className="text-[16px] font-semibold text-text-primary tracking-tight mb-8">AI Resolution Rate</h3>
          <div className="flex-1 min-h-[220px]">
            <ResolutionLineChart />
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-surface/40 backdrop-blur-xl border border-border/60 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="text-[16px] font-semibold text-text-primary tracking-tight mb-8">Patient Activity by Hour</h3>
          <HourHeatmap />
        </div>
      </div>

      {/* ── Recent Appointments Table ───────────────────────────── */}
      <div className="bg-surface/40 backdrop-blur-xl border border-border/60 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-8 py-6 border-b border-border/60 bg-surface/20">
          <div>
            <h3 className="text-[16px] font-semibold text-text-primary tracking-tight">Recent Appointments</h3>
            <p className="text-[13px] text-text-muted mt-1">Latest patient bookings via AI</p>
          </div>
          <Link to="/appointments" className="text-[13px] font-medium px-4 py-2 bg-surface-secondary border border-border/60 rounded-xl text-text-primary hover:bg-surface hover:border-border transition-all flex items-center gap-1.5 shadow-sm">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr className="bg-surface/10 border-b border-border/40">
                <th className="px-8 py-4 text-[12px] uppercase tracking-wider text-text-muted font-semibold text-left">Patient</th>
                <th className="px-8 py-4 text-[12px] uppercase tracking-wider text-text-muted font-semibold text-left">Service</th>
                <th className="px-8 py-4 text-[12px] uppercase tracking-wider text-text-muted font-semibold text-left">Date</th>
                <th className="px-8 py-4 text-[12px] uppercase tracking-wider text-text-muted font-semibold text-left">Time</th>
                <th className="px-8 py-4 text-[12px] uppercase tracking-wider text-text-muted font-semibold text-left">Status</th>
                <th className="w-12 px-8 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {recent.map((appt) => (
                <tr key={appt.id} className="cursor-pointer hover:bg-surface-secondary/50 transition-colors group">
                  <td className="px-8 py-5 font-semibold text-[14px] text-text-primary">{appt.patient}</td>
                  <td className="px-8 py-5 text-[14px] text-text-secondary">{appt.service}</td>
                  <td className="px-8 py-5 text-[14px] text-text-secondary">{formatDate(appt.date)}</td>
                  <td className="px-8 py-5 text-[14px] text-text-secondary font-mono">{appt.time}</td>
                  <td className="px-8 py-5"><StatusBadge status={appt.status} /></td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-text-muted hover:text-primary transition-colors opacity-0 group-hover:opacity-100 p-2 hover:bg-primary/10 rounded-lg">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Quick Actions ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.path}
              to={action.path}
              className={cn(
                'group relative overflow-hidden flex items-center gap-5 p-6 rounded-3xl border border-border/60',
                'bg-surface/30 backdrop-blur-xl hover:border-primary/40 hover:bg-primary/[0.02]',
                'transition-all duration-300 shadow-sm hover:shadow-md'
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:to-primary/[0.04] transition-colors" />
              <div className="w-12 h-12 rounded-2xl bg-surface border border-border/50 group-hover:bg-primary/10 group-hover:border-primary/20 flex items-center justify-center transition-all duration-300 relative z-10 shadow-sm group-hover:shadow-primary/20">
                <Icon size={22} className="text-text-muted group-hover:text-primary transition-colors" />
              </div>
              <div className="relative z-10">
                <div className="font-semibold text-[15px] text-text-primary group-hover:text-primary transition-colors">
                  {action.label}
                </div>
                <div className="text-[13px] text-text-muted mt-1 leading-relaxed">{action.desc}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
