require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db/db");
const logger = require("./src/utils/logger");

// ── Validate critical env vars ─────────────────────────────
const REQUIRED_ENVS = ["MONGODB_URI", "JWT_SECRET", "TENANT_SERVICE_URL"];
REQUIRED_ENVS.forEach((key) => {
  if (!process.env[key]) {
    logger.error(`Missing required env variable: ${key}`);
    process.exit(1);
  }
});

// ── Connect DB ─────────────────────────────────────────────
connectDB();

// ── Start server ───────────────────────────────────────────
const PORT = process.env.PORT || 5003;
const server = app.listen(PORT, () => {
  logger.info(
    `Appointment Service running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  );

  if (process.env.NODE_ENV === "production" && process.env.SELF_URL) {
    setInterval(
      async () => {
        try {
          const res = await fetch(`${process.env.SELF_URL}/ping`);
          logger.info("Keep-alive ping ok: %s", res.status);
        } catch (err) {
          logger.warn("Keep-alive ping failed: %s", err.message);
        }
      },
      13 * 60 * 1000,
    ); // 13 minutes
  }
});

// ── Graceful shutdown ──────────────────────────────────────
const shutdown = (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    logger.info("Appointment Service shut down cleanly");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// ── Unhandled rejections ───────────────────────────────────
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", { message: err.message });
  server.close(() => process.exit(1));
});
