/**
 * chatLogsData.js
 * Extended mock data for the Chat Logs page.
 * Provides richer session metadata: sentiment, duration, source, tags, intents.
 */

const now = Date.now();
const H = 3600000;
const M = 60000;

/** Generate a realistic multi-turn transcript */
function makeTranscript(type, offset) {
  const base = now - offset;
  switch (type) {
    case 'booked':
      return [
        { role: 'user', text: 'Hi, I need to book an appointment for a general checkup', time: new Date(base).toISOString() },
        { role: 'ai',   text: "Hello! I'd be happy to help you book an appointment. What date works best for you?", time: new Date(base + 30 * M).toISOString() },
        { role: 'user', text: 'How about next Monday?', time: new Date(base + 1 * M).toISOString() },
        { role: 'ai',   text: 'Great! We have availability on Monday, May 5th. Would 10:30 AM or 2:00 PM work for you?', time: new Date(base + 1.5 * M).toISOString() },
        { role: 'user', text: '10:30 AM sounds good', time: new Date(base + 2 * M).toISOString() },
        { role: 'ai',   text: "Perfect! Could I get your name and phone number to confirm the booking?", time: new Date(base + 2.5 * M).toISOString() },
        { role: 'user', text: 'Sarah Johnson, +1 555-0101', time: new Date(base + 3 * M).toISOString() },
        { role: 'ai',   text: "Your appointment is confirmed! You'll receive a confirmation text shortly. See you Monday at 10:30 AM! 🎉", time: new Date(base + 3.5 * M).toISOString() },
        { role: 'system', text: 'Appointment booked: General Checkup — May 5, 10:30 AM', time: new Date(base + 3.6 * M).toISOString() },
      ];
    case 'cancel':
      return [
        { role: 'user', text: 'I want to cancel my appointment', time: new Date(base).toISOString() },
        { role: 'ai',   text: "I'm sorry to hear that! Can I get your name or appointment reference number?", time: new Date(base + 0.5 * M).toISOString() },
        { role: 'user', text: 'James Wilson, appointment was for tomorrow at 3 PM', time: new Date(base + 1 * M).toISOString() },
        { role: 'ai',   text: "Found it! Your appointment for Physical Therapy on May 1st at 3:00 PM has been cancelled. Would you like to reschedule?", time: new Date(base + 1.5 * M).toISOString() },
        { role: 'user', text: "No, that's fine for now. Thanks", time: new Date(base + 2 * M).toISOString() },
        { role: 'ai',   text: "No problem! Your cancellation is confirmed. Feel free to book again anytime. Take care! 👋", time: new Date(base + 2.5 * M).toISOString() },
        { role: 'system', text: 'Appointment cancelled: Physical Therapy — May 1, 3:00 PM', time: new Date(base + 2.6 * M).toISOString() },
      ];
    case 'faq':
      return [
        { role: 'user', text: 'What are your opening hours?', time: new Date(base).toISOString() },
        { role: 'ai',   text: "We're open Monday–Friday from 9:00 AM to 5:00 PM, and Saturday from 9:00 AM to 1:00 PM. We're closed on Sundays and public holidays.", time: new Date(base + 0.3 * M).toISOString() },
        { role: 'user', text: 'Do you offer telehealth?', time: new Date(base + 1 * M).toISOString() },
        { role: 'ai',   text: "Yes! We offer telehealth video consultations for many appointment types. Just request it when booking.", time: new Date(base + 1.3 * M).toISOString() },
        { role: 'user', text: 'Which insurance do you accept?', time: new Date(base + 2 * M).toISOString() },
        { role: 'ai',   text: "We accept Blue Cross, Aetna, UnitedHealth, Cigna, and Medicare. Contact us to verify your specific plan.", time: new Date(base + 2.3 * M).toISOString() },
        { role: 'user', text: 'Great, thanks!', time: new Date(base + 3 * M).toISOString() },
        { role: 'ai',   text: "Happy to help! Let us know if you have any other questions. 😊", time: new Date(base + 3.2 * M).toISOString() },
      ];
    case 'unresolved':
      return [
        { role: 'user', text: "Do you accept walk-ins?", time: new Date(base).toISOString() },
        { role: 'ai',   text: "We do accept walk-ins, but appointments are recommended to minimize wait times.", time: new Date(base + 0.5 * M).toISOString() },
        { role: 'user', text: 'Do you have a specialist for rheumatology?', time: new Date(base + 1 * M).toISOString() },
        { role: 'ai',   text: "I'm not able to confirm specialist availability at this time. I'd recommend calling our front desk for the most up-to-date information.", time: new Date(base + 1.5 * M).toISOString() },
        { role: 'user', text: "What's the number?", time: new Date(base + 2 * M).toISOString() },
        { role: 'ai',   text: "You can reach us at +1 (415) 555-0182 during business hours. We'll be happy to assist!", time: new Date(base + 2.5 * M).toISOString() },
        { role: 'system', text: 'Session ended without resolution — specialist query escalated', time: new Date(base + 2.6 * M).toISOString() },
      ];
    default:
      return [
        { role: 'user', text: 'Hello', time: new Date(base).toISOString() },
        { role: 'ai',   text: "Hi there! How can I assist you today?", time: new Date(base + 0.3 * M).toISOString() },
      ];
  }
}

