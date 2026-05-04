// src/routes/auth.routes.js
const express = require("express");
const passport = require("passport");

const {
  signup,
  login,
  logout,
  getMe,
} = require("../Controllers/auth.controller.js");
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


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// ROUTE 2: The callback - Where Google sends the user back
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'https://provider-portal-eosin-seven.vercel.app/login' }),
  (req, res) => {
    // Successful authentication - req.user is set by Passport
    const token = req.user.generateToken();
    
    // Set token as httpOnly cookie (same as regular login)
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    };
    
    res.cookie("token", token, cookieOptions);
    
    const userData = encodeURIComponent(JSON.stringify({
      id: req.user._id,
      email: req.user.email,
      docName: req.user.docName,
      isProfileComplete: req.user.isProfileComplete || false
    }));

    // Redirect to frontend with token and user data
    res.redirect(`https://provider-portal-eosin-seven.vercel.app/oauth-success?token=${token}&user=${userData}`);
  }
);

module.exports = router;
