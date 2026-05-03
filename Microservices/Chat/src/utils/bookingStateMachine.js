// In-memory booking sessions — fine for hackathon
// Key: sessionId, Value: { step, data }
const bookingSessions = new Map();

const STEPS = ["ask_name", "ask_date", "ask_time", "ask_service", "confirm"];

const AVAILABLE_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM",
];

const initSession = (sessionId) => {
  bookingSessions.set(sessionId, { step: "ask_name", data: {} });
};

const getSession = (sessionId) => bookingSessions.get(sessionId);

const clearSession = (sessionId) => bookingSessions.delete(sessionId);

const isInBookingFlow = (sessionId) => bookingSessions.has(sessionId);

// Returns { reply, done, appointmentData }
const handleBookingStep = (sessionId, userMessage, clinic) => {
  let session = bookingSessions.get(sessionId);

  if (!session) {
    session = { step: "ask_name", data: {} };
    bookingSessions.set(sessionId, session);
  }

  const msg = userMessage.trim();

  switch (session.step) {
    case "ask_name":
      session.data.patientName = msg;
      session.step = "ask_date";
      bookingSessions.set(sessionId, session);
      return {
        reply: `Nice to meet you, ${msg}! What date would you prefer for your appointment? (e.g., May 5)`,
        done: false,
      };

    case "ask_date":
      session.data.date = msg;
      session.step = "ask_time";
      bookingSessions.set(sessionId, session);
      return {
        reply: `Got it! We have the following slots available: ${AVAILABLE_SLOTS.join(", ")}. Which time works best for you?`,
        done: false,
      };

    case "ask_time":
      // Validate time slot
      const validSlot = AVAILABLE_SLOTS.find(
        (s) => s.toLowerCase() === msg.toLowerCase() || msg.includes(s.replace(":00", ""))
      );
      if (!validSlot) {
        return {
          reply: `Sorry, that slot isn't available. Please choose from: ${AVAILABLE_SLOTS.join(", ")}`,
          done: false,
        };
      }
      session.data.time = validSlot;
      session.step = "ask_service";
      bookingSessions.set(sessionId, session);
      return {
        reply: `Perfect! Which service do you need? We offer: ${clinic.services?.join(", ") || "General Checkup"}`,
        done: false,
      };

    case "ask_service":
      session.data.service = msg;
      session.step = "confirm";
      bookingSessions.set(sessionId, session);
      const d = session.data;
      return {
        reply: `Just to confirm — ${d.patientName}, ${d.service} on ${d.date} at ${d.time}. Shall I go ahead and book this? (Yes / No)`,
        done: false,
      };

    case "confirm":
      if (msg.toLowerCase().includes("yes") || msg.toLowerCase().includes("confirm") || msg.toLowerCase().includes("ok")) {
        const appointmentData = { ...session.data };
        clearSession(sessionId);
        return {
          reply: `Your appointment is confirmed! ✅ We look forward to seeing you, ${appointmentData.patientName}. Is there anything else I can help you with?`,
          done: true,
          appointmentData,
        };
      } else {
        clearSession(sessionId);
        return {
          reply: `No problem at all! Your booking has been cancelled. Feel free to book again anytime. Is there anything else I can help you with?`,
          done: true,
          appointmentData: null,
        };
      }

    default:
      clearSession(sessionId);
      return { reply: "Let me start over. What's your name?", done: false };
  }
};

module.exports = {
  initSession,
  getSession,
  clearSession,
  isInBookingFlow,
  handleBookingStep,
};