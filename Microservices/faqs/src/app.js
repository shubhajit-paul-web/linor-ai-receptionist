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
app.use(helmet());

// ── CORS ───────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
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

// ── Rate limiting ──────────────────────────────────────────
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later",
  }),
);

// ── Request logging ────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(
    morgan("dev", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    }),
  );
}

// ── Health check ───────────────────────────────────────────
app.get("/health", (req, res) =>
  res.json({
    status: "ok",
    service: "faq-service",
    environment: process.env.NODE_ENV,
  }),
);

// ── Routes ─────────────────────────────────────────────────
app.use("/api/faqs", require("./Routes/faqs.routes"));

app.get("/", (req, res) => res.json({ status: "FAQ Service running 🚀" }));

// ── Global error handler ───────────────────────────────────
app.use((err, req, res, next) => {
  logger.error(err.message || "Unhandled application error", {
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
