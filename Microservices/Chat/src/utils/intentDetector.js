// Booking keywords
const BOOKING_KEYWORDS = [
  "book", "appointment", "schedule", "visit", "slot",
  "reserve", "fix", "consultation", "checkup", "check-up",
  "meet", "see the doctor", "see doctor", "available",
];

// Symptom/problem keywords — patient describing health issue
const SYMPTOM_KEYWORDS = [
  "pain", "ache", "fever", "cold", "cough", "rash", "bleeding",
  "swelling", "dizzy", "nausea", "vomit", "tired", "fatigue",
  "headache", "breathless", "chest", "stomach", "back", "knee",
  "throat", "ear", "eye", "skin", "tooth", "pregnant", "period",
  "anxiety", "stress", "depression", "child", "baby", "hurt",
  "problem", "issue", "suffering", "feeling", "not feeling well",
  "unwell", "sick", "ill", "disease", "infection", "injury",
  "burning", "itching", "numbness", "weakness", "loss of",
];

// Tone keywords
const URGENT_KEYWORDS = [
  "emergency", "urgent", "severe pain", "bleeding", "can't breathe",
  "chest pain", "unconscious", "accident", "attack",
];

const ANXIOUS_KEYWORDS = [
  "worried", "scared", "nervous", "afraid", "anxious",
  "not sure", "confused", "concerned", "frightened",
];

const FRUSTRATED_KEYWORDS = [
  "waiting", "still not", "again", "useless", "ridiculous",
  "terrible", "worst", "horrible", "unacceptable",
];

const detectBookingIntent = (message) => {
  const lower = message.toLowerCase();
  return BOOKING_KEYWORDS.some((kw) => lower.includes(kw));
};

// New — detect if patient is describing symptoms
const detectSymptomIntent = (message) => {
  const lower = message.toLowerCase();
  return SYMPTOM_KEYWORDS.some((kw) => lower.includes(kw));
};

const detectTone = (message) => {
  const lower = message.toLowerCase();
  if (URGENT_KEYWORDS.some((kw) => lower.includes(kw)))     return "urgent";
  if (ANXIOUS_KEYWORDS.some((kw) => lower.includes(kw)))    return "anxious";
  if (FRUSTRATED_KEYWORDS.some((kw) => lower.includes(kw))) return "frustrated";
  return "normal";
};

module.exports = { detectBookingIntent, detectSymptomIntent, detectTone };