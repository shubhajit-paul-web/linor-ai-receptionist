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

// Compound index — fast conflict check per clinic per slot
AppointmentSchema.index({ user_id: 1, date: 1, time: 1 });
AppointmentSchema.index({ user_id: 1, status: 1 });

module.exports = mongoose.model("Appointment", AppointmentSchema);