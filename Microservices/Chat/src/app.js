const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/chat", require("./routes/chat.route"));

app.get("/", (req, res) => res.json({ status: "Chat Service running 🚀" }));

// Warm up Groq on start — so first patient doesn't wait
const { callAI } = require("./utils/geminiClient");
callAI("You are a receptionist.", [{ role: "user", content: "hi" }])
  .then(() => console.log("✅ Groq warmed up"))
  .catch((err) => {
    console.warn("⚠️ Groq warmup failed");
    console.error("Error details:", err.message || err);
    console.error("API Key exists:", !!process.env.GROQ_API_KEY);
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ success: false, message: err.message || "Internal server error" });
});

module.exports = app;
