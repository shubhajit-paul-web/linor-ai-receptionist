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
  getSession,
  isInBookingFlow,
  handleBookingStep,
} = require("../utils/bookingStateMachine");
const { buildSuggestions } = require("../utils/suggestionBuilder");
const logger = require("../utils/logger");
const ChatSession = require("../model/chat.model");

const RATE_LIMIT = 20;
const RATE_LIMIT_TTL = 60;

// ─────────────────────────────────────────────────────────────
// POST /api/chat
// ─────────────────────────────────────────────────────────────
exports.chat = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const clinic = req.clinic;
  const user_id = req.user_id;

  // ── Normalise body: accept both new and old widget formats ────────────────
  // New format (current):  { message: string,  sessionId: string,  history: [] }
  // Old format (cached):   { messages: [{role, content}], session_id: string }

  let message   = body.message;
  let sessionId = body.sessionId || body.session_id;
  let history   = Array.isArray(body.history) ? body.history : [];

  if (!message && Array.isArray(body.messages) && body.messages.length > 0) {
    // Old format: messages array — extract the last user message as the
    // current message and everything before it as history.
    const msgs = body.messages;
    const last = msgs[msgs.length - 1];
    message = last?.content ?? last?.text ?? "";
    history = msgs.slice(0, -1).map(({ role, content, text }) => ({
      role: role || "user",
      content: content || text || "",
    }));
  }

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
    logger.warn("Rate limit check failed — continuing");
  }

  // ── Step 1: Already in booking flow ───────────────────────
  const inBooking = await isInBookingFlow(sessionId);
  if (inBooking) {
    const result = await handleBookingStep(sessionId, message, clinic);

    if (result.done) {
      if (result.appointmentData) {
        await saveAppointment(
          req.headers["x-api-key"],
          user_id,
          sessionId,
          result.appointmentData,
        );
      }
      return res.json({
        success: true,
        reply: result.reply,
        suggestions: buildSuggestions({ intent: "booking-done", clinic }),
      });
    }

    // Mid-flow: look at the *next* step saved by handleBookingStep and
    // surface chips appropriate for that step (dates, times, services, confirm).
    const nextSession = await getSession(sessionId);
    return res.json({
      success: true,
      reply: result.reply,
      suggestions: buildSuggestions({
        intent: "booking-step",
        stage: nextSession?.step,
        clinic,
      }),
    });
  }

  // ── Step 2: Booking intent ─────────────────────────────────
  if (detectBookingIntent(message)) {
    await initSession(sessionId);
    return res.json({
      success: true,
      reply: `I'd be happy to help you book an appointment! May I have your full name please?`,
      // No chips here — we want the user to type their name freely.
      suggestions: [],
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

      logger.info("RAG found %s relevant medical chunks", ragContext.length);
      if (ragContext[0]) {
        logger.info(
          "Top match: %s (score: %s)",
          ragContext[0].condition,
          ragContext[0].score?.toFixed(3),
        );
      }
    } catch (err) {
      logger.warn("Pinecone query failed — continuing without RAG: %s", err.message);
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
    logger.warn("FAQ service unavailable");
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
  let aiFailed = false;
  try {
    aiReply = await callAI(systemPrompt, recentHistory);
  } catch (err) {
    logger.error("AI error: %s", err.message);
    aiReply = `I'm having trouble right now. Please call us at ${clinic.phone || "our clinic"} for immediate assistance.`;
    aiFailed = true;
  }

  // Contextual quick replies — drive the next best action without extra tokens.
  const suggestions = aiFailed
    ? (clinic?.phone ? [`Call ${clinic.phone}`, "Working hours"] : [])
    : buildSuggestions({
        intent: isSymptom ? "symptom" : "general",
        clinic,
        tone,
      });

  // ── Step 8: Persist conversation ───────────────────────
  // Upsert session doc — create on first message, append on subsequent.
  try {
    const detectedIntents = [];
    if (detectBookingIntent(message)) detectedIntents.push("booking");
    if (isSymptom) detectedIntents.push("symptom");

    const outcome = detectBookingIntent(message)
      ? "Booked"
      : faqs.length && !isSymptom
      ? "FAQ Only"
      : aiFailed
      ? "Unresolved"
      : "Resolved";

    const sentimentMap = { urgent: "negative", anxious: "negative", frustrated: "negative", normal: "positive" };

    await ChatSession.findOneAndUpdate(
      { sessionId, tenantId: user_id },
      {
        $setOnInsert: {
          tenantId: user_id,
          sessionId,
          createdAt: new Date(),
          source: req.headers["x-widget-source"] || "Web Widget",
        },
        $push: {
          messages: {
            $each: [
              { role: "user", content: message, timestamp: new Date() },
              { role: "assistant", content: aiReply, timestamp: new Date() },
            ],
          },
        },
        $set: {
          outcome,
          sentiment: sentimentMap[tone] || "neutral",
          intents: detectedIntents,
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );
  } catch (err) {
    logger.warn("Failed to persist chat session: %s", err.message);
  }

  return res.json({ success: true, reply: aiReply, suggestions });
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
// GET /api/chat/sessions — provider portal chat logs
// Query params: ?page=1&limit=20&outcome=Resolved&search=keyword
// ─────────────────────────────────────────────────────────────
exports.getChatSessions = asyncHandler(async (req, res) => {
  const tenantId = req.user_id;
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const skip  = (page - 1) * limit;

  const filter = { tenantId };
  if (req.query.outcome && req.query.outcome !== "All") {
    filter.outcome = req.query.outcome;
  }
  if (req.query.sentiment && req.query.sentiment !== "All") {
    filter.sentiment = req.query.sentiment.toLowerCase();
  }
  if (req.query.search) {
    filter["messages.content"] = { $regex: req.query.search, $options: "i" };
  }
  if (req.query.transferred === "true") {
    filter.transferredToHuman = true;
  }

  const [sessions, total] = await Promise.all([
    ChatSession.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ChatSession.countDocuments(filter),
  ]);

  // Shape for the provider portal
  const shaped = sessions.map((s) => {
    const msgs = s.messages || [];
    const firstUser = msgs.find((m) => m.role === "user");
    const duration = s.closedAt
      ? Math.round((new Date(s.closedAt) - new Date(s.createdAt)) / 60000)
      : Math.round((new Date(s.updatedAt) - new Date(s.createdAt)) / 60000);

    return {
      id: s.sessionId,
      date: s.createdAt,
      duration: Math.max(1, duration),
      messages: msgs.length,
      outcome: s.outcome,
      sentiment: s.sentiment,
      preview: firstUser?.content?.slice(0, 80) || "(no message)",
      source: s.source,
      intents: s.intents || [],
      transferredToHuman: s.transferredToHuman,
      transcript: msgs.map((m) => ({
        role: m.role,
        text: m.content,
        time: m.timestamp,
      })),
      responseTimeAvg: 1.5,
    };
  });

  res.json({ success: true, data: shaped, total, page, limit });
});

// ─────────────────────────────────────────────────────────────
// POST /api/chat/transfer — request human agent transfer
// Body: { sessionId }
// ─────────────────────────────────────────────────────────────
exports.requestTransfer = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  const tenantId = req.user_id;

  if (!sessionId) {
    return res.status(400).json({ success: false, message: "sessionId is required" });
  }

  // Update or create the session as needing human transfer
  const session = await ChatSession.findOneAndUpdate(
    { sessionId, tenantId },
    {
      $set: {
        transferredToHuman: true,
        transferRequestedAt: new Date(),
        outcome: "Human Transfer",
      },
      $setOnInsert: {
        tenantId,
        sessionId,
        createdAt: new Date(),
        source: "Web Widget",
      },
    },
    { upsert: true, new: true }
  );

  // Emit real-time event to all agents in tenant room
  const io = req.app.get("io");
  if (io) {
    io.to(`tenant:${tenantId}`).emit("transfer-request", {
      sessionId,
      tenantId,
      requestedAt: new Date().toISOString(),
      preview: session.messages?.slice(-1)[0]?.content?.slice(0, 100) || "Patient requesting help",
    });
  }

  logger.info("Human transfer requested for session %s (tenant %s)", sessionId, tenantId);

  res.json({
    success: true,
    message: "Transfer request sent. An agent will join shortly.",
    sessionId,
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
      logger.error("Appointment save failed: %s %s", response.status, err);
      return;
    }

    const result = await response.json();
    logger.info("Appointment saved: %s", result.data?._id);
  } catch (err) {
    logger.error("Failed to save appointment: %s", err.message);
  }
};
