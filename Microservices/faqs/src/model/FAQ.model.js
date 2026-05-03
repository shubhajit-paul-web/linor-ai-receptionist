const mongoose = require("mongoose");

const FAQSchema = new mongoose.Schema(
  {
    // Links to Tenant service via user_id from JWT
    // Same pattern as Tenant service
    user_id: {
      type: String,
      required: [true, "user_id is required"],
      index: true, // index for fast queries per clinic
    },

    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
      minlength: [5, "Question must be at least 5 characters"],
      maxlength: [500, "Question too long"],
    },

    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
      minlength: [2, "Answer must be at least 2 characters"],
      maxlength: [2000, "Answer too long"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // For ordering FAQs in admin dashboard
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound index — fast lookup of all FAQs for a clinic
FAQSchema.index({ user_id: 1, isActive: 1 });

module.exports = mongoose.model("FAQ", FAQSchema);