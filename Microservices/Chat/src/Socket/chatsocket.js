// socket/chatSocket.js
const chatService = require("../service/chatservice");

module.exports = (io) => {

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // ── Event 1: Client joins a session room ──────────────────────────────
    socket.on("join_session", async ({ sessionId, apiKey }) => {
      try {
        // Validate API key → get tenant
        const tenant = await chatService.validateTenant(apiKey);

        // Store on socket for use in later events
        socket.tenant    = tenant;
        socket.sessionId = sessionId;

        // Join isolated room so messages don't bleed between sessions
        socket.join(sessionId);

        socket.emit("session_joined", {
          sessionId,
          greeting: tenant.settings.greetingMessage,
        });

      } catch (err) {
        socket.emit("error", { message: err.message });
        socket.disconnect();
      }
    });

    // ── Event 2: User sends a message ─────────────────────────────────────
    socket.on("user_message", async ({ message }) => {
      try {
        // Detect intent immediately — emit so widget can show
        // booking UI or cancel UI before AI even responds
        const intent = chatService.detectIntent(message);
        socket.emit("intent_detected", { intent });

        // Stream AI response token by token
        await chatService.handleMessage({
          tenant    : socket.tenant,
          sessionId : socket.sessionId,
          message,
          intent,
          onToken   : (token) => socket.emit("ai_token", { token }),
          onDone    : (fullReply) => socket.emit("ai_done", { fullReply, intent }),
        });

      } catch (err) {
        socket.emit("error", { message: "AI service failed. Please try again." });
      }
    });

    // ── Event 3: Disconnect ───────────────────────────────────────────────
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

};