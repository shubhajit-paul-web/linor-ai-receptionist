// src/models/User.model.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    // ─── HOSPITAL/CLINIC OWNER INFO ───────────────
    docName: {
      type: String,
      required: [true, "Doctor/Owner name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never return password in queries by default
      // Optional for OAuth users
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allow null for non-OAuth users
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  },
);

// ─── MIDDLEWARE: Hash password before saving ───────────────────
userSchema.pre("save", async function () {
  // Only hash if password was actually changed AND exists
  // OAuth users won't have passwords, so skip hashing for them
  if (!this.isModified("password") || !this.password) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// ─── METHOD: Compare entered password with stored hash ─────────
userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─── METHOD: Generate JWT token ────────────────────────────────
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
