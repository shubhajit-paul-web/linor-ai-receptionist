require("dotenv").config();

const app = require("./src/app");
const redis = require("./src/service/redisClient");
const { setupVoiceSockets } = require("./src/service/voiceSocket");
const http = require("http");
const { Server } = require("socket.io");
const logger = require("./src/utils/logger");

// ── Validate critical env vars ─────────────────────────────
const REQUIRED_ENVS = [
  "GROQ_API_KEY",
  "JWT_SECRET",
  "TENANT_SERVICE_URL",
  "FAQ_SERVICE_URL",
  "APPOINTMENT_SERVICE_URL",
  "REDIS_URL",
];
REQUIRED_ENVS.forEach((key) => {
  if (!process.env[key]) {
    logger.error("Missing required env variable: %s", key);
    process.exit(1);
  }
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Restrict this to your frontend URL in production
    methods: ["GET", "POST"],
  },
});

setupVoiceSockets(io);

// ── Start server ───────────────────────────────────────────
const PORT = process.env.PORT || 5004;

server.listen(PORT, () => {
  logger.info("Chat service listening on port %d  [%s]", PORT, process.env.NODE_ENV || "development");
});

// ── Graceful shutdown — close Redis + server cleanly ───────
const shutdown = async (signal) => {
  logger.info("%s received. Shutting down gracefully...", signal);
  server.close(async () => {
    try {
      await redis.quit(); // close Redis connection cleanly
      logger.info("Redis connection closed");
    } catch (err) {
      logger.error("Redis close error: %s", err.message);
    }
    logger.info("Chat Service shut down cleanly");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// ── Unhandled rejections ───────────────────────────────────
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection: %s", err.message);
  server.close(() => process.exit(1));
});
