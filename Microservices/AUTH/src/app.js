// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./Middlewares/error.middleware.js");
const authRoutes = require("./Routes/auth.routes.js");
const session = require("express-session");
const passport = require("passport");
require("./OAuth/passport.js"); // Path to your strategy file

const app = express();

// Security headers — helmet sets these automatically
app.use(helmet());

// CORS — allow only our frontend
app.use(cors({
  origin: [
    "https://provider-portal-eosin-seven.vercel.app",  // no trailing slash
    "http://localhost:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

app.use(cookieParser());

app.use(
  session({ secret: "your_secret", resave: false, saveUninitialized: true }),
);
app.use(passport.initialize());
app.use(passport.session());

// Body parsing — understand JSON request bodies (BEFORE sanitization)
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

// Data sanitization against XSS
app.use(xss());

// Rate limiting — max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
});
app.use("/api", limiter);

// Request logging — only in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check — always useful
app.get("/health", (req, res) => {
  res.json({ status: "ok", environment: process.env.NODE_ENV });
});

app.use("/api/auth", authRoutes);

// Global error handler — must be last
app.use(errorHandler);

module.exports = app;
