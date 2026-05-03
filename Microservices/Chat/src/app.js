const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const logger = require("./utils/logger");


const app = express();

// ── Security headers ───────────────────────────────────────
// crossOriginResourcePolicy must be 'cross-origin' (not the default
// 'same-origin') because the widget is embedded on external hospital
// websites and browsers will otherwise block the fetch response.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// ── CORS — chat widget can be on any hospital website ──────
// Explicitly list every header the widget sends so the OPTIONS
// preflight never fails with an "invalid request header" rejection.
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-api-key",
      "X-Widget-Session",
      "X-Widget-Version",
    ],
    optionsSuccessStatus: 204,
  }),
);

// ── Cookie parser ──────────────────────────────────────────
app.use(cookieParser());

// ── Body parsing ───────────────────────────────────────────
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));



// ── Fix for Express 5 + mongo-sanitize ────────────────────
app.use((req, res, next) => {
  Object.defineProperty(req, "query", {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});

// ── NoSQL injection protection ─────────────────────────────
app.use(mongoSanitize());

// ── XSS protection ─────────────────────────────────────────
app.use(xss());

// ── Rate limiting — chat gets more requests than other services
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200, // higher limit for chat
    message: "Too many requests, please try again later",
  }),
);

// ── Request logging ────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Health check ───────────────────────────────────────────
app.get("/health", (req, res) =>
  res.json({
    status: "ok",
    service: "chat-service",
    environment: process.env.NODE_ENV,
  }),
);

// ── Routes ─────────────────────────────────────────────────
app.use("/api/chat", require("./routes/chat.route"));

app.get("/", (req, res) => res.json({ status: "Chat Service running 🚀" }));

// ── Warm up AI on start ────────────────────────────────────
const { callAI } = require("./utils/geminiClient");
callAI("You are a receptionist.", [{ role: "user", content: "hi" }])
  .then(() => logger.info("AI warmed up"))
  .catch((err) => logger.warn("AI warmup failed: %s", err.message));

// ── Global error handler ───────────────────────────────────
app.use((err, req, res, next) => {
  logger.error(err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
