import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Trash2,
  Loader2,
  Shield,
  Info,
  Key,
  Lock,
  Globe,
  Activity,
  CheckCircle2,
  XCircle,
  Search,
  AlertTriangle,
  Zap,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import useClinicStore from "../store/useClinicStore";
import { CopyButton } from "../components/shared/CopyButton";
import { ConfirmModal } from "../components/shared/ConfirmModal";
import { useToast } from "../components/shared/Toast";
import { MOCK_API_LOGS } from "../lib/mockData";
import { changePasswordSchema, addDomainSchema } from "../lib/validators";
import { maskApiKey, cn } from "../lib/utils";

// ─── Constants ───────────────────────────────────────────────────────────────

const API_USAGE_LIMIT   = 10_000; // Monthly request cap (plan limit)
const API_USAGE_CURRENT = 1_240;  // Mock: requests used this month
const LOGS_PER_PAGE     = 8;      // Activity log rows per page

/** Section anchors for the sticky nav */
const NAV_SECTIONS = [
  { id: "overview", label: "Overview",     Icon: Shield   },
  { id: "api-key",  label: "API Key",      Icon: Key      },
  { id: "origins",  label: "Origins",      Icon: Globe    },
  { id: "password", label: "Password",     Icon: Lock     },
  { id: "activity", label: "Activity Log", Icon: Activity },
];

// ─── Pure Helpers ─────────────────────────────────────────────────────────────

/** Converts an ISO timestamp to a human-friendly relative string. */
function getRelativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/**
 * Generates a deterministic mock response duration for display only.
 * Not derived from real data — purely for visual richness.
 */
function getMockDuration(id) {
  const i = parseInt(id.replace("log-", ""), 10) || 0;
  return 42 + ((i * 17 + 11) % 200); // range: 42–241 ms
}

/** Evaluates password complexity. Returns score (0–5), label, and bar color. */
function getPasswordStrength(pw) {
  const met = [
    pw.length >= 8,
    pw.length >= 12,
    /[A-Z]/.test(pw),
    /[0-9]/.test(pw),
    /[^A-Za-z0-9]/.test(pw),
  ];
  const score = met.filter(Boolean).length;
  const levels = [
    { label: "Too short",   barColor: "bg-danger"  },
    { label: "Weak",        barColor: "bg-danger"  },
    { label: "Fair",        barColor: "bg-warning" },
    { label: "Good",        barColor: "bg-success" },
    { label: "Strong",      barColor: "bg-success" },
    { label: "Very strong", barColor: "bg-success" },
  ];
  return { score, met, ...levels[score] };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Password input field with inline show/hide toggle and error display.
 * Uses RHF registration spread so validation stays wired.
 */
function PasswordField({ label, registration, error, placeholder, hint }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="text-xs font-medium text-text-secondary block mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          {...registration}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className={cn(
            "w-full h-10 px-3 pr-10 text-sm border rounded-md bg-surface",
            "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20",
            "transition-colors placeholder:text-text-muted",
            error ? "border-danger" : "border-border",
          )}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {hint && !error && (
        <p className="mt-1 text-[11px] text-text-muted">{hint}</p>
      )}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

/** Segmented progress bar + label that reflects real-time password complexity. */
function PasswordStrengthMeter({ password }) {
  const { score, label, barColor } = getPasswordStrength(password);
  if (!password) return null;

  const textColor =
    score >= 3 ? "text-success" : score >= 2 ? "text-warning" : "text-danger";

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i < score ? barColor : "bg-surface-secondary",
            )}
          />
        ))}
      </div>
      <p className="text-[11px] text-text-muted">
        Strength:{" "}
        <span className={cn("font-semibold", textColor)}>{label}</span>
      </p>
    </div>
  );
}

/** Colour-coded HTTP method pill badge. */
function MethodBadge({ method }) {
  const styles = {
    GET:    "bg-success-light text-success",
    POST:   "bg-primary-light text-primary",
    PUT:    "bg-warning-light text-warning",
    PATCH:  "bg-warning-light text-warning",
    DELETE: "bg-danger-light text-danger",
  };
  return (
    <span
      className={cn(
        "badge font-mono text-[11px]",
        styles[method] ?? "bg-surface-secondary text-text-muted",
      )}
    >
      {method}
    </span>
  );
}

