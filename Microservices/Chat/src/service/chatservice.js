// // services/chatService.js
// const Tenant = require("../../../tenant/src/model/tenant.model");
// const FAQ = require("../../../faqs/src/model/FAQ.model");
// const ChatLog = require("../model/chat.model");
// const { detectIntent } = require("../utils/intentDetector");
// const { buildSystemPrompt } = require("../utils/promptBuilder");
// const { streamGeminiReply } = require("../utils/geminiClient");

// // ── 1. Validate API Key ───────────────────────────────────────────────────────
// const validateTenant = async (apiKey) => {
//   if (!apiKey) throw new Error("API key missing");

//   const tenant = await Tenant.findOne({ apiKey });
//   if (!tenant) throw new Error("Invalid API key");

//   return tenant;
// };

// // ── 2. Intent (thin wrapper so chatSocket doesn't import utils directly) ──────
// // detectIntent is re-exported as-is
// // chatSocket calls: chatService.detectIntent(message)

// // ── 3. Build Gemini-format conversation history from DB ───────────────────────
// const buildHistory = async (sessionId) => {
//   const logs = await ChatLog.find({ sessionId })
//     .sort({ createdAt: 1 })
//     .limit(20); // last 20 messages = ~10 turns of context

//   // Gemini expects: { role: "user"|"model", parts: [{ text }] }
//   return logs.map((log) => ({
//     role: log.role === "assistant" ? "model" : "user",
//     parts: [{ text: log.message }],
//   }));
// };

// // ── 4. Save both turns to DB ──────────────────────────────────────────────────
// const saveTurn = async (tenantId, sessionId, userMsg, aiReply, intent) => {
//   await ChatLog.insertMany([
//     { tenantId, sessionId, role: "user", message: userMsg, intent },
//     { tenantId, sessionId, role: "assistant", message: aiReply, intent },
//   ]);
// };

// // ── 5. Main Orchestration ─────────────────────────────────────────────────────
// const handleMessage = async ({
//   tenant,
//   sessionId,
//   message,
//   intent,
//   onToken,
//   onDone,
// }) => {
//   // 5a. Fetch FAQs fresh from DB (admin edits reflect immediately)
//   const faqs = await FAQ.find({ tenantId: tenant._id });

//   // 5b. Build system prompt with tenant data + faqs
//   const systemPrompt = buildSystemPrompt(tenant, faqs);

//   // 5c. Fetch conversation history and append current user message
//   const history = await buildHistory(sessionId);
//   const fullHistory = [
//     ...history,
//     { role: "user", parts: [{ text: message }] },
//   ];

//   // 5d. Stream Gemini reply — onToken fires for every chunk
//   const fullReply = await streamGeminiReply(fullHistory, systemPrompt, onToken);

//   // 5e. Persist both turns
//   await saveTurn(tenant._id, sessionId, message, fullReply, intent);

//   // 5f. Signal completion with full reply + intent
//   onDone(fullReply);
// };

// module.exports = {
//   validateTenant,
//   detectIntent,
//   handleMessage,
// };
