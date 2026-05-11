const redis = require("../service/redisClient");

const AVAILABLE_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM",
];

const SESSION_TTL = 60 * 30; // 30 minutes

const sessionKey  = (id) => `booking:${id}`;

/**
 * Normalizes a date string into YYYY-MM-DD.
 * Handles "today", "tomorrow", and standard date formats.
 */
const normalizeDate = (input) => {
  const now = new Date();
  const lower = input.toLowerCase().trim();

  let targetDate = new Date();

  if (lower === "today") {
    targetDate = now;
  } else if (lower === "tomorrow") {
    targetDate.setDate(now.getDate() + 1);
  } else if (lower === "this weekend") {
    // Sunday of this week (or next if it's already Sunday)
    const day = now.getDay();
    const diff = (day === 0 ? 0 : 7 - day);
    targetDate.setDate(now.getDate() + diff);
  } else if (lower === "next week") {
    targetDate.setDate(now.getDate() + 7);
  } else {
    // Try to parse as a regular date
    const parsed = new Date(input);
    if (!isNaN(parsed.getTime())) {
      // If no year was provided (e.g. "May 5"), it defaults to current year
      // but ensure it's not in the past if possible (optional logic)
      targetDate = parsed;
    } else {
      // Fallback: return as-is if we can't parse it (or return null to force retry)
      return input; 
    }
  }

  return targetDate.toISOString().split("T")[0];
};

const initSession = async (sessionId) => {
  await redis.setex(
    sessionKey(sessionId),
    SESSION_TTL,
    JSON.stringify({ step: "ask_name", data: {} })
  );
};

const getSession = async (sessionId) => {
  const raw = await redis.get(sessionKey(sessionId));
  return raw ? JSON.parse(raw) : null;
};

const saveSession = async (sessionId, session) => {
  await redis.setex(sessionKey(sessionId), SESSION_TTL, JSON.stringify(session));
};

const clearSession = async (sessionId) => {
  await redis.del(sessionKey(sessionId));
};

const isInBookingFlow = async (sessionId) => {
  const exists = await redis.exists(sessionKey(sessionId));
  return exists === 1;
};

const handleBookingStep = async (sessionId, userMessage, clinic) => {
  let session = await getSession(sessionId);
  if (!session) session = { step: "ask_name", data: {} };

  const msg = userMessage.trim();

  switch (session.step) {
    case "ask_name":
      session.data.patientName = msg;
      session.step = "ask_phone";
      await saveSession(sessionId, session);
      return {
        reply: `Nice to meet you, ${msg}! May I have your mobile number please?`,
        done: false,
      };

    case "ask_phone":
      // Basic phone validation (at least 10 digits)
      const phoneClean = msg.replace(/\D/g, "");
      if (phoneClean.length < 10) {
        return {
          reply: `Please provide a valid 10-digit mobile number so we can reach you.`,
          done: false,
        };
      }
      session.data.phone = msg;
      session.step = "ask_date";
      await saveSession(sessionId, session);
      return {
        reply: `Thank you! What date would you prefer for your appointment? (e.g., May 5)`,
        done: false,
      };

    case "ask_date":
      const normalized = normalizeDate(msg);
      // Check if it's a valid YYYY-MM-DD string
      if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
        return {
          reply: `I'm sorry, I didn't quite catch that date. Could you please specify it more clearly? (e.g., "Tomorrow", "May 15", or "2026-05-20")`,
          done: false,
        };
      }
      session.data.date = normalized;
      session.step = "ask_time";
      await saveSession(sessionId, session);
      return {
        reply: `Got it! Available slots: ${AVAILABLE_SLOTS.join(", ")}. Which works for you?`,
        done: false,
      };

    case "ask_time":
      const validSlot = AVAILABLE_SLOTS.find(
        (s) => s.toLowerCase() === msg.toLowerCase() || msg.includes(s.replace(":00", ""))
      );
      if (!validSlot) {
        return {
          reply: `Sorry, that slot isn't available. Choose from: ${AVAILABLE_SLOTS.join(", ")}`,
          done: false,
        };
      }
      session.data.time = validSlot;
      session.step = "ask_service";
      await saveSession(sessionId, session);
      return {
        reply: `Perfect! Which service do you need? We offer: ${clinic.services?.join(", ") || "General Checkup"}`,
        done: false,
      };

    case "ask_service":
      session.data.service = msg;
      session.step = "confirm";
      await saveSession(sessionId, session);
      const d = session.data;
      return {
        reply: `To confirm — ${d.patientName} (${d.phone}), ${d.service} on ${d.date} at ${d.time}. Shall I book this? (Yes / No)`,
        done: false,
      };

    case "confirm":
      if (["yes", "confirm", "ok"].some((w) => msg.toLowerCase().includes(w))) {
        const appointmentData = { ...session.data };
        await clearSession(sessionId);
        return {
          reply: `Confirmed! ✅ We look forward to seeing you, ${appointmentData.patientName}. Anything else I can help with?`,
          done: true,
          appointmentData,
        };
      } else {
        await clearSession(sessionId);
        return {
          reply: `No problem! Booking cancelled. Feel free to book again anytime.`,
          done: true,
          appointmentData: null,
        };
      }

    default:
      await clearSession(sessionId);
      return { reply: "Let me start over. What's your name?", done: false };
  }
};

module.exports = { initSession, getSession, clearSession, isInBookingFlow, handleBookingStep };