/** Colour-coded HTTP status code pill badge (2xx green / 4xx amber / 5xx red). */
function StatusBadge({ code }) {
  const cls =
    code >= 500 ? "bg-danger-light text-danger"   :
    code >= 400 ? "bg-warning-light text-warning" :
                  "bg-success-light text-success";
  return (
    <span className={cn("badge font-semibold tabular-nums", cls)}>{code}</span>
  );
}

/** SVG circular score gauge — visualises security health 0–100. */
function ScoreGauge({ score }) {
  const r    = 26;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const stroke =
    score >= 75 ? "var(--success)" :
    score >= 50 ? "var(--warning)" :
                  "var(--danger)";

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
        {/* Track */}
        <circle
          cx="32" cy="32" r={r}
          fill="none" stroke="var(--surface-secondary)" strokeWidth="5"
        />
        {/* Progress arc */}
        <circle
          cx="32" cy="32" r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${fill} ${circ - fill}`}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[13px] font-bold text-text-primary tabular-nums">
          {score}
        </span>
      </div>
    </div>
  );
}

/** Horizontal usage bar with configurable colour thresholds. */
function UsageBar({ used, limit, label }) {
  const pct      = Math.min((used / limit) * 100, 100);
  const barColor =
    pct > 90 ? "bg-danger" : pct > 70 ? "bg-warning" : "bg-primary";
  const pctColor =
    pct > 90 ? "text-danger" : pct > 70 ? "text-warning" : "text-text-primary";

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-text-muted">{label}</span>
          <span className={cn("font-semibold tabular-nums", pctColor)}>
            {pct.toFixed(1)}%
          </span>
        </div>
      )}
      <div className="h-1.5 w-full bg-surface-secondary rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-[11px] text-text-muted tabular-nums">
        {used.toLocaleString()} / {limit.toLocaleString()} requests this month
      </p>
    </div>
  );
}

// ─── Skeleton Components ──────────────────────────────────────────────────────

function SkeletonBlock({ className }) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

function SkeletonStatCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-surface border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-2.5 w-16" />
            <SkeletonBlock className="h-7 w-7 rounded-lg" />
          </div>
          <SkeletonBlock className="h-7 w-20" />
          <SkeletonBlock className="h-2.5 w-24" />
        </div>
      ))}
    </div>
  );
}

function SkeletonHealthPanel() {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-start gap-5">
        <SkeletonBlock className="w-16 h-16 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-4">
          <SkeletonBlock className="h-4 w-36" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonBlock className="h-5 w-5 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <SkeletonBlock className="h-3 w-40" />
                <SkeletonBlock className="h-2.5 w-56" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonFieldGroup({ rows = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <SkeletonBlock className="h-2.5 w-24" />
          <SkeletonBlock className="h-10 w-full" />
        </div>
      ))}
      <div className="flex justify-end pt-1">
        <SkeletonBlock className="h-9 w-32" />
      </div>
    </div>
  );
}

function SkeletonActivityRows() {
  return (
    <>
      {Array.from({ length: LOGS_PER_PAGE }).map((_, i) => (
        <tr key={i}>
          {[{ w: 180 }, { w: 60 }, { w: 52 }, { w: 64 }, { w: 112 }, { w: 60 }].map(({ w }, j) => (
            <td key={j} className="px-4 py-3">
              <div className="skeleton h-3.5 rounded" style={{ width: w }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ currentPage, totalPages, onPageChange, totalItems, pageSize }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (currentPage > 3) pages.push("...");
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) {
      pages.push(p);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const rangeStart = (currentPage - 1) * pageSize + 1;
  const rangeEnd   = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-surface-secondary/40 flex-wrap gap-3">
      <p className="text-xs text-text-muted tabular-nums">
        Showing{" "}
        <span className="font-semibold text-text-secondary">{rangeStart}–{rangeEnd}</span>
        {" "}of{" "}
        <span className="font-semibold text-text-secondary">{totalItems}</span>{" "}
        entries
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="w-7 h-7 flex items-center justify-center text-xs text-text-muted select-none">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className={cn(
                "w-7 h-7 rounded-md text-xs font-medium transition-colors",
                currentPage === page
                  ? "bg-primary text-primary-on shadow-sm"
                  : "text-text-muted hover:text-text-primary hover:bg-surface",
              )}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function ApiSecurity() {
  // ── Store (API calls must not be modified) ─────────────────────────────────
  const { allowedOrigins, addOrigin, removeOrigin, regenerateApiKeyOnApi } =
    useClinicStore();
  const toast = useToast();

  // ── UI state ───────────────────────────────────────────────────────────────
  const [apiKey,         setApiKey]         = useState("");
  const [revealed,       setRevealed]       = useState(false);
  const [regenOpen,      setRegenOpen]      = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [newDomain,      setNewDomain]      = useState("");
  const [logFilter,      setLogFilter]      = useState("all");  // 'all' | 'success' | 'error'
  const [logSearch,      setLogSearch]      = useState("");
  const [activeSection,  setActiveSection]  = useState("overview");
  const [isLoading,      setIsLoading]      = useState(true);
  const [currentPage,    setCurrentPage]    = useState(1);

  // Load API key on mount (original logic preserved)
  useEffect(() => {
    const authState = useAuthStore.getState();
    setApiKey(authState.getApiKey());
  }, []);

  // Simulate async data fetch — resolves after 1.3 s
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1300);
    return () => clearTimeout(t);
  }, []);

  // Reset to page 1 whenever the filter or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [logFilter, logSearch]);

  // Scroll-spy: update active section as user scrolls through content
  useEffect(() => {
    if (isLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-10% 0px -80% 0px", threshold: 0 },
    );
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isLoading]);

  // ── React Hook Form (original schemas preserved) ──────────────────────────
  const pwForm     = useForm({ resolver: zodResolver(changePasswordSchema) });
  const domainForm = useForm({ resolver: zodResolver(addDomainSchema) }); // kept for schema compatibility
  const watchedNewPassword = pwForm.watch("newPassword") ?? "";

  // ── Derived: activity log analytics ───────────────────────────────────────
  const logAnalytics = useMemo(() => {
    const total      = MOCK_API_LOGS.length;
    const errorCount = MOCK_API_LOGS.filter((l) => l.status >= 400).length;
    const errorRate  = ((errorCount / total) * 100).toFixed(1);

    // Count calls per endpoint to find the most-used one
    const counts = MOCK_API_LOGS.reduce((acc, l) => {
      acc[l.endpoint] = (acc[l.endpoint] || 0) + 1;
      return acc;
    }, {});
    const topEndpoint =
      Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

    return { total, errorCount, errorRate, topEndpoint };
  }, []);

  // ── Derived: security health score ────────────────────────────────────────
  const security = useMemo(() => {
    const errorRate = MOCK_API_LOGS.filter((l) => l.status >= 400).length / MOCK_API_LOGS.length;

    const checks = [
      {
        id:     "api-key",
        label:  "API Key Configured",
        detail: "Your widget embed key is active and valid",
        passed: true,
      },
      {
        id:     "origins",
        label:  "Origin Restrictions Active",
        detail:
          allowedOrigins.length > 0
            ? `${allowedOrigins.length} domain${allowedOrigins.length !== 1 ? "s" : ""} on allowlist`
            : "All origins allowed — add domains to restrict access",
        passed: allowedOrigins.length > 0,
        action: allowedOrigins.length === 0
          ? { label: "Add origins →", sectionId: "origins" }
          : null,
      },
      {
        id:     "errors",
        label:  "Low API Error Rate",
        detail: `${(errorRate * 100).toFixed(1)}% error rate across recent requests`,
        passed: errorRate < 0.2,
      },
      {
        id:       "2fa",
        label:    "Two-Factor Authentication",
        detail:   "Adds an extra layer of account security",
        passed:   false,
        disabled: true, // feature not yet available
      },
    ];

    const score      = checks.filter((c) => c.passed).length * 25;
    const scoreLabel = score >= 75 ? "Good" : score >= 50 ? "Fair" : "Needs Attention";
    const scoreColor = score >= 75 ? "text-success" : score >= 50 ? "text-warning" : "text-danger";
    const scoreBg    = score >= 75 ? "bg-success-light" : score >= 50 ? "bg-warning-light" : "bg-danger-light";

    return { checks, score, scoreLabel, scoreColor, scoreBg };
  }, [allowedOrigins]);

  // ── Derived: filtered activity log rows ───────────────────────────────────
  const filteredLogs = useMemo(() => {
    return MOCK_API_LOGS.filter((log) => {
      const matchesStatus =
        logFilter === "all"     ? true :
        logFilter === "success" ? log.status < 400 :
                                  log.status >= 400;

      const q = logSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        log.endpoint.toLowerCase().includes(q) ||
        log.ip.includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [logFilter, logSearch]);

  const totalPages    = Math.ceil(filteredLogs.length / LOGS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * LOGS_PER_PAGE,
    currentPage * LOGS_PER_PAGE,
  );

  // ── Handlers (all API calls preserved exactly from original) ──────────────

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const newApiKey = await regenerateApiKeyOnApi();
      if (newApiKey) {
        setApiKey(newApiKey);
        setRegenOpen(false);
        setRevealed(false);
        toast.success("API key regenerated. Update your embed snippet.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to regenerate API key");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleChangePassword = async () => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Password changed successfully.");
    pwForm.reset();
  };

  const handleAddDomain = async () => {
    if (!newDomain.trim()) return;
    try {
      new URL(newDomain); // validate URL structure before storing
      addOrigin(newDomain.trim());
      setNewDomain("");
      toast.success("Domain added.");
    } catch {
      toast.error("Enter a valid URL (e.g., https://yoursite.com)");
    }
  };

  /** Smooth-scroll to a section and update the nav active indicator. */
  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="w-full flex flex-col gap-6">

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-h2 text-text-primary">API & Security</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Manage your API key, access control, and account security.
          </p>
        </div>
        <span
          className={cn(
            "badge mt-1 gap-1.5 border",
            security.scoreBg,
            security.scoreColor,
            security.score >= 75
              ? "border-success/20"
              : security.score >= 50
                ? "border-warning/20"
                : "border-danger/20",
          )}
        >
          <Shield size={11} />
          {security.scoreLabel}
        </span>
      </div>

      {/* ── Mobile-only horizontal section nav ──────────────────── */}
      <nav
        aria-label="Page sections"
        className="lg:hidden flex gap-1 bg-surface border border-border rounded-xl p-1 overflow-x-auto scrollbar-none"
      >
        {NAV_SECTIONS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollToSection(id)}
            className={cn(
              "flex items-center gap-1.5 h-8 px-3 rounded-lg text-[13px] font-medium whitespace-nowrap",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              activeSection === id
                ? "bg-surface-secondary text-text-primary"
                : "text-text-muted hover:text-text-secondary hover:bg-surface-secondary/60",
            )}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </nav>

      {/* ── Two-column layout: left sticky nav + content ────────── */}
      <div className="flex items-start gap-6 xl:gap-8">

        {/* ── Left: Sticky section navigator (desktop only) ─────── */}
        <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-3 self-start">
          <nav
            aria-label="Page sections"
            className="bg-surface border border-border rounded-xl overflow-hidden"
          >
            <div className="px-3 py-2.5 border-b border-border">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                Sections
              </p>
            </div>
            <div className="p-1.5 space-y-0.5">
              {NAV_SECTIONS.map(({ id, label, Icon }) => {
                const isActive = activeSection === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => scrollToSection(id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 h-9 px-3 rounded-lg text-[13px] font-medium",
                      "transition-all text-left relative",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                      isActive
                        ? "bg-primary-light text-primary"
                        : "text-text-muted hover:text-text-secondary hover:bg-surface-secondary/70",
                    )}
                  >
                    {/* Active left accent bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                    )}
                    <Icon size={13} className="flex-shrink-0" />
                    <span className="flex-1">{label}</span>

                    {/* Contextual status badges */}
                    {id === "overview" && !isLoading && (
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                          security.scoreBg,
                          security.scoreColor,
                        )}
                      >
                        {security.score}
                      </span>
                    )}
                    {id === "origins" && !isLoading && (
                      <span className="text-[10px] font-semibold bg-surface-secondary text-text-muted px-1.5 py-0.5 rounded-full tabular-nums">
                        {allowedOrigins.length}
                      </span>
                    )}
                    {id === "activity" && !isLoading && (
                      <span className="text-[10px] font-semibold bg-surface-secondary text-text-muted px-1.5 py-0.5 rounded-full tabular-nums">
                        {MOCK_API_LOGS.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* ── Right: Main content ──────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* ════════════════════════════════════════════════════
              SECTION: Overview
          ════════════════════════════════════════════════════ */}
          <section id="overview" aria-labelledby="heading-overview">
            {isLoading ? (
              <>
                <SkeletonStatCards />
                <SkeletonHealthPanel />
              </>
            ) : (
              <>
                {/* KPI stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    {
                      label:     "API Calls",
                      value:     API_USAGE_CURRENT.toLocaleString(),
                      sub:       "This month",
                      Icon:      Zap,
                      iconClass: "bg-primary-light text-primary",
                    },
                    {
                      label:     "Error Rate",
                      value:     `${logAnalytics.errorRate}%`,
                      sub:       `${logAnalytics.errorCount} errors detected`,
                      Icon:      XCircle,
                      iconClass:
                        parseFloat(logAnalytics.errorRate) < 5
                          ? "bg-success-light text-success"
                          : "bg-danger-light text-danger",
                    },
                    {
                      label:     "Active Origins",
                      value:     allowedOrigins.length === 0 ? "Open" : String(allowedOrigins.length),
                      sub:       allowedOrigins.length === 0 ? "All domains allowed" : `Domain${allowedOrigins.length !== 1 ? "s" : ""} restricted`,
                      Icon:      Globe,
                      iconClass:
                        allowedOrigins.length > 0
                          ? "bg-success-light text-success"
                          : "bg-warning-light text-warning",
                    },
                    {
                      label:     "Rate Limit Used",
                      value:     `${((API_USAGE_CURRENT / API_USAGE_LIMIT) * 100).toFixed(1)}%`,
                      sub:       `${API_USAGE_CURRENT.toLocaleString()} / ${API_USAGE_LIMIT.toLocaleString()}`,
                      Icon:      Activity,
                      iconClass: "bg-primary-light text-primary",
                    },
                  ].map(({ label, value, sub, Icon: IcoComp, iconClass }) => (
                    <div
                      key={label}
                      className="bg-surface border border-border rounded-xl p-4 space-y-2 hover:border-border-strong transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                          {label}
                        </span>
                        <span className={cn("w-7 h-7 rounded-lg grid place-items-center flex-shrink-0", iconClass)}>
                          <IcoComp size={13} />
                        </span>
                      </div>
                      <p className="text-[22px] font-semibold text-text-primary tabular-nums leading-none">
                        {value}
                      </p>
                      <p className="text-[11px] text-text-muted">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Security health checklist */}
                <div className="bg-surface border border-border rounded-xl p-5">
                  <div className="flex items-start gap-5">
                    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                      <ScoreGauge score={security.score} />
                      <span className={cn("text-[11px] font-semibold", security.scoreColor)}>
                        {security.scoreLabel}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 id="heading-overview" className="text-h4 text-text-primary mb-3">
                        Security Health
                      </h2>
                      <ul className="space-y-3">
                        {security.checks.map(({ id, label, detail, passed, action, disabled }) => (
                          <li key={id} className="flex items-start gap-3">
                            <span
                              className={cn(
                                "w-5 h-5 rounded-full grid place-items-center flex-shrink-0 mt-0.5",
                                passed
                                  ? "bg-success-light text-success"
                                  : "bg-surface-secondary text-text-muted",
                              )}
                            >
                              {passed ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-sm font-medium leading-none mb-0.5", passed ? "text-text-primary" : "text-text-secondary")}>
                                {label}
                              </p>
                              <p className="text-[11px] text-text-muted">{detail}</p>
                            </div>
                            {action && !disabled && (
                              <button
                                type="button"
                                onClick={() => scrollToSection(action.sectionId)}
                                className="flex-shrink-0 text-[11px] font-medium text-primary hover:underline"
                              >
                                {action.label}
                              </button>
                            )}
                            {disabled && (
                              <span className="flex-shrink-0 text-[10px] font-medium text-text-muted bg-surface-secondary border border-border rounded px-1.5 py-0.5">
                                Soon
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* ════════════════════════════════════════════════════
              SECTION: API Key Management
          ════════════════════════════════════════════════════ */}
          <section
            id="api-key"
            className="bg-surface border border-border rounded-xl overflow-hidden"
            aria-labelledby="heading-api-key"
          >
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <Key size={15} className="text-primary flex-shrink-0" />
              <h2 id="heading-api-key" className="text-h4 text-text-primary">
                API Key Management
              </h2>
            </div>

            <div className="p-5 space-y-5">
              {isLoading ? (
                <div className="space-y-4">
                  <SkeletonBlock className="h-12 w-full" />
                  <SkeletonBlock className="h-8 w-full" />
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((i) => <SkeletonBlock key={i} className="h-16" />)}
                  </div>
                </div>
              ) : (
                <>
                  {/* Key display row */}
                  <div className="bg-surface-secondary border border-border rounded-lg p-3 flex items-center gap-3">
                    <code className="mono flex-1 text-text-primary truncate text-[13px]">
                      {revealed ? apiKey : maskApiKey(apiKey)}
                    </code>
                    <button
                      type="button"
                      onClick={() => setRevealed((v) => !v)}
                      aria-label={revealed ? "Hide API key" : "Reveal API key"}
                      className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-border transition-colors flex-shrink-0"
                    >
                      {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <CopyButton text={apiKey} />
                  </div>

                  {/* Monthly usage bar */}
                  <UsageBar
                    used={API_USAGE_CURRENT}
                    limit={API_USAGE_LIMIT}
                    label="Monthly request usage"
                  />

                  {/* Metadata tiles */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Last Used",      value: getRelativeTime(MOCK_API_LOGS[0].timestamp) },
                      { label: "Calls / Month",  value: API_USAGE_CURRENT.toLocaleString()          },
                      { label: "Last Origin IP", value: MOCK_API_LOGS[0].ip                         },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-surface-secondary rounded-lg p-3 text-center border border-border">
                        <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1.5 font-semibold">
                          {label}
                        </p>
                        <p className="text-xs font-semibold text-text-primary font-mono">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Danger zone footer */}
                  <div className="pt-2 border-t border-border flex items-center justify-between gap-4 flex-wrap">
                    <p className="text-[11px] text-text-muted">
                      Regenerating immediately invalidates the current key — update your embed code afterwards.
                    </p>
                    <button
                      type="button"
                      onClick={() => setRegenOpen(true)}
                      disabled={isRegenerating}
                      className="flex items-center gap-1.5 text-sm text-danger hover:underline transition-opacity disabled:opacity-50 flex-shrink-0"
                    >
                      <RefreshCw size={14} className={isRegenerating ? "animate-spin" : ""} />
                      {isRegenerating ? "Regenerating…" : "Regenerate Key"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* ════════════════════════════════════════════════════
              SECTION: Allowed Origins
          ════════════════════════════════════════════════════ */}
          <section
            id="origins"
            className="bg-surface border border-border rounded-xl overflow-hidden"
            aria-labelledby="heading-origins"
          >
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <Globe size={15} className="text-primary flex-shrink-0" />
              <h2 id="heading-origins" className="text-h4 text-text-primary">
                Allowed Origins
              </h2>
            </div>

            <div className="p-5 space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  <SkeletonBlock className="h-12 w-full" />
                  {[0, 1].map((i) => <SkeletonBlock key={i} className="h-11 w-full" />)}
                  <SkeletonBlock className="h-10 w-full" />
                </div>
              ) : (
                <>
                  {/* Info banner */}
                  <div className="flex items-start gap-2.5 p-3 bg-primary-light border border-primary/20 rounded-lg">
                    <Info size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-primary leading-relaxed">
                      Only these domains can embed and call your widget API. An empty list allows all origins — not recommended for production.
                    </p>
                  </div>

                  {/* Domain list */}
                  <div className="space-y-2 min-h-[44px]">
                    <AnimatePresence mode="popLayout">
                      {allowedOrigins.map((domain) => (
                        <motion.div
                          key={domain}
                          layout
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="flex items-center justify-between px-3 py-2.5 bg-surface-secondary border border-border rounded-lg"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
                            <span className="text-sm font-mono text-text-primary truncate">{domain}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => { removeOrigin(domain); toast.info(`${domain} removed.`); }}
                            aria-label={`Remove ${domain}`}
                            className="ml-3 p-1 rounded text-text-muted hover:text-danger hover:bg-danger-light transition-colors flex-shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {allowedOrigins.length === 0 && (
                      <div className="flex items-center gap-2 py-2 px-1">
                        <AlertTriangle size={14} className="text-warning flex-shrink-0" />
                        <p className="text-sm text-text-muted">
                          No restrictions — all origins can embed your widget.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Add domain input */}
                  <div className="flex gap-2">
                    <input
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
                      placeholder="https://yourwebsite.com"
                      aria-label="Domain URL to allow"
                      className={cn(
                        "flex-1 h-10 px-3 text-sm border border-border rounded-md bg-surface",
                        "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20",
                        "transition-colors font-mono placeholder:font-sans placeholder:text-text-muted",
                      )}
                    />
                    <button
                      type="button"
                      onClick={handleAddDomain}
                      disabled={!newDomain.trim()}
                      className={cn(
                        "h-10 px-4 text-sm font-semibold rounded-md flex items-center gap-1.5 transition-colors flex-shrink-0",
                        "bg-primary text-primary-on hover:bg-primary-hover",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                      )}
                    >
                      <Plus size={14} />
                      Add
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* ════════════════════════════════════════════════════
              SECTION: Change Password
          ════════════════════════════════════════════════════ */}
          <section
            id="password"
            className="bg-surface border border-border rounded-xl overflow-hidden"
            aria-labelledby="heading-password"
          >
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <Lock size={15} className="text-primary flex-shrink-0" />
              <h2 id="heading-password" className="text-h4 text-text-primary">
                Change Password
              </h2>
            </div>

            <div className="p-5">
              {isLoading ? (
                <SkeletonFieldGroup rows={3} />
              ) : (
                <form
                  onSubmit={pwForm.handleSubmit(handleChangePassword)}
                  noValidate
                  className="space-y-4"
                >
                  <PasswordField
                    label="Current Password"
                    registration={pwForm.register("currentPassword")}
                    error={pwForm.formState.errors.currentPassword?.message}
                    placeholder="••••••••"
                  />

                  <div>
                    <PasswordField
                      label="New Password"
                      registration={pwForm.register("newPassword")}
                      error={pwForm.formState.errors.newPassword?.message}
                      placeholder="At least 8 characters"
                      hint="Mix uppercase, numbers, and symbols for best protection."
                    />
                    <PasswordStrengthMeter password={watchedNewPassword} />
                  </div>

                  <PasswordField
                    label="Confirm Password"
                    registration={pwForm.register("confirmPassword")}
                    error={pwForm.formState.errors.confirmPassword?.message}
                    placeholder="Repeat new password"
                  />

                  {watchedNewPassword && (
                    <div className="bg-surface-secondary rounded-lg p-3.5 border border-border space-y-2">
                      {[
                        { met: watchedNewPassword.length >= 8,           text: "At least 8 characters"  },
                        { met: /[A-Z]/.test(watchedNewPassword),         text: "One uppercase letter"   },
                        { met: /[0-9]/.test(watchedNewPassword),         text: "One number"             },
                        { met: /[^A-Za-z0-9]/.test(watchedNewPassword), text: "One special character"  },
                      ].map(({ met, text }) => (
                        <div key={text} className="flex items-center gap-2">
                          <span
                            className={cn(
                              "w-4 h-4 rounded-full grid place-items-center flex-shrink-0 transition-colors",
                              met
                                ? "bg-success-light text-success"
                                : "bg-surface text-text-muted border border-border",
                            )}
                          >
                            <CheckCircle2 size={10} />
                          </span>
                          <span className={cn("text-[11px] transition-colors", met ? "text-success font-medium" : "text-text-muted")}>
                            {text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={pwForm.formState.isSubmitting}
                      className={cn(
                        "h-9 px-5 text-sm font-semibold rounded-md flex items-center gap-2 transition-colors",
                        "bg-primary text-primary-on hover:bg-primary-hover",
                        "disabled:opacity-60 disabled:cursor-not-allowed",
                      )}
                    >
                      {pwForm.formState.isSubmitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Updating…
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* ════════════════════════════════════════════════════
              SECTION: API Activity Log
          ════════════════════════════════════════════════════ */}
          <section
            id="activity"
            className="bg-surface border border-border rounded-xl overflow-hidden"
            aria-labelledby="heading-activity"
          >
            {/* Section header */}
            <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Activity size={15} className="text-primary flex-shrink-0" />
                <h2 id="heading-activity" className="text-h4 text-text-primary">
                  Activity Log
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Clock size={12} />
                Last {MOCK_API_LOGS.length} requests
              </div>
            </div>

            {/* Analytics summary bar */}
            <div className="px-5 py-3 bg-surface-secondary border-b border-border grid grid-cols-2 sm:grid-cols-4 gap-3">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <SkeletonBlock className="h-2.5 w-16" />
                    <SkeletonBlock className="h-4 w-20" />
                  </div>
                ))
              ) : (
                [
                  { label: "Total Requests", value: String(logAnalytics.total)      },
                  { label: "Errors",         value: String(logAnalytics.errorCount) },
                  { label: "Error Rate",     value: `${logAnalytics.errorRate}%`    },
                  { label: "Top Endpoint",   value: logAnalytics.topEndpoint        },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-0.5">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-text-primary font-mono truncate">{value}</p>
                  </div>
                ))
              )}
            </div>

            {/* Filter controls */}
            <div className="px-5 py-3 border-b border-border flex items-center gap-3 flex-wrap">
              <div
                role="group"
                aria-label="Filter by status"
                className="flex gap-0.5 bg-surface-secondary border border-border rounded-lg p-0.5"
              >
                {[
                  { key: "all",     label: "All"     },
                  { key: "success", label: "Success" },
                  { key: "error",   label: "Errors"  },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setLogFilter(key)}
                    className={cn(
                      "h-7 px-3 text-xs font-medium rounded-md transition-colors",
                      logFilter === key
                        ? "bg-surface text-text-primary shadow-sm"
                        : "text-text-muted hover:text-text-secondary",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 min-w-[160px] max-w-xs">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
                <input
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  placeholder="Filter by endpoint or IP…"
                  aria-label="Search activity log"
                  className={cn(
                    "w-full h-8 pl-8 pr-3 text-xs border border-border rounded-md bg-surface",
                    "focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20",
                    "placeholder:text-text-muted transition-colors",
                  )}
                />
              </div>

              {(logSearch || logFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => { setLogSearch(""); setLogFilter("all"); }}
                  className="text-xs text-text-muted hover:text-danger transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Log table / skeleton / empty state */}
            <div className="overflow-x-auto">
              {isLoading ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      {["Endpoint", "Method", "Status", "Duration", "IP", "Time"].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <SkeletonActivityRows />
                  </tbody>
                </table>
              ) : filteredLogs.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Endpoint</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Duration</th>
                      <th>IP</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="font-mono text-xs text-text-primary">{log.endpoint}</td>
                        <td><MethodBadge method={log.method} /></td>
                        <td><StatusBadge code={log.status} /></td>
                        <td className="font-mono text-xs tabular-nums">
                          {getMockDuration(log.id)}
                          <span className="text-text-muted ml-0.5">ms</span>
                        </td>
                        <td className="font-mono text-xs text-text-muted">{log.ip}</td>
                        <td className="text-xs text-text-muted tabular-nums">{getRelativeTime(log.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 gap-2 text-center">
                  <Search size={28} className="text-text-muted opacity-30" />
                  <p className="text-sm font-medium text-text-primary">No results</p>
                  <p className="text-xs text-text-muted">No log entries match the current filters.</p>
                  <button
                    type="button"
                    onClick={() => { setLogSearch(""); setLogFilter("all"); }}
                    className="mt-1 text-xs font-medium text-primary hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {!isLoading && filteredLogs.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredLogs.length}
                pageSize={LOGS_PER_PAGE}
              />
            )}
          </section>

        </div>
      </div>

      {/* ── Regenerate API Key confirmation modal ───────────────── */}
      <ConfirmModal
        open={regenOpen}
        onClose={() => !isRegenerating && setRegenOpen(false)}
        onConfirm={handleRegenerate}
        title="Regenerate API Key?"
        description="This will invalidate your current key immediately. Any website using the old key will stop working until you update the embed code."
        confirmLabel={isRegenerating ? "Regenerating…" : "Yes, Regenerate"}
        confirmDanger
        disabled={isRegenerating}
      />
    </div>
  );
}
