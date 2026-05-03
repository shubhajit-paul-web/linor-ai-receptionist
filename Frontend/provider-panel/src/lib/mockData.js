/**
 * Mock data for development and demo.
 * In production, replace these with actual API calls.
 * All data shapes here define the contract between UI and backend.
 */
import { createDefaultWorkingHoursConfig } from './workingHours';

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export const MOCK_APPOINTMENTS = Array.from({ length: 28 }, (_, i) => ({
  id: `appt-${i + 1}`,
  patient:   ['Sarah Johnson', 'Michael Chen', 'Emma Davis', 'James Wilson', 'Olivia Martinez', 'Liam Anderson', 'Noah Thompson', 'Ava Garcia'][i % 8],
  phone:     `+1 (555) ${String(100 + i * 7).padStart(3, '0')}-${String(1000 + i * 13).padStart(4, '0')}`,
  service:   ['General Checkup', 'Dental Cleaning', 'Eye Exam', 'Blood Work', 'Physical Therapy', 'Vaccination'][i % 6],
  date:      new Date(Date.now() + (i - 10) * 86400000).toISOString(),
  time:      ['09:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '03:30 PM', '04:00 PM'][i % 6],
  status:    ['Pending', 'Confirmed', 'Confirmed', 'Cancelled', 'Pending', 'Confirmed'][i % 6],
  bookedAt:  new Date(Date.now() - (i + 1) * 3600000 * 2).toISOString(),
  sessionId: `sess-${(100 + i).toString(16)}`,
}));

// ─── Chart Data ───────────────────────────────────────────────────────────────

const today = new Date();

export function generateAreaChartData(days, seed = 42) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      date:         d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      appointments: Math.floor(seededRandom(seed + i * 1) * 18) + 2,
      sessions:     Math.floor(seededRandom(seed + i * 2) * 30) + 5,
    };
  });
}

export const PIE_DATA = [
  { name: 'General Checkup',    value: 48, color: '#1A56DB' },
  { name: 'Dental Cleaning',    value: 32, color: '#0E9F6E' },
  { name: 'Eye Exam',           value: 24, color: '#7C3AED' },
  { name: 'Blood Work',         value: 18, color: '#C27803' },
  { name: 'Physical Therapy',   value: 16, color: '#E02424' },
  { name: 'Other',              value: 10, color: '#8A96A8' },
];

export const RESOLUTION_DATA = Array.from({ length: 14 }, (_, i) => ({
  date: new Date(today.getTime() - (13 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  rate: Math.min(100, 78 + Math.floor(Math.random() * 15)),
}));

// Hour-of-day × day-of-week interaction heatmap
export const HEATMAP_DATA = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => ({
    day,
    hour,
    // Weight towards business hours
    value: (hour >= 8 && hour <= 18 && day < 5)
      ? Math.floor(Math.random() * 20) + 3
      : Math.floor(Math.random() * 5),
  }))
);

// ─── Chat Sessions ────────────────────────────────────────────────────────────

export const MOCK_CHAT_SESSIONS = Array.from({ length: 20 }, (_, i) => ({
  id:        `sess-${(0xA1B + i).toString(16).toUpperCase()}`,
  preview:   ['Hi, I need to book an appointment', 'What are your opening hours?', 'Do you accept walk-ins?', 'I want to cancel my appointment'][i % 4],
  date:      new Date(Date.now() - i * 7200000).toISOString(),
  messages:  Math.floor(Math.random() * 12) + 3,
  outcome:   ['Booked', 'FAQ Only', 'Unresolved', 'Booked'][i % 4],
  transcript: [
    { role: 'user', text: 'Hi, I need to book an appointment for a general checkup', time: new Date(Date.now() - i * 7200000).toISOString() },
    { role: 'ai',   text: 'Hello! I\'d be happy to help you book an appointment. What date works best for you?', time: new Date(Date.now() - i * 7200000 + 30000).toISOString() },
    { role: 'user', text: 'How about next Monday?', time: new Date(Date.now() - i * 7200000 + 60000).toISOString() },
    { role: 'ai',   text: 'Great! We have availability on Monday, May 5th. Would 10:30 AM or 2:00 PM work for you?', time: new Date(Date.now() - i * 7200000 + 90000).toISOString() },
    { role: 'user', text: '10:30 AM sounds good', time: new Date(Date.now() - i * 7200000 + 120000).toISOString() },
    { role: 'ai',   text: 'Perfect! Could I get your name and phone number to confirm the booking?', time: new Date(Date.now() - i * 7200000 + 150000).toISOString() },
    { role: 'system', text: 'Appointment booked: General Checkup — May 5, 10:30 AM', time: new Date(Date.now() - i * 7200000 + 200000).toISOString() },
  ],
}));

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export const MOCK_FAQS = [
  { id: 'faq-1', question: 'What are your clinic opening hours?', answer: 'We are open Monday to Friday from 9:00 AM to 5:00 PM, and Saturday from 9:00 AM to 1:00 PM. We are closed on Sundays and public holidays.', hits: 142 },
  { id: 'faq-2', question: 'Do you accept walk-in patients?', answer: 'We welcome walk-in patients, but appointments are recommended to minimize waiting times. You can book online through our website or by calling us.', hits: 98 },
  { id: 'faq-3', question: 'Which insurance plans do you accept?', answer: 'We accept most major insurance plans including Blue Cross, Aetna, UnitedHealth, Cigna, and Medicare. Please contact us to verify your specific plan.', hits: 87 },
  { id: 'faq-4', question: 'How do I cancel or reschedule my appointment?', answer: 'You can cancel or reschedule by contacting us at least 24 hours in advance. You can call us, send a message via our website, or ask our AI assistant.', hits: 76 },
  { id: 'faq-5', question: 'What should I bring to my first appointment?', answer: 'Please bring a valid photo ID, your insurance card, a list of current medications, and any relevant medical records or referral letters.', hits: 65 },
  { id: 'faq-6', question: 'Do you offer telehealth consultations?', answer: 'Yes! We offer telehealth video consultations for many types of appointments. Please request this when booking and ensure you have a stable internet connection.', hits: 54 },
];

// ─── API Logs ─────────────────────────────────────────────────────────────────

export const MOCK_API_LOGS = Array.from({ length: 20 }, (_, i) => ({
  id:        `log-${i}`,
  endpoint:  ['/api/chat', '/api/appointments', '/api/faqs', '/api/widget'][i % 4],
  method:    ['POST', 'GET', 'GET', 'GET'][i % 4],
  status:    i === 3 ? 401 : i === 7 ? 500 : 200,
  timestamp: new Date(Date.now() - i * 900000).toISOString(),
  ip:        `203.0.113.${(i * 7) % 256}`,
}));

// ─── Allowed Origins ──────────────────────────────────────────────────────────

export const MOCK_ORIGINS = [
  'https://healthfirstclinic.com',
  'https://staging.healthfirstclinic.com',
];

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
  botName:          'HealthFirst Assistant',
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
