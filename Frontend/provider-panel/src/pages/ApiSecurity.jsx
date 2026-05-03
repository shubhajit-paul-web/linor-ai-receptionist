import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Trash2,
  Loader2,
  Shield,
  Info,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import useClinicStore from "../store/useClinicStore";
import { CopyButton } from "../components/shared/CopyButton";
import { ConfirmModal } from "../components/shared/ConfirmModal";
import { useToast } from "../components/shared/Toast";
import { MOCK_API_LOGS } from "../lib/mockData";
import { changePasswordSchema, addDomainSchema } from "../lib/validators";
import { maskApiKey, formatDate, cn } from "../lib/utils";

export default function ApiSecurity() {
  const { allowedOrigins, addOrigin, removeOrigin, regenerateApiKeyOnApi } = useClinicStore();
  const toast = useToast();

  const [apiKey, setApiKey] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [regenOpen, setRegenOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [newDomain, setNewDomain] = useState("");

  // Load API key from clinic store on mount
  useEffect(() => {
    const clinicState = useClinicStore.getState();
    // Get API key from auth store for initial display
    const authState = useAuthStore.getState();
    setApiKey(authState.getApiKey());
  }, []);

  const pwForm = useForm({ resolver: zodResolver(changePasswordSchema) });
  const domainForm = useForm({ resolver: zodResolver(addDomainSchema) });

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
      new URL(newDomain); // validate
      addOrigin(newDomain.trim());
      setNewDomain("");
      toast.success("Domain added.");
    } catch {
      toast.error("Enter a valid URL (e.g., https://yoursite.com)");
    }
  };

  const statusColor = (code) => {
    if (code >= 500) return "text-danger";
    if (code >= 400) return "text-warning";
    return "text-success";
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-h2 text-text-primary">API & Security</h1>
        <p className="text-sm text-text-muted mt-0.5">
          Manage your API key, access control, and account security.
        </p>
      </div>

      {/* ── API Key Management ──────────────────────────────────── */}
      <section className="bg-surface border border-border rounded-md p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-primary" />
          <h2 className="text-h4 text-text-primary">API Key Management</h2>
        </div>

        {/* Key display */}
        <div className="bg-surface-secondary border border-border rounded-md p-4 flex items-center gap-3 mb-3">
          <code className="mono flex-1 text-text-primary truncate text-sm">
            {revealed ? apiKey : maskApiKey(apiKey)}
          </code>
          <button
            onClick={() => setRevealed((v) => !v)}
            className="text-text-muted hover:text-text-primary transition-colors flex-shrink-0"
          >
            {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <CopyButton text={apiKey} />
        </div>

        {/* Usage stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Used this month", value: "1,240 requests" },
            { label: "Last used", value: "2 hours ago" },
            { label: "From IP", value: "203.0.113.42" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-surface-secondary rounded-md p-3 text-center border border-border"
            >
              <p className="text-[11px] text-text-muted mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-text-primary">{value}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setRegenOpen(true)}
          disabled={isRegenerating}
          className="flex items-center gap-2 text-sm text-danger hover:underline transition-colors disabled:opacity-60"
        >
          <RefreshCw size={15} className={isRegenerating ? "animate-spin" : ""} />
          {isRegenerating ? "Regenerating..." : "Regenerate API Key"}
        </button>
      </section>

      {/* ── Allowed Origins ─────────────────────────────────────── */}
      <section className="bg-surface border border-border rounded-md p-5">
        <h2 className="text-h4 text-text-primary mb-1">Allowed Origins</h2>
        <div className="flex items-start gap-2 mb-4 p-3 bg-primary-light rounded-md border border-primary/20">
          <Info size={15} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-primary">
            Only these domains can use your widget. Leave empty to allow all
            origins.
          </p>
        </div>

        <div className="space-y-2 mb-3">
          {allowedOrigins.map((domain) => (
            <div
              key={domain}
              className="flex items-center justify-between px-3 py-2.5 bg-surface-secondary border border-border rounded-md"
            >
              <span className="text-sm font-mono text-text-primary truncate">
                {domain}
              </span>
              <button
                onClick={() => {
                  removeOrigin(domain);
                  toast.info(`${domain} removed.`);
                }}
                className="text-text-muted hover:text-danger transition-colors ml-3 flex-shrink-0"
                aria-label={`Remove ${domain}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {allowedOrigins.length === 0 && (
            <p className="text-sm text-text-muted py-2">
              All origins allowed (no restrictions).
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
            placeholder="https://yourwebsite.com"
            className="flex-1 h-10 px-3 text-sm border border-border rounded-md bg-surface focus:outline-none focus:border-primary font-mono"
          />
          <button
            onClick={handleAddDomain}
            className="h-10 px-4 text-sm font-semibold bg-primary text-white rounded-md hover:bg-primary-hover flex items-center gap-2 transition-colors"
          >
            <Plus size={15} />
            Add
          </button>
        </div>
      </section>

      {/* ── Change Password ─────────────────────────────────────── */}
      <section className="bg-surface border border-border rounded-md p-5">
        <h2 className="text-h4 text-text-primary mb-4">Change Password</h2>
        <form
          onSubmit={pwForm.handleSubmit(handleChangePassword)}
          noValidate
          className="space-y-4"
        >
          {[
            {
              name: "currentPassword",
              label: "Current Password",
              placeholder: "••••••••",
            },
            {
              name: "newPassword",
              label: "New Password",
              placeholder: "At least 8 characters",
            },
            {
              name: "confirmPassword",
              label: "Confirm Password",
              placeholder: "Repeat new password",
            },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="text-xs font-medium text-text-secondary block mb-1.5">
                {label}
              </label>
              <input
                {...pwForm.register(name)}
                type="password"
                placeholder={placeholder}
                className={cn(
                  "w-full h-10 px-3 text-sm border rounded-md bg-surface focus:outline-none focus:border-primary transition-colors",
                  pwForm.formState.errors[name]
                    ? "border-danger"
                    : "border-border",
                )}
              />
              {pwForm.formState.errors[name] && (
                <p className="mt-1 text-xs text-danger">
                  {pwForm.formState.errors[name].message}
                </p>
              )}
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={pwForm.formState.isSubmitting}
              className="h-9 px-4 text-sm font-semibold bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-60 flex items-center gap-2 transition-colors"
            >
              {pwForm.formState.isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ── API Logs ────────────────────────────────────────────── */}
      <section className="bg-surface border border-border rounded-md overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-h4 text-text-primary">API Logs</h2>
          <span className="text-xs text-text-muted">Last 20 requests</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Endpoint</th>
                <th>Method</th>
                <th>Status</th>
                <th>Timestamp</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_API_LOGS.map((log) => (
                <tr key={log.id}>
                  <td className="font-mono text-xs">{log.endpoint}</td>
                  <td>
                    <span className="badge bg-surface-secondary text-text-secondary">
                      {log.method}
                    </span>
                  </td>
                  <td>
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        statusColor(log.status),
                      )}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="text-xs">{formatDate(log.timestamp)}</td>
                  <td className="font-mono text-xs">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Regenerate modal */}
      <ConfirmModal
        open={regenOpen}
        onClose={() => !isRegenerating && setRegenOpen(false)}
        onConfirm={handleRegenerate}
        title="Regenerate API Key?"
        description="This will invalidate your current key immediately. Any website using the old key will stop working until you update the embed code."
        confirmLabel={isRegenerating ? "Regenerating..." : "Yes, Regenerate"}
        confirmDanger
        disabled={isRegenerating}
      />
    </div>
  );
}
