const asyncHandler = require("../utils/asyncHandler");
const { callAI } = require("../utils/geminiClient");
const { buildSystemPrompt } = require("../utils/promptBuilder");
const redis = require("../service/redisClient");
const {
  detectBookingIntent,
  detectSymptomIntent,
  detectTone,
} = require("../utils/intentDetector");
const {
  initSession,
  isInBookingFlow,
  handleBookingStep,
} = require("../utils/bookingStateMachine");

const RATE_LIMIT = 20; // max messages per minute per session
const RATE_LIMIT_TTL = 60; // seconds

// ─────────────────────────────────────────────────────────────
// POST /api/chat
// ─────────────────────────────────────────────────────────────
exports.chat = asyncHandler(async (req, res) => {
  const { message, sessionId, history = [] } = req.body;
  const clinic = req.clinic;
  const user_id = req.user_id;

  if (!message?.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Message is required" });
  }
  if (!sessionId) {
    return res
      .status(400)
      .json({ success: false, message: "sessionId is required" });
  }

  // ── Rate limiting — stop spam ──────────────────────────────
  try {
    const rateLimitKey = `ratelimit:${sessionId}`;
    const requests = await redis.incr(rateLimitKey);
    if (requests === 1) await redis.expire(rateLimitKey, RATE_LIMIT_TTL);

    if (requests > RATE_LIMIT) {
      return res.status(429).json({
        success: false,
        message:
          "Too many messages. Please slow down and try again in a minute.",
      });
    }
  } catch {
    // Redis rate limit failed — don't block the user, just continue
    console.warn("Rate limit check failed — continuing without it");
  }

  // ── Step 1: Already in booking flow ───────────────────────
  const inBooking = await isInBookingFlow(sessionId);
  if (inBooking) {
    const result = await handleBookingStep(sessionId, message, clinic);

    if (result.done && result.appointmentData) {
      await saveAppointment(
        req.headers["x-api-key"],
        user_id,
        sessionId,
        result.appointmentData,
      );
    }

    return res.json({ success: true, reply: result.reply });
  }

  // ── Step 2: Booking intent ─────────────────────────────────
  if (detectBookingIntent(message)) {
    await initSession(sessionId);
    return res.json({
      success: true,
      reply: `I'd be happy to help you book an appointment! May I have your full name please?`,
    });
  }

  // ── Step 3: Symptom + tone detection ──────────────────────
  const isSymptom = detectSymptomIntent(message);
  const tone = detectTone(message);

  // ── Step 4: Fetch FAQs from FAQ service ───────────────────
  let faqs = [];
  try {
    const faqRes = await fetch(
      `${process.env.FAQ_SERVICE_URL}/api/faqs/active`,
      { headers: { "x-api-key": req.headers["x-api-key"] } },
    );
    if (faqRes.ok) {
      const faqData = await faqRes.json();
      faqs = faqData.data || [];
    }
  } catch {
    console.warn("FAQ service unavailable — continuing without FAQs");
  }

  // ── Step 5: Build prompt ───────────────────────────────────
  let systemPrompt = buildSystemPrompt(clinic, faqs);

  const toneInstructions = {
    urgent:
      "\n\nCRITICAL: Patient may be in distress. Respond calmly and fast. If life-threatening, tell them to call 112 immediately.",
    anxious:
      "\n\nIMPORTANT: Patient sounds nervous. Acknowledge their worry with warmth FIRST before anything else.",
    frustrated:
      "\n\nIMPORTANT: Patient is frustrated. Apologize sincerely first, then help.",
    normal: "",
  };
  systemPrompt += toneInstructions[tone] || "";

  if (isSymptom) {
    systemPrompt += `

CURRENT TURN: Patient is describing a health problem or symptoms.
Follow the 4-step symptom analysis flow:
1. Acknowledge with empathy
2. Suggest what it might be (carefully, not as diagnosis)
3. Recommend the right specialist from our available services
4. Check if that specialist is available at our clinic and offer booking if yes`;
  }

  // ── Step 6: Call AI ────────────────────────────────────────
  const recentHistory = [
    ...history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: message },
  ];

  let aiReply;
  try {
    aiReply = await callAI(systemPrompt, recentHistory);
  } catch (err) {
    console.error("AI error:", err.message);
    aiReply = `I'm having a little trouble right now. Please call us at ${clinic.phone || "our clinic"} for immediate assistance.`;
  }

  return res.json({ success: true, reply: aiReply });
});

// ─────────────────────────────────────────────────────────────
// GET /api/chat/clinic-info
// ─────────────────────────────────────────────────────────────
exports.getClinicInfo = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      clinicName: req.clinic.clinicName,
      welcomeMsg: req.clinic.welcomeMsg,
      phone: req.clinic.phone,
      workingHrs: req.clinic.workingHrs,
      services: req.clinic.services,
    },
  });
});

// ─────────────────────────────────────────────────────────────
// Helper — save confirmed appointment
// ─────────────────────────────────────────────────────────────
const saveAppointment = async (apiKey, user_id, sessionId, data) => {
  try {
    const response = await fetch(
      `${process.env.APPOINTMENT_SERVICE_URL}/api/appointments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ ...data, sessionId, user_id }),
      },
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Appointment save failed:", response.status, err);
      return;
    }

    const result = await response.json();
    console.log("✅ Appointment saved:", result.data?._id);
  } catch (err) {
    console.error("Failed to save appointment:", err.message);
  }
};
