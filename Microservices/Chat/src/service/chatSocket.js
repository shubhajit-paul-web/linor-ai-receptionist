/**
 * chatSocket.js
 * Real-time Socket.IO handler for:
 *  - Provider portal subscribing to tenant room (receives transfer notifications)
 *  - Human agent joining a session and sending messages
 *  - Patient receiving human agent messages in real time
 */

const logger = require("../utils/logger");
const ChatSession = require("../model/chat.model");

exports.setupChatSockets = (io) => {
  io.on("connection", (socket) => {
    logger.info("Socket connected: %s", socket.id);

    // ── Provider portal joins tenant room ──────────────────────────────────
    // Emitted by provider portal on load: { tenantId }
    socket.on("join-tenant-room", ({ tenantId }) => {
      if (!tenantId) return;
      socket.join(`tenant:${tenantId}`);
      logger.info("Provider joined tenant room: %s (socket %s)", tenantId, socket.id);
    });

    // ── Patient joins their session room ────────────────────────────────────
    // Emitted by chat widget when it opens: { sessionId, tenantId }
    socket.on("join-session", ({ sessionId, tenantId }) => {
      if (!sessionId) return;
      socket.join(`session:${sessionId}`);
      socket.data.sessionId = sessionId;
      socket.data.tenantId = tenantId;
      socket.data.role = "patient";
      logger.info("Patient joined session room: %s", sessionId);
    });

    // ── Human agent joins a specific session ────────────────────────────────
    // Emitted by provider portal when agent clicks "Join": { sessionId, tenantId, agentName }
    socket.on("agent-join-session", async ({ sessionId, tenantId, agentName }) => {
      if (!sessionId || !tenantId) return;

      socket.join(`session:${sessionId}`);
      socket.data.sessionId = sessionId;
      socket.data.tenantId = tenantId;
      socket.data.role = "agent";
      socket.data.agentName = agentName || "Support Agent";

      // Update DB: mark agent joined
      try {
        await ChatSession.findOneAndUpdate(
          { sessionId, tenantId },
          { agentJoinedAt: new Date() }
        );
      } catch (err) {
        logger.warn("Could not update agent join time: %s", err.message);
      }

      // Notify patient
      io.to(`session:${sessionId}`).emit("agent-joined", {
        agentName: socket.data.agentName,
        message: `${socket.data.agentName} has joined the conversation.`,
        timestamp: new Date().toISOString(),
      });

      logger.info("Agent %s joined session %s", agentName, sessionId);
    });

    // ── Human agent sends a message to patient ──────────────────────────────
    // { sessionId, content, agentName }
    socket.on("agent-message", async ({ sessionId, content, agentName }) => {
      if (!sessionId || !content?.trim()) return;

      const msg = {
        role: "assistant",
        content: content.trim(),
        timestamp: new Date(),
      };

      // Save to DB
      try {
        await ChatSession.findOneAndUpdate(
          { sessionId },
          { $push: { messages: msg } }
        );
      } catch (err) {
        logger.warn("Could not save agent message: %s", err.message);
      }

      // Broadcast to the session room (patient + any other agents)
      io.to(`session:${sessionId}`).emit("new-message", {
        ...msg,
        isHuman: true,
        agentName: agentName || "Support Agent",
        timestamp: msg.timestamp.toISOString(),
      });
    });

    // ── Patient sends a message while in human-mode ─────────────────────────
    // After transfer, widget can also send messages via socket for real-time delivery
    // { sessionId, content }
    socket.on("patient-message", async ({ sessionId, content }) => {
      if (!sessionId || !content?.trim()) return;

      const msg = {
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      // Save to DB
      try {
        await ChatSession.findOneAndUpdate(
          { sessionId },
          { $push: { messages: msg } }
        );
      } catch (err) {
        logger.warn("Could not save patient message: %s", err.message);
      }

      // Broadcast to the session room so agents see it
      socket.to(`session:${sessionId}`).emit("new-message", {
        ...msg,
        isHuman: false,
        timestamp: msg.timestamp.toISOString(),
      });
    });

    // ── End session (agent closes the chat) ─────────────────────────────────
    socket.on("end-session", async ({ sessionId }) => {
      if (!sessionId) return;
      try {
        await ChatSession.findOneAndUpdate(
          { sessionId },
          { closedAt: new Date(), outcome: "Resolved" }
        );
      } catch (err) {
        logger.warn("Could not close session: %s", err.message);
      }
      io.to(`session:${sessionId}`).emit("session-ended", {
        message: "This conversation has been closed by the agent.",
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {
      logger.info("Socket disconnected: %s", socket.id);
    });
  });
};
