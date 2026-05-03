require("dotenv").config();

const app       = require("./src/app");
const connectDB = require("./src/db/db");

// ── Validate critical env vars ─────────────────────────────
const REQUIRED_ENVS = ["MONGODB_URI", "JWT_SECRET", "TENANT_SERVICE_URL"];
REQUIRED_ENVS.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required env variable: ${key}`);
    process.exit(1);
  }
});

// ── Connect DB ─────────────────────────────────────────────
connectDB();

// ── Start server ───────────────────────────────────────────
const PORT = process.env.PORT || 5002;
const server = app.listen(PORT, () => {
  console.log(`FAQ Service running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// ── Graceful shutdown ──────────────────────────────────────
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("FAQ Service shut down cleanly");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));

// ── Unhandled rejections ───────────────────────────────────
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});