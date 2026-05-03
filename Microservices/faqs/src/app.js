const express = require("express");
const cors = require("cors");
const faqRoutes = require("./Routes/faqs.routes");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);


app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/faqs", faqRoutes);

// Health check
app.get("/", (req, res) => res.json({ status: "FAQ Service running 🚀" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
