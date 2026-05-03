const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    // Links to Auth service user — String, same pattern as Tenant and FAQ service
    // Never use ObjectId ref across microservices
    user_id: {
      type: String,
      required: [true, "user_id is required"],
      index: true,
    },

    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
      maxlength: [100, "Name too long"],
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    date: {
      type: String, // "2026-05-03"
      required: [true, "Date is required"],
    },

    time: {
      type: String, // "10:00 AM"
      required: [true, "Time is required"],
    },

    service: {
      type: String,
      required: [true, "Service is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    sessionId: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
      maxlength: [500, "Notes too long"],
    },
  },
  { timestamps: true }
);

// ─────────────────────────────────────────
// INDEXES for optimal query performance
// ─────────────────────────────────────────

// ─────────────────────────────────────────
// INDEXES for optimal query performance
// ─────────────────────────────────────────

// 1. EQUALITY: Fast conflict check per clinic per slot
AppointmentSchema.index({ user_id: 1, date: 1, time: 1 });

// 2. EQUALITY + RANGE: Fast analytics and slot checking
AppointmentSchema.index({ user_id: 1, status: 1, date: 1 });

// 3. ESR RULE (Equality, Sort, Range): Perfect for your appointmentListPipeline pagination
AppointmentSchema.index({ user_id: 1, createdAt: -1, date: 1 });

// 4. TEXT SEARCH: Fixes the $regex full collection scan for patient names
AppointmentSchema.index(
  { user_id: 1, patientName: "text" },
  { name: "patient_name_text_index" }
);

// 5. SPARSE: Fast queries on sessionId (only indexes docs that actually have a sessionId)
AppointmentSchema.index({ sessionId: 1 }, { sparse: true });

module.exports = mongoose.model("Appointment", AppointmentSchema);