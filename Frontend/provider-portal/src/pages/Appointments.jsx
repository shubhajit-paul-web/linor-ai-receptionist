import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
  CalendarDays,
  Filter,
  Eraser,
} from "lucide-react";
import useClinicStore from "../store/useClinicStore";
import { StatusBadge } from "../components/shared/StatusBadge";
import { EmptyState } from "../components/shared/EmptyState";
import { useToast } from "../components/shared/Toast";
import { formatDate, formatTime, formatDateTime, cn } from "../lib/utils";
import useAppointmentStore from "../store/useAppointmentStore";

const STATUSES = ["All", "pending", "confirmed", "cancelled"];
const PAGE_SIZE = 10;

// ─── Appointment Detail Drawer ────────────────────────────────────────────────

function DetailDrawer({ appointment, onClose, onStatusChange }) {
  if (!appointment) return null;
  const toast = useToast();

  const handleConfirm = () => {
    onStatusChange(appointment._id, "confirmed");
    toast.success(`${appointment.patient}'s appointment confirmed.`);
    onClose();
  };

  const handleCancel = () => {
    onStatusChange(appointment._id, "cancelled");
    toast.info(`Appointment cancelled.`);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 z-30 bg-black/20" />
      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="fixed top-[60px] right-0 bottom-0 z-40 w-[400px] bg-surface border-l border-border overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-h3 text-text-primary">
                {appointment.patient}
              </h2>
              <StatusBadge status={appointment.status} className="mt-1" />
            </div>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Details */}
          <dl className="space-y-3 mb-6">
            {[
              ["Service", appointment.service],
              ["Date", formatDate(appointment.date)],
              ["Time", appointment.time],
              ["Phone", appointment.phone],
              [
                "Booked At",
                formatDate(appointment.bookedAt, {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              ],
              ["Session", appointment.sessionId],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-4">
                <dt className="text-label uppercase text-text-muted w-20 flex-shrink-0">
                  {label}
                </dt>
                <dd className="text-sm text-text-primary font-medium">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Timeline */}
          <div className="mb-6">
            <h4 className="text-label uppercase text-text-muted mb-3">
              Timeline
            </h4>
            <div className="space-y-3">
              {[
                {
                  label: "Booked via chatbot",
                  time: appointment.bookedAt,
                  done: true,
                },
                {
                  label: "Appointment scheduled",
                  time: appointment.date,
                  done: true,
                },
                {
                  label:
                    appointment.status === "confirmed"
                      ? "confirmed"
                      : appointment.status === "cancelled"
                        ? "cancelled"
                        : "Awaiting confirmation",
                  time: null,
                  done: appointment.status !== "pending",
                },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                      step.done ? "bg-success" : "bg-border",
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {step.label}
                    </p>
                    {step.time && (
                      <p className="text-xs text-text-muted">
                        {formatDate(step.time)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {appointment.status === "pending" && (
            <div className="flex gap-2">
              <button
                onClick={handleConfirm}
                className="flex-1 h-9 rounded-md text-sm font-semibold text-white bg-success hover:opacity-90 transition-opacity"
              >
                Confirm Appointment
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 h-9 rounded-md text-sm font-semibold border border-danger text-danger hover:bg-danger-light transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ─── Appointments Page ────────────────────────────────────────────────────────

export default function Appointments() {
  const { appointments, updateAppointmentStatus, fetchAppointments } =
    useAppointmentStore();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const toast = useToast();

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        await fetchAppointments();
      } catch (error) {
        console.error("Failed to load appointments:", error);
      }
    };
    loadAppointments();
  }, [fetchAppointments]);
  // Filter logic

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const matchStatus = status === "All" || a.status === status;
      const matchSearch =
        !search ||
        [a.patientName, a.service, a.phone].some(
          (f) => f && f.toLowerCase().includes(search.toLowerCase()),
        );

      let matchDate = true;
      if (startDate || endDate) {
        const apptDate = new Date(a.date);
        apptDate.setHours(0, 0, 0, 0); // Normalize to midnight for fair comparison

        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          matchDate = matchDate && apptDate >= start;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(0, 0, 0, 0);
          matchDate = matchDate && apptDate <= end;
        }
      }

      return matchStatus && matchSearch && matchDate;
    });
  }, [appointments, status, search, startDate, endDate]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tabCounts = {
    All: appointments.length,
    Pending: appointments.filter((a) => a.status === "pending").length,
    Confirmed: appointments.filter((a) => a.status === "confirmed").length,
    Cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  const toggleRow = (id) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkConfirm = () => {
    selectedRows.forEach((id) => updateAppointmentStatus(id, "confirmed"));
    toast.success(`${selectedRows.size} appointments confirmed.`);

    setSelectedRows(new Set());
  };

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.error("No appointments to export.");
      return;
    }

    // 1. Define the CSV headers
    const headers = [
      "Patient Name",
      "Phone",
      "Service",
      "Date",
      "Time",
      "Status",
      "Booked At",
    ];

    // 2. Map the filtered data into CSV rows
    const csvRows = filtered.map((appt) => {
      // We wrap values in quotes to prevent commas inside names/services from breaking the layout
      return [
        `"${appt.patientName || appt.patient || ""}"`,
        `"${appt.phone || ""}"`,
        `"${appt.service || ""}"`,
        `"${formatDate(appt.date) || ""}"`,
        `"${appt.time || ""}"`,
        `"${appt.status || ""}"`,
        `"${formatDateTime(appt.createdAt || appt.bookedAt) || ""}"`,
      ].join(",");
    });

    // 3. Combine headers and rows with line breaks
    const csvString = [headers.join(","), ...csvRows].join("\n");

    // 4. Create a downloadable Blob
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // 5. Create a temporary hidden link and trigger the download
    const link = document.createElement("a");
    link.href = url;
    // Names the file "appointments_YYYY-MM-DD.csv"
    link.setAttribute(
      "download",
      `appointments_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();

    // 6. Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`${filtered.length} appointments exported successfully!`);
  };

  return (
    <div className="space-y-4 max-w-[1400px]">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-h2 text-text-primary">Appointments</h1>
          <span className="badge bg-surface-secondary text-text-secondary">
            {appointments.length} total
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selectedRows.size > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-2"
            >
              <button
                onClick={handleBulkConfirm}
                className="h-9 px-3 text-sm font-medium bg-success text-white rounded-md hover:opacity-90"
              >
                Confirm {selectedRows.size}
              </button>
              <button
                onClick={() => {
                  selectedRows.forEach((id) =>
                    updateAppointmentStatus(id, "cancelled"),
                  );
                  setSelectedRows(new Set());
                  toast.info("Selected appointments cancelled.");
                }}
                className="h-9 px-3 text-sm font-medium border border-danger text-danger rounded-md hover:bg-danger-light"
              >
                Cancel {selectedRows.size}
              </button>
            </motion.div>
          )}
          {/* Search */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search patients..."
              className="h-9 pl-9 pr-3 w-48 text-sm border border-border rounded-md bg-surface focus:outline-none focus:border-primary"
            />
          </div>
          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-9 px-3 text-sm border border-border rounded-md bg-surface text-text-secondary focus:outline-none"
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <div className="flex items-center gap-1 border border-border rounded-md bg-surface px-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="h-9 text-sm bg-transparent text-text-secondary focus:outline-none"
              title="Start Date"
            />
            <span className="text-text-muted text-xs">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="h-9 text-sm bg-transparent text-text-secondary focus:outline-none"
              title="End Date"
            />
          </div>{" "}
          <button
            onClick={ () => {
              setSearch("");
              setStatus("All");
              setStartDate("");
              setEndDate("");
              setPage(1);
            }}
          className="h-9 px-3 flex items-center gap-2 text-sm border border-border rounded-md hover:bg-surface-secondary text-text-secondary transition-colors">
            <Eraser size={15} />
            Clear
          </button>
          <button
            onClick={handleExport}
            className="h-9 px-3 flex items-center gap-2 text-sm border border-border rounded-md hover:bg-surface-secondary text-text-secondary transition-colors"
          >
            <Download size={15} />
            Export
          </button>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────── */}
      <div className="flex gap-0 border-b border-border">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors duration-150 -mb-px",
              status === s
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text-primary",
            )}
          >
            {s}
            {tabCounts[s] > 0 && (
              <span
                className={cn(
                  "ml-2 px-1.5 py-0.5 text-xs rounded-full",
                  status === s
                    ? "bg-primary text-primary-on"
                    : "bg-surface-secondary text-text-muted",
                )}
              >
                {tabCounts[s]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Table ───────────────────────────────────────────────── */}
      <div className="bg-surface border border-border rounded-md overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No appointments found"
            description="Try adjusting your filters or date range."
            action={{
              label: "Clear Filters",
              onClick: () => {
                setSearch("");
                setStatus("All");
                setStartDate(""); // <-- Added this
                setEndDate(""); // <-- Added this
              },
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-10">
                    <input
                      type="checkbox"
                      // ADD THIS LINE SO IT KNOWS WHEN TO BE CHECKED/UNCHECKED:
                      checked={
                        paginated.length > 0 &&
                        paginated.every((a) => selectedRows.has(a._id))
                      }
                      onChange={(e) => {
                        setSelectedRows(
                          e.target.checked
                            ? new Set(paginated.map((a) => a._id))
                            : new Set(),
                        );
                      }}
                      className="rounded"
                    />
                  </th>
                  <th>Patient</th>
                  <th>Phone</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Booked At</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {paginated.map((appt) => (
                  <tr
                    key={appt._id}
                    onClick={() => setSelected(appt)}
                    className={cn(
                      "cursor-pointer",
                      selectedRows.has(appt._id) && "bg-primary-light",
                    )}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(appt._id)}
                        onChange={() => toggleRow(appt._id)}
                        className="rounded"
                      />
                    </td>
                    <td className="font-medium text-text-primary">
                      {appt.patientName}
                    </td>
                    <td className="font-mono text-xs">{appt.phone}</td>
                    <td>{appt.service}</td>
                    <td>{formatDate(appt.date)}</td>
                    <td>{appt.time}</td>
                    <td>
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="text-xs">
                      {formatDateTime(appt.createdAt)}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button className="text-text-muted hover:text-text-primary">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ──────────────────────────────────────────── */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between text-sm text-text-muted">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-border hover:bg-surface-secondary disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from(
              { length: Math.min(5, totalPages) },
              (_, i) => i + 1,
            ).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={cn(
                  "w-8 h-8 text-xs rounded-md border transition-colors",
                  n === page
                    ? "bg-primary border-primary text-primary-on"
                    : "border-border hover:bg-surface-secondary",
                )}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-border hover:bg-surface-secondary disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Detail Drawer ─────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <DetailDrawer
            appointment={selected}
            onClose={() => setSelected(null)}
            onStatusChange={updateAppointmentStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
