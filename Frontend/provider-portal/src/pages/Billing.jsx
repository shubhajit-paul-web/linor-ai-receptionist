import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, CreditCard, Zap, Shield, HelpCircle, Download,
  ArrowRight, Sparkles, Check, Building2, Lock, X
} from 'lucide-react';
import useClinicStore from '../store/useClinicStore';
import { cn, formatDate } from '../lib/utils';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    interval: 'forever',
    desc: 'Perfect for small clinics just getting started.',
    features: [
      'Up to 50 AI appointments/mo',
      'Basic chat logs (7 days)',
      'Standard support',
      '1 Clinic location',
    ],
    notIncluded: ['Custom branding', 'API access', 'Advanced analytics'],
    cta: 'Current Plan',
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 49,
    interval: 'per month',
    desc: 'Everything you need to scale your clinic operations.',
    features: [
      'Unlimited AI appointments',
      'Unlimited chat history',
      'Priority 24/7 support',
      'Custom widget branding',
      'Advanced analytics & heatmaps',
      'Multi-location support',
    ],
    popular: true,
    cta: 'Upgrade to Pro',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    interval: '',
    desc: 'Advanced security and custom integrations for large networks.',
    features: [
      'Custom API integrations',
      'Dedicated account manager',
      'HIPAA BAA agreement',
      'SSO (SAML, OAuth)',
      'Custom AI model fine-tuning',
    ],
    cta: 'Contact Sales',
  }
];

const INVOICES = [
  { id: 'INV-2026-004', date: '2026-04-01', amount: '$49.00', status: 'Paid', download: '#' },
  { id: 'INV-2026-003', date: '2026-03-01', amount: '$49.00', status: 'Paid', download: '#' },
  { id: 'INV-2026-002', date: '2026-02-01', amount: '$49.00', status: 'Paid', download: '#' },
];

