/**
 * suggestionBuilder.js
 * Deterministic, token-free quick-reply generator for the chat widget.
 *
 * The chat controller calls `buildSuggestions({ intent, stage, clinic, tone })`
 * after assembling a reply. The returned array (may be empty) is sent back
 * to the widget as `response.suggestions` and rendered as tap-to-send chips
 * below the assistant bubble.
 *
 * Design principles:
 *  - Zero AI calls — pure rules, runs in < 0.5ms
 *  - Context-aware — different chips per stage of the conversation
 *  - Never more than 4 chips (keeps UI tidy and cognitive load low)
 *  - Short, natural, action-oriented copy
 *  - Safe fallback: return [] rather than guess poorly
 */

const MAX_SUGGESTIONS = 4;

/**
 * Trim, dedupe, and cap to MAX_SUGGESTIONS.
 * @param {string[]} list
 * @returns {string[]}
 */
const finalize = (list) => {
  const seen = new Set();
  const out = [];
  for (const raw of list) {
    const value = typeof raw === "string" ? raw.trim() : "";
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
    if (out.length >= MAX_SUGGESTIONS) break;
  }
  return out;
};

/**
 * Suggestions for each step inside the booking state machine.
 * @param {string} step
 * @param {object} clinic
 * @returns {string[]}
 */
const forBookingStep = (step, clinic) => {
  switch (step) {
    case "ask_date":
      return ["Today", "Tomorrow", "This weekend", "Next week"];
    case "ask_time":
      return ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"];
    case "ask_service": {
      const services = Array.isArray(clinic?.services) ? clinic.services : [];
      return services.length ? services.slice(0, MAX_SUGGESTIONS) : ["General Checkup"];
    }
    case "confirm":
      return ["Yes, confirm", "No, cancel"];
    default:
      return [];
  }
};

/**
 * Build an array of contextual quick replies for the current turn.
 *
 * @param {object}  ctx
 * @param {string}  ctx.intent      — 'booking' | 'symptom' | 'general' | 'booking-started' | 'booking-done'
 * @param {string}  [ctx.stage]     — booking state machine step name, when relevant
 * @param {object}  [ctx.clinic]    — clinic record (for service names, phone, etc.)
 * @param {string}  [ctx.tone]      — 'normal' | 'urgent' | 'anxious' | 'frustrated'
 * @returns {string[]}
 */
const buildSuggestions = ({ intent, stage, clinic = {}, tone = "normal" } = {}) => {
  // Urgent tone: never offer casual follow-ups.
  if (tone === "urgent") return finalize(["Call now", "Directions to clinic"]);

  switch (intent) {
    case "booking-started":
      // The very first prompt after detecting booking intent.
      return finalize(["Today", "Tomorrow", "This weekend"]);

    case "booking-step":
      return finalize(forBookingStep(stage, clinic));

    case "booking-done":
      return finalize([
        "Book another appointment",
        "Working hours",
        "Clinic location",
      ]);

    case "symptom":
      return finalize([
        "Book an appointment",
        "Is this urgent?",
        clinic?.phone ? `Call ${clinic.phone}` : "Call the clinic",
      ]);

    case "general":
    default:
      return finalize([
        "Book an appointment",
        "Working hours",
        "Services offered",
        "Contact info",
      ]);
  }
};

module.exports = { buildSuggestions, MAX_SUGGESTIONS };
