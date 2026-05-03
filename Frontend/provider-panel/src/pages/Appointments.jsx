import { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, ChevronLeft, ChevronRight,
  MoreHorizontal, X, CalendarDays,
} from 'lucide-react';
import useClinicStore from '../store/useClinicStore';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { VirtualizedTable } from '../components/shared/VirtualizedTable';
import { useToast } from '../components/shared/Toast';
import { formatDate, formatTime, cn } from '../lib/utils';

const STATUSES = ['All', 'Pending', 'Confirmed', 'Cancelled'];
const VIRTUALIZATION_ROW_HEIGHT = 56; // Height of each table row in pixels

// ─── Appointment Detail Drawer ────────────────────────────────────────────────

function DetailDrawer({ appointment, onClose, onStatusChange }) {
  if (!appointment) return null;
  const toast = useToast();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const handleConfirm = () => {
    onStatusChange(appointment.id, 'Confirmed');
    toast.success(`${appointment.patient}'s appointment confirmed.`);
    onClose();
  };

  const handleCancel = () => {
    onStatusChange(appointment.id, 'Cancelled');
    toast.info(`Appointment cancelled.`);
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="appointments-drawer-root"
        className="fixed inset-0 z-[80] flex justify-end"
      >
        <motion.button
          type="button"
          aria-label="Close appointment drawer"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="absolute inset-0 bg-slate-950/50 backdrop-blur-[8px]"
        />

        <motion.aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="appointment-drawer-title"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'relative h-[100svh] w-full max-w-full bg-surface shadow-2xl shadow-slate-950/20',
            'border-l border-border/80 overflow-hidden flex flex-col',
            'md:w-[460px] md:max-w-[min(460px,calc(100vw-24px))] md:rounded-l-2xl'
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border/70 bg-surface/95 backdrop-blur-sm">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Appointment details</p>
              <h2 id="appointment-drawer-title" className="mt-1 text-h3 text-text-primary truncate">
                {appointment.patient}
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close appointment drawer"
              className="ml-4 grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-text-muted shadow-sm transition-colors duration-150 hover:border-border/80 hover:bg-surface-secondary hover:text-text-primary"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-5 sm:px-6 py-5 space-y-6">
              <div className="rounded-xl border border-border/70 bg-gradient-to-br from-surface to-surface-secondary p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={appointment.status} />
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">{appointment.service}</span>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    { label: 'Date', value: formatDate(appointment.date) },
                    { label: 'Time', value: appointment.time },
                    { label: 'Phone', value: appointment.phone },
                    { label: 'Session', value: appointment.sessionId },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-border/60 bg-surface px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold text-text-primary break-words">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-label uppercase tracking-[0.16em] text-text-muted mb-3">Summary</h4>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['Service', appointment.service],
                    ['Booked At', formatDate(appointment.bookedAt, { hour: '2-digit', minute: '2-digit' })],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-border/60 bg-surface px-4 py-3">
                      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">{label}</dt>
                      <dd className="mt-1 text-sm font-semibold text-text-primary break-words">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div>
                <h4 className="text-label uppercase tracking-[0.16em] text-text-muted mb-3">Timeline</h4>
                <div className="space-y-3 rounded-xl border border-border/70 bg-surface p-4 shadow-sm">
                  {[
                    { label: 'Booked via chatbot', time: appointment.bookedAt, done: true },
                    { label: 'Appointment scheduled', time: appointment.date, done: true },
                    { label: appointment.status === 'Confirmed' ? 'Confirmed' : appointment.status === 'Cancelled' ? 'Cancelled' : 'Awaiting confirmation', time: null, done: appointment.status !== 'Pending' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className={cn(
                          'mt-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-transparent',
                          step.done ? 'bg-success shadow-[0_0_0_4px_rgba(16,185,129,0.12)]' : 'bg-border'
                        )}
                      />
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{step.label}</p>
                        {step.time && <p className="mt-1 text-xs text-text-muted">{formatDate(step.time)}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {appointment.status === 'Pending' && (
            <div className="border-t border-border/70 bg-surface/95 px-5 sm:px-6 py-4 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleConfirm}
                  className="h-11 flex-1 rounded-lg text-sm font-semibold text-white bg-success shadow-sm shadow-success/20 transition-colors duration-150 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-success/30"
                >
                  Confirm Appointment
                </button>
                <button
                  onClick={handleCancel}
                  className="h-11 flex-1 rounded-lg text-sm font-semibold border border-danger/30 text-danger bg-danger-light/20 transition-colors duration-150 hover:bg-danger-light focus:outline-none focus:ring-2 focus:ring-danger/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.aside>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// ─── Appointments Page ────────────────────────────────────────────────────────

export default function Appointments() {
  const { appointments, updateAppointmentStatus } = useClinicStore();
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('All');
  const [selected, setSelected] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const toast = useToast();

  // Filter logic - memoized to prevent unnecessary recalculations
  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const matchStatus = status === 'All' || a.status === status;
      const matchSearch = !search || [a.patient, a.service, a.phone].some(
        (f) => f.toLowerCase().includes(search.toLowerCase())
      );
      return matchStatus && matchSearch;
    });
  }, [appointments, status, search]);

  // Calculate tab counts for display
  const tabCounts = useMemo(() => ({
    All:       appointments.length,
    Pending:   appointments.filter((a) => a.status === 'Pending').length,
    Confirmed: appointments.filter((a) => a.status === 'Confirmed').length,
    Cancelled: appointments.filter((a) => a.status === 'Cancelled').length,
  }), [appointments]);

  // Define table columns - each column maps to appointment properties
  const columns = useMemo(() => [
    {
      key: 'checkbox',
      header: '',
      type: 'checkbox',
      className: 'w-10',
      render: () => null, // Handled by VirtualizedTable
    },
    {
      key: 'patient',
      header: 'Patient',
      className: 'font-medium text-text-primary',
    },
    {
      key: 'phone',
      header: 'Phone',
      className: 'font-mono text-xs',
    },
    {
      key: 'service',
      header: 'Service',
    },
    {
      key: 'date',
      header: 'Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'time',
      header: 'Time',
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'bookedAt',
      header: 'Booked At',
      className: 'text-xs',
      render: (value) => formatDate(value),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-10',
      render: () => <MoreHorizontal size={16} />,
    },
  ], []);

  const toggleRow = (id) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkConfirm = () => {
    selectedRows.forEach((id) => updateAppointmentStatus(id, 'Confirmed'));
    toast.success(`${selectedRows.size} appointments confirmed.`);
    setSelectedRows(new Set());
  };

  // Calculate viewport height for virtual table (header + 12 rows visible)
  const tableHeight = Math.min(600, VIRTUALIZATION_ROW_HEIGHT * 12);

  return (
    <div className="space-y-4 max-w-[1400px]">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
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
              <button onClick={handleBulkConfirm}
                className="h-9 px-3 text-sm font-medium bg-success text-white rounded-md hover:opacity-90">
                Confirm {selectedRows.size}
              </button>
              <button onClick={() => {
                selectedRows.forEach((id) => updateAppointmentStatus(id, 'Cancelled'));
                setSelectedRows(new Set());
                toast.info('Selected appointments cancelled.');
              }}
                className="h-9 px-3 text-sm font-medium border border-danger text-danger rounded-md hover:bg-danger-light">
                Cancel {selectedRows.size}
              </button>
            </motion.div>
          )}
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); }}
              placeholder="Search patients..."
              className="h-9 pl-9 pr-3 w-48 text-sm border border-border rounded-md bg-surface focus:outline-none focus:border-primary"
            />
          </div>
          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); }}
            className="h-9 px-3 text-sm border border-border rounded-md bg-surface text-text-secondary focus:outline-none"
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button className="h-9 px-3 flex items-center gap-2 text-sm border border-border rounded-md hover:bg-surface-secondary text-text-secondary transition-colors">
            <Download size={15} />
            Export
          </button>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div className="flex gap-0 border-b border-border">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); }}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors duration-150 -mb-px',
              status === s
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-primary'
            )}
          >
            {s}
            {tabCounts[s] > 0 && (
              <span className={cn(
                'ml-2 px-1.5 py-0.5 text-xs rounded-full',
                status === s ? 'bg-primary text-white' : 'bg-surface-secondary text-text-muted'
              )}>
                {tabCounts[s]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Virtualized Table ────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No appointments found"
          description="Try adjusting your filters or date range."
          action={{ label: 'Clear Filters', onClick: () => { setSearch(''); setStatus('All'); } }}
        />
      ) : (
        <VirtualizedTable
          columns={columns}
          rows={filtered}
          height={tableHeight}
          itemSize={VIRTUALIZATION_ROW_HEIGHT}
          onRowClick={(row) => setSelected(row)}
          selectedRowIds={selectedRows}
          onToggleRow={toggleRow}
        />
      )}

      {/* ── Detail Drawer ──────────────────────────────────────────────────── */}
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
