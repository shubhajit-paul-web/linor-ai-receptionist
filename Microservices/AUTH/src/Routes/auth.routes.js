// src/routes/auth.routes.js
const express = require("express");
const {
  signup,
  login,
  logout,
  getMe,
} = require("../controllers/auth.controller.js");
const {protect} = require("../Middlewares/auth.middleware.js"); 
const {
  validateSignup,
  validateLogin,
} = require("../Middlewares/validate.middleware.js");

const router = express.Router();

// Public routes
router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/logout", logout);

// Protected routes — must be logged in
router.get("/me", protect, getMe);

module.exports = router;
