const asyncHandler = require("../utils/asyncHandler");
const { callAI } = require("../utils/geminiClient");
const { buildSystemPrompt } = require("../utils/promptBuilder");
const { queryKnowledge } = require("../service/vectorService");
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

const RATE_LIMIT = 20;
const RATE_LIMIT_TTL = 60;

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

  // ── Rate limiting ──────────────────────────────────────────
  try {
    const rateLimitKey = `ratelimit:${sessionId}`;
    const requests = await redis.incr(rateLimitKey);
    if (requests === 1) await redis.expire(rateLimitKey, RATE_LIMIT_TTL);
    if (requests > RATE_LIMIT) {
      return res.status(429).json({
        success: false,
        message: "Too many messages. Please slow down.",
      });
    }
  } catch {
    console.warn("Rate limit check failed — continuing");
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

  // ── Step 3: Detect symptom + tone ─────────────────────────
  const isSymptom = detectSymptomIntent(message);
  const tone = detectTone(message);

  // ── Step 4: RAG — query Pinecone if symptom detected ──────
  let ragContext = [];
  if (isSymptom) {
    try {
      const results = await queryKnowledge({
        text: message,
        topK: 3,
      });

      // Extract metadata from Pinecone results
      ragContext = results.map((r) => ({
        text: r.fields?.text || "",
        condition: r.fields?.condition || "",
        specialist: r.fields?.specialist || "",
        urgency: r.fields?.urgency || "MEDIUM",
        followupQuestions: r.fields?.followupQuestions || "",
        advice: r.fields?.advice || "",
        score: r._score || 0,
      }));

      console.log(`🔍 RAG found ${ragContext.length} relevant medical chunks`);
      if (ragContext[0]) {
        console.log(
          `Top match: ${ragContext[0].condition} (score: ${ragContext[0].score?.toFixed(3)})`,
        );
      }
    } catch (err) {
      console.warn(
        "Pinecone query failed — continuing without RAG:",
        err.message,
      );
    }
  }

  // ── Step 5: Fetch FAQs ─────────────────────────────────────
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
    console.warn("FAQ service unavailable");
  }

  // ── Step 6: Build prompt with RAG context ─────────────────
  let systemPrompt = buildSystemPrompt(clinic, faqs, ragContext);

  // Tone injection
  const toneInstructions = {
    urgent:
      "\n\nCRITICAL: Patient may be in distress. If life-threatening, tell them to call 112 immediately.",
    anxious:
      "\n\nIMPORTANT: Patient sounds nervous. Acknowledge their worry with warmth FIRST.",
    frustrated:
      "\n\nIMPORTANT: Patient is frustrated. Apologize sincerely first, then help.",
    normal: "",
  };
  systemPrompt += toneInstructions[tone] || "";

  // ── Step 7: Call AI ────────────────────────────────────────
  const recentHistory = [
    ...history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: message },
  ];

  let aiReply;
  try {
    aiReply = await callAI(systemPrompt, recentHistory);
  } catch (err) {
    console.error("AI error:", err.message);
    aiReply = `I'm having trouble right now. Please call us at ${clinic.phone || "our clinic"} for immediate assistance.`;
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
// Helper — save appointment
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
