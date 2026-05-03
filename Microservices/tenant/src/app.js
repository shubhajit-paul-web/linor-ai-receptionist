const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const tenantRoutes = require("./Routes/tenants.route");
const logger = require("./utils/logger");

const app = express();

// ── Security Headers with Helmet ───────────────────────────
app.use(helmet());

// ── CORS Configuration ──────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// ── Cookie Parser ───────────────────────────────────────────
app.use(cookieParser());

// ── Body Parser Middleware ────────────────────────────────
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// --- FIX FOR EXPRESS 5 vs MONGO-SANITIZE ---
// This makes req.query writable so express-mongo-sanitize doesn't crash
app.use((req, res, next) => {
  Object.defineProperty(req, "query", {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});

// Data sanitization against NoSQL injection (AFTER body parsing)
app.use(mongoSanitize());

// ── Data sanitization against XSS ──────────────────────────
app.use(xss());

// ── Rate Limiting ───────────────────────────────────────────
// Max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
});
app.use("/api", limiter);

// ── Request Logging ────────────────────────────────────────
// Only in development to reduce noise in production
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Health Check Endpoint ─────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", environment: process.env.NODE_ENV });
});

// ── Routes ────────────────────────────────────────────────
app.use("/api/tenants", tenantRoutes);

// ── Fallback Health Check ─────────────────────────────────
app.get("/", (req, res) => res.json({ status: "API is running 🚀" }));

// ── Global Error Handler ──────────────────────────────────
// Must be last - catches errors thrown in asyncHandler and other routes
app.use((err, req, res, next) => {
  logger.error("Unhandled error", { message: err.message, stack: err.stack });
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
