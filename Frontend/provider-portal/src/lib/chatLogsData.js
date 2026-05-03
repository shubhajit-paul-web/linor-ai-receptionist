/**
 * chatLogsData.js
 * Chat session data helpers for the Chat Logs page.
 * Live session data must come from API calls.
 */

export const RICH_CHAT_SESSIONS = [];

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
