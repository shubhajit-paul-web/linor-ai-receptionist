const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant", "system"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSessionSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, unique: true, index: true },
    messages: [messageSchema],
    outcome: {
      type: String,
      enum: ["Resolved", "Booked", "FAQ Only", "Human Transfer", "Unresolved"],
      default: "Unresolved",
    },
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
      default: "neutral",
    },
    transferredToHuman: { type: Boolean, default: false },
    transferRequestedAt: { type: Date },
    agentJoinedAt: { type: Date },
    closedAt: { type: Date },
    source: { type: String, default: "Web Widget" },
    intents: [{ type: String }],
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

chatSessionSchema.index({ tenantId: 1, createdAt: -1 });
chatSessionSchema.index({ sessionId: 1, tenantId: 1 });

const ChatSession = mongoose.model("ChatSession", chatSessionSchema);
module.exports = ChatSession;
