/**
 * Shared defaults and empty stubs for the provider portal.
 * All live data must come from API calls — no mock values here.
 */
import { createDefaultWorkingHoursConfig } from './workingHours';

// ─── Appointments ─────────────────────────────────────────────────────────────

export const MOCK_APPOINTMENTS = [];

// ─── Chart Data ───────────────────────────────────────────────────────────────

export function generateAreaChartData() {
  return [];
}

export const PIE_DATA = [];

export const RESOLUTION_DATA = [];

export const HEATMAP_DATA = [];

// ─── Chat Sessions ────────────────────────────────────────────────────────────

export const MOCK_CHAT_SESSIONS = [];

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export const MOCK_FAQS = [];

// ─── API Logs ─────────────────────────────────────────────────────────────────

export const MOCK_API_LOGS = [];

// ─── Allowed Origins ──────────────────────────────────────────────────────────

export const MOCK_ORIGINS = [];

// ─── Working Hours Defaults ───────────────────────────────────────────────────

export const DEFAULT_WORKING_HOURS_CONFIG = createDefaultWorkingHoursConfig();

// Legacy fallback shape (kept for compatibility with older UI/state)
export const DEFAULT_WORKING_HOURS = DEFAULT_WORKING_HOURS_CONFIG.weekly.map((row) => {
  const firstSlot = row.slots[0] ?? { start: '09:00', end: '17:00' };
  return {
    day: row.day,
    open: row.enabled,
    from: firstSlot.start,
    to: firstSlot.end,
  };
});

// ─── Services ─────────────────────────────────────────────────────────────────

export const DEFAULT_SERVICES = [
  'General Checkup',
  'Dental Cleaning',
  'Eye Exam',
  'Blood Work',
  'Physical Therapy',
  'Vaccination',
  'Pediatrics',
];

// ─── Widget Defaults ──────────────────────────────────────────────────────────

export const DEFAULT_WIDGET_SETTINGS = {
  botName:          'AI Assistant',
  welcomeMessage:   'Hello! I\'m your AI receptionist. How can I help you today?',
  placeholderText:  'Type your question...',
  color:            '#1A56DB',
  position:         'bottom-right',
  autoOpen:         false,
  autoOpenDelay:    3,
  showTyping:       true,
  collectName:      true,
  voiceInput:       false,
  voiceOutput:      false,
  showBranding:     true,
  showAvailability: true,
  offlineMessage:   'We\'re currently closed. Please leave a message and we\'ll get back to you shortly.',
};

// Curated brand colors for the widget color picker
export const PRESET_COLORS = [
  '#1A56DB', '#0E9F6E', '#7C3AED', '#E02424',
  '#C27803', '#0891B2', '#BE185D', '#1E293B',
];
