const mongoose = require("mongoose");

const WorkingHoursSchema = new mongoose.Schema(
  {
    monday: { type: String, default: "9:00 AM - 6:00 PM" },
    tuesday: { type: String, default: "9:00 AM - 6:00 PM" },
    wednesday: { type: String, default: "9:00 AM - 6:00 PM" },
    thursday: { type: String, default: "9:00 AM - 6:00 PM" },
    friday: { type: String, default: "9:00 AM - 6:00 PM" },
    saturday: { type: String, default: "10:00 AM - 2:00 PM" },
    sunday: { type: String, default: "Closed" },
  },
  { _id: false },
);

const TenantSchema = new mongoose.Schema(
  {
    // Link to AUTH service user
    user_id: {
      type: String,
      required: [true, "User ID is required"],
      unique: true,
      trim: true,
    },

    // Clinic/Hospital details
    clinicName: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    postalCode: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    workingHrs: {
      type: WorkingHoursSchema,
      default: () => ({}),
    },
    services: {
      type: [String],
      default: [],
    },
    welcomeMsg: {
      type: String,
      default: "Hi! How can I help you today?",
    },
    logoUrl: {
      type: String,
      default: "",
    },

    // Track onboarding completion
    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // API key for widget/external access (hashed)
    apiKey: {
      type: String,
      unique: true,
      sparse: true, // Allow null values
      select: false, // Never return in queries by default
    },
  },
  { timestamps: true },
);

const tenantModel = mongoose.model("Tenant", TenantSchema);

module.exports = tenantModel;