export default function Billing() {
  const { clinic } = useClinicStore();
  const [annual, setAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('pro');

  return (
    <div className="space-y-10 max-w-[1200px] mx-auto pb-16">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-surface/30 backdrop-blur-xl border border-border/60 p-8 sm:p-12">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-3">
              Billing & Plans
            </h1>
            <p className="text-[15px] text-text-muted max-w-xl leading-relaxed">
              Manage your subscription, billing details, and view invoices. Upgrade to Pro to unlock the full potential of Linor AI for your clinic.
            </p>
          </div>

          {/* Current Plan Badge */}
          <div className="flex flex-col gap-2 p-5 bg-surface/50 rounded-2xl border border-border/50 shadow-sm backdrop-blur-md min-w-[240px]">
            <div className="text-[13px] font-medium text-text-muted tracking-wide uppercase">Current Plan</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Zap size={20} className="text-primary" />
              </div>
              <div>
                <div className="text-[18px] font-bold text-text-primary">
                  {clinic.isPro ? 'Pro Plan' : 'Starter Plan'}
                </div>
                <div className="text-[13px] text-success flex items-center gap-1">
                  <CheckCircle2 size={12} /> Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pricing Section ───────────────────────────────────── */}
      <div className="space-y-8">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[13px] font-medium">
            <Sparkles size={14} /> Supercharge your clinic
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Simple, transparent pricing
          </h2>
          
          {/* Toggle */}
          <div className="flex items-center gap-4 bg-surface/50 p-1.5 rounded-full border border-border/60">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "px-5 py-2 rounded-full text-[14px] font-medium transition-all duration-300",
                !annual ? "bg-surface shadow-md text-text-primary border border-border/50" : "text-text-muted hover:text-text-primary"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "px-5 py-2 rounded-full text-[14px] font-medium transition-all duration-300 relative flex items-center gap-2",
                annual ? "bg-primary text-primary-on shadow-md shadow-primary/25" : "text-text-muted hover:text-text-primary"
              )}
            >
              Annually
              {annual && <span className="absolute -top-3 -right-3 bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm shadow-success/30 rotate-12">Save 20%</span>}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-4">
          {PLANS.map((plan) => {
            const isPopular = plan.popular;
            const price = typeof plan.price === 'number' 
              ? (annual && plan.price > 0 ? Math.floor(plan.price * 0.8) : plan.price) 
              : plan.price;

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -4 }}
                className={cn(
                  "relative flex flex-col rounded-3xl p-8 transition-all duration-300",
                  isPopular 
                    ? "bg-surface border-2 border-primary shadow-[0_8px_30px_-4px_rgba(75,127,232,0.15)]" 
                    : "bg-surface/30 border border-border/60 hover:bg-surface/50"
                )}
              >
                {isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-on text-[12px] font-bold px-4 py-1 rounded-full flex items-center gap-1 shadow-md shadow-primary/30">
                    <Zap size={12} /> MOST POPULAR
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-[20px] font-semibold text-text-primary mb-2">{plan.name}</h3>
                  <p className="text-[14px] text-text-muted h-10">{plan.desc}</p>
                </div>

                <div className="mb-8 flex items-end gap-1">
                  {typeof price === 'number' ? (
                    <>
                      <span className="text-[36px] font-bold text-text-primary leading-none">${price}</span>
                      <span className="text-[14px] text-text-muted font-medium mb-1">/mo</span>
                    </>
                  ) : (
                    <span className="text-[32px] font-bold text-text-primary leading-none">{price}</span>
                  )}
                </div>

                <button
                  className={cn(
                    "w-full py-3 px-4 rounded-xl text-[14px] font-semibold transition-all duration-300 flex items-center justify-center gap-2 mb-8",
                    isPopular 
                      ? "bg-primary text-primary-on shadow-lg shadow-primary/25 hover:bg-primary-hover hover:-translate-y-0.5" 
                      : "bg-surface-secondary text-text-primary border border-border hover:border-border-strong hover:bg-surface"
                  )}
                >
                  {plan.cta} {isPopular && <ArrowRight size={16} />}
                </button>

                <div className="space-y-4 flex-1">
                  <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-4">Included Features</div>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={12} className="text-primary" />
                      </div>
                      <span className="text-[14px] text-text-secondary leading-snug">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.notIncluded && plan.notIncluded.length > 0 && (
                    <>
                      <div className="pt-4 pb-2">
                        <div className="h-px w-full bg-border/50" />
                      </div>
                      {plan.notIncluded.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 opacity-50">
                          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <X size={14} className="text-text-muted" />
                          </div>
                          <span className="text-[14px] text-text-muted leading-snug">{feature}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Payment Method ────────────────────────────────────── */}
        <div className="bg-surface/40 backdrop-blur-xl border border-border/60 rounded-3xl p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[18px] font-semibold text-text-primary">Payment Method</h3>
              <p className="text-[13px] text-text-muted mt-1">Manage your connected card details.</p>
            </div>
            <div className="w-10 h-10 bg-surface rounded-full border border-border/60 flex items-center justify-center shadow-sm">
              <Shield size={18} className="text-success" />
            </div>
          </div>

          <div className="flex-1 bg-surface-secondary/50 border border-border/50 rounded-2xl p-5 mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-10 bg-[#1A1F36] rounded border border-[#2D334D] shadow-inner flex items-center justify-center relative overflow-hidden">
                   <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="32" height="32" fill="none"/>
                      <path d="M16 4C9.37 4 4 9.37 4 16C4 22.63 9.37 28 16 28C22.63 28 28 22.63 28 16C28 9.37 22.63 4 16 4ZM16 26C10.49 26 6 21.51 6 16C6 10.49 10.49 6 16 6C21.51 6 26 10.49 26 16C26 21.51 21.51 26 16 26Z" fill="#F6A528"/>
                      <path d="M16 10C12.69 10 10 12.69 10 16C10 19.31 12.69 22 16 22C19.31 22 22 19.31 22 16C22 12.69 19.31 10 16 10ZM16 20C13.79 20 12 18.21 12 16C12 13.79 13.79 12 16 12C18.21 12 20 13.79 20 16C20 18.21 18.21 20 16 20Z" fill="#F6A528"/>
                   </svg>
                </div>
                <div>
                  <div className="text-[15px] font-medium text-text-primary tracking-wide">
                    •••• •••• •••• 4242
                  </div>
                  <div className="text-[13px] text-text-muted mt-0.5">Expires 12/28</div>
                </div>
              </div>
              <div className="flex gap-2">
                 <button className="text-[13px] font-medium text-primary hover:text-primary-hover px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors">Edit</button>
              </div>
            </div>
          </div>
          
          <button className="w-full py-2.5 rounded-xl text-[14px] font-medium border border-border/60 hover:bg-surface text-text-primary transition-colors flex items-center justify-center gap-2">
            <CreditCard size={16} /> Add new payment method
          </button>
        </div>

        {/* ── Billing History ───────────────────────────────────── */}
        <div className="bg-surface/40 backdrop-blur-xl border border-border/60 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[18px] font-semibold text-text-primary">Billing History</h3>
              <p className="text-[13px] text-text-muted mt-1">View and download your past invoices.</p>
            </div>
            <button className="text-[13px] font-medium text-primary hover:text-primary-hover flex items-center gap-1">
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {INVOICES.map((inv) => (
              <div key={inv.id} className="group flex items-center justify-between p-4 rounded-2xl border border-border/40 hover:border-border hover:bg-surface-secondary/50 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                    <Download size={16} />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-text-primary">{inv.amount} — {inv.status}</div>
                    <div className="text-[13px] text-text-muted mt-0.5">{inv.id} • {formatDate(inv.date)}</div>
                  </div>
                </div>
                <button className="text-[13px] font-medium text-text-muted group-hover:text-primary px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors">
                  PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