const SESSION_TYPES = ['booked', 'faq', 'unresolved', 'booked', 'cancel', 'booked', 'faq', 'unresolved'];
const OUTCOMES     = ['Booked', 'FAQ Only', 'Unresolved', 'Booked', 'Booked', 'Booked', 'FAQ Only', 'Unresolved'];
const SENTIMENTS   = ['positive', 'neutral', 'negative', 'positive', 'positive', 'positive', 'neutral', 'neutral'];
const SOURCES      = ['Web Widget', 'Web Widget', 'Mobile App', 'Web Widget', 'Embed', 'Web Widget', 'Mobile App', 'Embed'];
const PREVIEW_MAP  = {
  booked:     'Hi, I need to book an appointment',
  faq:        'What are your opening hours?',
  unresolved: 'Do you accept walk-ins?',
  cancel:     'I want to cancel my appointment',
};
const INTENTS_MAP  = {
  booked:     ['booking', 'appointment', 'schedule'],
  faq:        ['hours', 'insurance', 'telehealth'],
  unresolved: ['walk-in', 'specialist', 'escalated'],
  cancel:     ['cancellation', 'reschedule'],
};

export const RICH_CHAT_SESSIONS = Array.from({ length: 24 }, (_, i) => {
  const typeKey  = SESSION_TYPES[i % SESSION_TYPES.length];
  const offset   = i * 2.5 * H + Math.floor(Math.random() * 30) * M;
  const transcript = makeTranscript(typeKey, offset);
  const duration   = Math.round((transcript.length - 1) * 1.8 + Math.random() * 4); // minutes

  return {
    id:         `sess-${(0xA1B + i).toString(16).toUpperCase()}`,
    preview:    PREVIEW_MAP[typeKey],
    date:       new Date(now - offset).toISOString(),
    messages:   transcript.filter(m => m.role !== 'system').length,
    outcome:    OUTCOMES[i % OUTCOMES.length],
    transcript,
    sentiment:  SENTIMENTS[i % SENTIMENTS.length],
    source:     SOURCES[i % SOURCES.length],
    duration,                        // minutes
    intents:    INTENTS_MAP[typeKey],
    starred:    i === 0 || i === 4,  // pre-star a couple
    flagged:    i === 2,             // pre-flag one
    responseTimeAvg: Math.round(15 + Math.random() * 45), // seconds
  };
});

/** Aggregate stats derived from sessions */
export function computeLogStats(sessions) {
  const total     = sessions.length;
  const booked    = sessions.filter(s => s.outcome === 'Booked').length;
  const faqOnly   = sessions.filter(s => s.outcome === 'FAQ Only').length;
  const unresolved = sessions.filter(s => s.outcome === 'Unresolved').length;
  const resolution = total > 0 ? Math.round(((total - unresolved) / total) * 100) : 0;
  const avgMsgs   = total > 0 ? (sessions.reduce((a, s) => a + s.messages, 0) / total).toFixed(1) : 0;
  const avgDur    = total > 0 ? (sessions.reduce((a, s) => a + s.duration, 0) / total).toFixed(1) : 0;
  const positivePct = total > 0 ? Math.round((sessions.filter(s => s.sentiment === 'positive').length / total) * 100) : 0;
  return { total, booked, faqOnly, unresolved, resolution, avgMsgs, avgDur, positivePct };
}
