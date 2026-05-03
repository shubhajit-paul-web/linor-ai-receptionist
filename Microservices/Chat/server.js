require("dotenv").config();

const app = require("./src/app");
const redis = require("./src/service/redisClient");

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
    console.error(`❌ Missing required env variable: ${key}`);
    process.exit(1);
  }
});

// ── Start server ───────────────────────────────────────────
const PORT = process.env.PORT || 5004;
const server = app.listen(PORT, () => {
  console.log(
    `Chat Service running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
});

// ── Graceful shutdown — close Redis + server cleanly ───────
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    try {
      await redis.quit(); // close Redis connection cleanly
      console.log("Redis connection closed");
    } catch (err) {
      console.error("Redis close error:", err.message);
    }
    console.log("Chat Service shut down cleanly");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// ── Unhandled rejections ───────────────────────────────────
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});
