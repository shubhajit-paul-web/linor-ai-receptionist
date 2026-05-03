import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock3,
  Copy,
  Loader2,
  Plus,
  Trash2,
  WandSparkles,
  AlertTriangle,
  Save,
  RotateCcw,
  Eye,
} from "lucide-react";
import useClinicStore from "../store/useClinicStore";
import { useToast } from "../components/shared/Toast";
import { cn, sleep } from "../lib/utils";
import {
  TIMEZONE_OPTIONS,
  normalizeWorkingHoursConfig,
  validateWorkingHoursConfig,
  summarizeCoverage,
  resolveAvailabilityAt,
  getDayOrder,
  formatClock,
  getNextOverride,
} from "../lib/workingHours";

const SECTIONS = ["Weekly Hours", "Break Blocks", "Date Overrides", "Summary"];

function createUiId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

function asDateTimeLocal(date) {
  const next = new Date(date);
  next.setMinutes(next.getMinutes() - next.getTimezoneOffset());
  return next.toISOString().slice(0, 16);
}

function asDateKey(date) {
  const next = new Date(date);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(next.getDate()).padStart(2, "0")}`;
}

function parseDateTimeLocal(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function formatOverrideSummary(override) {
  if (!override) return "No upcoming overrides";
  return `${override.date} (${override.type === "closed" ? "Closed" : "Custom hours"})`;
}

function reasonLabel(reason) {
  if (reason === "on_break") return "Closed for break";
  if (reason === "override_closed") return "Closed (date override)";
  return "Closed now";
}

export default function WorkingHours() {
  const {
    clinic,
    workingHours,
    updateWorkingHoursConfig,
    completeSetupStep,
    updateProfileOnApi,
  } = useClinicStore();
  const toast = useToast();

  const source = useMemo(
    () => normalizeWorkingHoursConfig(workingHours),
    [workingHours],
  );
  const [draft, setDraft] = useState(source);
  const [activeSection, setActiveSection] = useState("Weekly Hours");
  const [previewAt, setPreviewAt] = useState(asDateTimeLocal(new Date()));
  const [saving, setSaving] = useState(false);
  const [copyFrom, setCopyFrom] = useState("Monday");
  const [copyTo, setCopyTo] = useState("Tuesday");

  const validation = useMemo(() => validateWorkingHoursConfig(draft), [draft]);
  const coverage = useMemo(() => summarizeCoverage(draft), [draft]);
  const upcomingOverride = useMemo(() => getNextOverride(draft), [draft]);
  const previewState = useMemo(
    () => resolveAvailabilityAt(draft, parseDateTimeLocal(previewAt)),
    [draft, previewAt],
  );
  const isDirty = useMemo(
    () => JSON.stringify(source) !== JSON.stringify(draft),
    [source, draft],
  );

  const updateDay = (day, updater) => {
    setDraft((prev) => ({
      ...prev,
      weekly: prev.weekly.map((row) => (row.day === day ? updater(row) : row)),
    }));
  };

  const addDaySlot = (day) => {
    updateDay(day, (row) => ({
      ...row,
      enabled: true,
      slots: [
        ...row.slots,
        {
          id: createUiId("slot"),
          start: row.slots[row.slots.length - 1]?.end ?? "09:00",
          end: "17:00",
        },
      ],
    }));
  };

  const updateDaySlot = (day, slotId, patch) => {
    updateDay(day, (row) => ({
      ...row,
      slots: row.slots.map((slot) =>
        slot.id === slotId ? { ...slot, ...patch } : slot,
      ),
    }));
  };

  const removeDaySlot = (day, slotId) => {
    updateDay(day, (row) => ({
      ...row,
      slots: row.slots.filter((slot) => slot.id !== slotId),
    }));
  };

  const copyDayPattern = () => {
    if (copyFrom === copyTo) return;
    const from = draft.weekly.find((row) => row.day === copyFrom);
    if (!from) return;
    updateDay(copyTo, () => ({
      ...from,
      day: copyTo,
      slots: from.slots.map((slot) => ({ ...slot, id: createUiId("slot") })),
    }));
    toast.info(`${copyFrom} copied to ${copyTo}.`);
  };

  const applyBusinessTemplate = () => {
    setDraft((prev) => ({
      ...prev,
      weekly: prev.weekly.map((row) => ({
        ...row,
        enabled: !["Saturday", "Sunday"].includes(row.day),
        slots: ["Saturday", "Sunday"].includes(row.day)
          ? []
          : [{ id: createUiId("slot"), start: "09:00", end: "17:00" }],
      })),
      breaks: [],
    }));
    toast.info("Applied template: Mon-Fri 9:00 AM to 5:00 PM.");
  };

  const addBreak = () => {
    setDraft((prev) => ({
      ...prev,
      breaks: [
        ...prev.breaks,
        {
          id: createUiId("break"),
          day: "Monday",
          label: "Lunch",
          start: "12:00",
          end: "13:00",
        },
      ],
    }));
  };

  const updateBreak = (breakId, patch) => {
    setDraft((prev) => ({
      ...prev,
      breaks: prev.breaks.map((item) =>
        item.id === breakId ? { ...item, ...patch } : item,
      ),
    }));
  };

  const removeBreak = (breakId) => {
    setDraft((prev) => ({
      ...prev,
      breaks: prev.breaks.filter((item) => item.id !== breakId),
    }));
  };

  const addOverride = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDraft((prev) => ({
      ...prev,
      overrides: [
        ...prev.overrides,
        {
          id: createUiId("override"),
          date: asDateKey(tomorrow),
          type: "closed",
          note: "",
          slots: [],
        },
      ],
    }));
  };

  const updateOverride = (overrideId, updater) => {
    setDraft((prev) => ({
      ...prev,
      overrides: prev.overrides.map((item) =>
        item.id === overrideId ? updater(item) : item,
      ),
    }));
  };

  const removeOverride = (overrideId) => {
    setDraft((prev) => ({
      ...prev,
      overrides: prev.overrides.filter((item) => item.id !== overrideId),
    }));
  };

  const addOverrideSlot = (overrideId) => {
    updateOverride(overrideId, (item) => ({
      ...item,
      slots: [
        ...item.slots,
        { id: createUiId("slot"), start: "09:00", end: "17:00" },
      ],
    }));
  };

  const updateOverrideSlot = (overrideId, slotId, patch) => {
    updateOverride(overrideId, (item) => ({
      ...item,
      slots: item.slots.map((slot) =>
        slot.id === slotId ? { ...slot, ...patch } : slot,
      ),
    }));
  };

  const removeOverrideSlot = (overrideId, slotId) => {
    updateOverride(overrideId, (item) => ({
      ...item,
      slots: item.slots.filter((slot) => slot.id !== slotId),
    }));
  };

  const handleSave = async () => {
    if (!validation.valid) {
      toast.error("Fix validation issues before saving.");
      return;
    }

    setSaving(true);
    try {
      // Pass the existing clinic state alongside the new working hours draft
      await updateProfileOnApi({
        ...clinic,
        workingHours: draft,
      });

      // Update local store state
      updateWorkingHoursConfig(draft);
      completeSetupStep("workingHours");
      toast.success("Working hours updated.");
    } catch (error) {
      console.error("Error saving working hours:", error);
      toast.error("Failed to save working hours. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setDraft(source);
    toast.info("Changes discarded.");
  };

  return (
    <div className="max-w-[1400px] space-y-6 pb-24">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-h2 text-text-primary">Working Hours</h1>
          <p className="text-sm text-text-secondary mt-1">
            Configure availability exactly how patients should experience it.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={applyBusinessTemplate}
            className="h-9 px-3 text-sm border border-border rounded-md bg-surface hover:bg-surface-secondary inline-flex items-center gap-2"
          >
            <WandSparkles size={14} />
            Apply Mon-Fri 9-5
          </button>
          <label className="h-9 px-2 border border-border rounded-md bg-surface inline-flex items-center gap-2 text-sm">
            <Clock3 size={14} className="text-text-muted" />
            <span className="text-text-secondary">Timezone</span>
            <select
              value={draft.timezone}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, timezone: e.target.value }))
              }
              className="inline-flex items-center gap-2  bg-surface px-3 py-1.5 text-sm/6 font-semibold text-white  shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-700 data-open:bg-gray-700"
              aria-label="Clinic timezone"
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {!validation.valid && (
        <div className="border border-warning/40 bg-warning-light rounded-md p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-warning mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Resolve these issues to save
              </p>
              <ul className="mt-1 text-xs text-text-secondary list-disc pl-4 space-y-0.5">
                {validation.errors.slice(0, 5).map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        <div className="min-w-0">
          <div className="bg-surface border border-border rounded-md">
            <div className="flex overflow-x-auto p-2 gap-1 border-b border-border">
              {SECTIONS.map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={cn(
                    "h-8 px-3 rounded-md text-sm whitespace-nowrap transition-colors",
                    activeSection === section
                      ? "bg-primary-light text-primary font-medium"
                      : "text-text-secondary hover:bg-surface-secondary",
                  )}
                >
                  {section}
                </button>
              ))}
            </div>

            <div className="p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16 }}
                >
                  {activeSection === "Weekly Hours" && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2 p-3 bg-surface-secondary border border-border rounded-md">
                        <span className="text-xs font-medium text-text-secondary">
                          Copy pattern
                        </span>
                        <select
                          value={copyFrom}
                          onChange={(e) => setCopyFrom(e.target.value)}
                          className="h-8 px-2 text-sm border border-border rounded bg-surface"
                        >
                          {getDayOrder().map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                        <span className="text-text-muted">to</span>
                        <select
                          value={copyTo}
                          onChange={(e) => setCopyTo(e.target.value)}
                          className="h-8 px-2 text-sm border border-border rounded bg-surface"
                        >
                          {getDayOrder().map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={copyDayPattern}
                          className="h-8 px-3 ml-auto text-xs font-medium border border-border rounded-md hover:bg-surface"
                        >
                          <Copy size={13} className="inline mr-1.5" />
                          Copy
                        </button>
                      </div>

                      {draft.weekly.map((daySchedule) => (
                        <div
                          key={daySchedule.day}
                          className="border border-border rounded-md p-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-text-primary">
                                {daySchedule.day}
                              </p>
                              <p className="text-xs text-text-muted">
                                {daySchedule.enabled
                                  ? `${daySchedule.slots.length} slot(s)`
                                  : "Closed"}
                              </p>
                            </div>
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={daySchedule.enabled}
                                onChange={(e) =>
                                  updateDay(daySchedule.day, (row) => ({
                                    ...row,
                                    enabled: e.target.checked,
                                    slots:
                                      e.target.checked && !row.slots.length
                                        ? [
                                            {
                                              id: createUiId("slot"),
                                              start: "09:00",
                                              end: "17:00",
                                            },
                                          ]
                                        : row.slots,
                                  }))
                                }
                              />
                              <span className="toggle-thumb" />
                            </label>
                          </div>

                          {daySchedule.enabled && (
                            <div className="mt-3 space-y-2">
                              {daySchedule.slots.map((slot) => (
                                <div
                                  key={slot.id}
                                  className="flex flex-wrap items-center gap-2"
                                >
                                  <input
                                    type="time"
                                    value={slot.start}
                                    onChange={(e) =>
                                      updateDaySlot(daySchedule.day, slot.id, {
                                        start: e.target.value,
                                      })
                                    }
                                    className="h-9 px-2 text-sm border border-border rounded-md bg-surface"
                                  />
                                  <span className="text-text-muted text-xs">
                                    to
                                  </span>
                                  <input
                                    type="time"
                                    value={slot.end}
                                    onChange={(e) =>
                                      updateDaySlot(daySchedule.day, slot.id, {
                                        end: e.target.value,
                                      })
                                    }
                                    className="h-9 px-2 text-sm border border-border rounded-md bg-surface"
                                  />
                                  <button
                                    onClick={() =>
                                      removeDaySlot(daySchedule.day, slot.id)
                                    }
                                    className="h-9 w-9 inline-flex items-center justify-center border border-border rounded-md text-text-muted hover:text-danger hover:border-danger"
                                    aria-label={`Remove slot from ${daySchedule.day}`}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => addDaySlot(daySchedule.day)}
                                className="h-8 px-3 text-xs border border-border rounded-md hover:bg-surface-secondary"
                              >
                                <Plus size={13} className="inline mr-1.5" />
                                Add slot
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {activeSection === "Break Blocks" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-text-secondary">
                          Define recurring pauses (e.g., lunch) inside open
                          windows.
                        </p>
                        <button
                          onClick={addBreak}
                          className="h-8 px-3 text-xs border border-border rounded-md hover:bg-surface-secondary"
                        >
                          <Plus size={13} className="inline mr-1.5" />
                          Add break
                        </button>
                      </div>

                      {!draft.breaks.length && (
                        <div className="text-sm text-text-muted border border-dashed border-border rounded-md p-4">
                          No break blocks configured.
                        </div>
                      )}

                      {draft.breaks.map((item) => (
                        <div
                          key={item.id}
                          className="grid grid-cols-1 md:grid-cols-[140px_1fr_120px_120px_40px] gap-2 border border-border rounded-md p-3"
                        >
                          <select
                            value={item.day}
                            onChange={(e) =>
                              updateBreak(item.id, { day: e.target.value })
                            }
                            className="h-9 px-2 text-sm border border-border rounded-md bg-surface"
                          >
                            {getDayOrder().map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>
                          <input
                            value={item.label}
                            onChange={(e) =>
                              updateBreak(item.id, { label: e.target.value })
                            }
                            placeholder="Break label (optional)"
                            className="h-9 px-3 text-sm border border-border rounded-md bg-surface"
                          />
                          <input
                            type="time"
                            value={item.start}
                            onChange={(e) =>
                              updateBreak(item.id, { start: e.target.value })
                            }
                            className="h-9 px-2 text-sm border border-border rounded-md bg-surface"
                          />
                          <input
                            type="time"
                            value={item.end}
                            onChange={(e) =>
                              updateBreak(item.id, { end: e.target.value })
                            }
                            className="h-9 px-2 text-sm border border-border rounded-md bg-surface"
                          />
                          <button
                            onClick={() => removeBreak(item.id)}
                            className="h-9 w-9 inline-flex items-center justify-center border border-border rounded-md text-text-muted hover:text-danger hover:border-danger"
                            aria-label="Remove break"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeSection === "Date Overrides" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-text-secondary">
                          Configure holidays and one-off availability changes.
                        </p>
                        <button
                          onClick={addOverride}
                          className="h-8 px-3 text-xs border border-border rounded-md hover:bg-surface-secondary"
                        >
                          <Plus size={13} className="inline mr-1.5" />
                          Add override
                        </button>
                      </div>

                      {!draft.overrides.length && (
                        <div className="text-sm text-text-muted border border-dashed border-border rounded-md p-4">
                          No date overrides yet.
                        </div>
                      )}

                      {draft.overrides.map((item) => (
                        <div
                          key={item.id}
                          className="border border-border rounded-md p-4 space-y-3"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-[170px_170px_1fr_40px] gap-2">
                            <input
                              type="date"
                              value={item.date}
                              onChange={(e) =>
                                updateOverride(item.id, (curr) => ({
                                  ...curr,
                                  date: e.target.value,
                                }))
                              }
                              className="h-9 px-2 text-sm border border-border rounded-md bg-surface"
                            />
                            <select
                              value={item.type}
                              onChange={(e) =>
                                updateOverride(item.id, (curr) => ({
                                  ...curr,
                                  type: e.target.value,
                                  slots:
                                    e.target.value === "custom"
                                      ? curr.slots
                                      : [],
                                }))
                              }
                              className="h-9 px-2 text-sm border border-border rounded-md bg-surface"
                            >
                              <option value="closed">Closed all day</option>
                              <option value="custom">Custom hours</option>
                            </select>
                            <input
                              value={item.note}
                              onChange={(e) =>
                                updateOverride(item.id, (curr) => ({
                                  ...curr,
                                  note: e.target.value,
                                }))
                              }
                              placeholder="Reason / note (optional)"
                              className="h-9 px-3 text-sm border border-border rounded-md bg-surface"
                            />
                            <button
                              onClick={() => removeOverride(item.id)}
                              className="h-9 w-9 inline-flex items-center justify-center border border-border rounded-md text-text-muted hover:text-danger hover:border-danger"
                              aria-label="Remove override"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {item.type === "custom" && (
                            <div className="space-y-2">
                              {item.slots.map((slot) => (
                                <div
                                  key={slot.id}
                                  className="flex flex-wrap items-center gap-2"
                                >
                                  <input
                                    type="time"
                                    value={slot.start}
                                    onChange={(e) =>
                                      updateOverrideSlot(item.id, slot.id, {
                                        start: e.target.value,
                                      })
                                    }
                                    className="h-9 px-2 text-sm border border-border rounded-md bg-surface"
                                  />
                                  <span className="text-text-muted text-xs">
                                    to
                                  </span>
                                  <input
                                    type="time"
                                    value={slot.end}
                                    onChange={(e) =>
                                      updateOverrideSlot(item.id, slot.id, {
                                        end: e.target.value,
                                      })
                                    }
                                    className="h-9 px-2 text-sm border border-border rounded-md bg-surface"
                                  />
                                  <button
                                    onClick={() =>
                                      removeOverrideSlot(item.id, slot.id)
                                    }
                                    className="h-9 w-9 inline-flex items-center justify-center border border-border rounded-md text-text-muted hover:text-danger hover:border-danger"
                                    aria-label="Remove custom slot"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => addOverrideSlot(item.id)}
                                className="h-8 px-3 text-xs border border-border rounded-md hover:bg-surface-secondary"
                              >
                                <Plus size={13} className="inline mr-1.5" />
                                Add custom slot
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {activeSection === "Summary" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="border border-border rounded-md p-4 bg-surface-secondary">
                        <p className="text-xs text-text-muted">Timezone</p>
                        <p className="text-sm font-semibold text-text-primary mt-1">
                          {draft.timezone}
                        </p>
                      </div>
                      <div className="border border-border rounded-md p-4 bg-surface-secondary">
                        <p className="text-xs text-text-muted">Open Days</p>
                        <p className="text-sm font-semibold text-text-primary mt-1">
                          {coverage.openDays} / 7
                        </p>
                      </div>
                      <div className="border border-border rounded-md p-4 bg-surface-secondary">
                        <p className="text-xs text-text-muted">
                          Weekly Open Time
                        </p>
                        <p className="text-sm font-semibold text-text-primary mt-1">
                          {coverage.weeklyOpenLabel}
                        </p>
                      </div>
                      <div className="border border-border rounded-md p-4 bg-surface-secondary">
                        <p className="text-xs text-text-muted">
                          Upcoming Override
                        </p>
                        <p className="text-sm font-semibold text-text-primary mt-1">
                          {formatOverrideSummary(upcomingOverride)}
                        </p>
                      </div>

                      {coverage.warnings.length > 0 && (
                        <div className="sm:col-span-2 border border-warning/40 bg-warning-light rounded-md p-4">
                          <p className="text-xs font-semibold text-text-primary mb-1">
                            Warnings
                          </p>
                          <ul className="text-xs text-text-secondary list-disc pl-4 space-y-0.5">
                            {coverage.warnings.map((warning) => (
                              <li key={warning}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-surface border border-border rounded-md p-4">
            <div className="flex items-center gap-2 mb-3">
              <Eye size={16} className="text-primary" />
              <h3 className="text-sm font-semibold text-text-primary">
                Patient Visibility Preview
              </h3>
            </div>

            <label className="text-xs text-text-muted">
              Simulate date & time
            </label>
            <input
              type="datetime-local"
              value={previewAt}
              onChange={(e) => setPreviewAt(e.target.value)}
              className="w-full h-9 px-2 mt-1 mb-3 text-sm border border-border rounded-md bg-surface"
            />

            <div
              aria-live="polite"
              className={cn(
                "rounded-md border p-3 mb-3",
                previewState.isOpen
                  ? "bg-success-light border-success/30"
                  : "bg-danger-light border-danger/30",
              )}
            >
              <p className="text-xs text-text-muted">Status</p>
              <p className="text-sm font-semibold text-text-primary mt-0.5">
                {previewState.isOpen
                  ? "Open now"
                  : reasonLabel(previewState.reason)}
              </p>
              {previewState.isOpen && previewState.closesAt && (
                <p className="text-xs text-text-secondary mt-1">
                  Closes at {formatClock(previewState.closesAt)}
                </p>
              )}
              {!previewState.isOpen && previewState.nextOpenAt && (
                <p className="text-xs text-text-secondary mt-1">
                  Next opens {previewState.nextOpenAt.dayName} at{" "}
                  {formatClock(previewState.nextOpenAt.time)}
                </p>
              )}
            </div>

            <div className="text-xs text-text-muted space-y-1">
              <p>
                <span className="text-text-secondary">Timezone:</span>{" "}
                {previewState.timezone}
              </p>
              <p>
                <span className="text-text-secondary">Coverage:</span>{" "}
                {coverage.weeklyOpenLabel} weekly
              </p>
              <p>
                <span className="text-text-secondary">Open days:</span>{" "}
                {coverage.openDays} / 7
              </p>
            </div>
          </div>
        </aside>
      </div>

      <div className="sticky bottom-4 z-20">
        <div className="bg-surface border border-border rounded-md p-3 shadow-md flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary">
              {isDirty ? "You have unsaved changes." : "All changes saved."}
            </p>
            <p className="text-xs text-text-muted">
              {validation.valid
                ? "Schedule is valid and ready to publish."
                : `${validation.errors.length} validation issue(s) need attention.`}
            </p>
          </div>
          <div className="sm:ml-auto flex items-center gap-2">
            <button
              onClick={handleDiscard}
              disabled={!isDirty || saving}
              className="h-9 px-3 text-sm border border-border rounded-md disabled:opacity-60 inline-flex items-center gap-2"
            >
              <RotateCcw size={14} />
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={!isDirty || saving || !validation.valid}
              className="h-9 px-4 text-sm font-semibold bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-60 inline-flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save Working Hours
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
