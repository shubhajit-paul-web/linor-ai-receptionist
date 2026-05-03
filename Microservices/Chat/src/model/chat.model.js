// const mongoose = require("mongoose");

// const chatSchema = mongoose.Schema({
//   tenantId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Tenant",
//     required: true,
//   },
//   sessionId: { type: String, required: true },
//   role: { type: String, enum: ["user", "assistant"], required: true },
//   message: { type: String, required: true },
//   intent: {
//     type: String,
//     enum: [
//       "book_appointment",
//       "cancel_appointment",
//       "ask_faq",
//       "greeting",
//       "unknown",
//     ],
//     default: "unknown",
//   },
//   createdAt: { type: Date, default: Date.now },
// });

// // Index for fast session history fetching
// chatSchema.index({ sessionId: 1, createdAt: 1 });
// chatSchema.index({ tenantId: 1, createdAt: -1 });

// const chatModel = mongoose.model("Chat", chatSchema);

// module.exports = chatModel;
