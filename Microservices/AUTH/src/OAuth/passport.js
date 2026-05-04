require("dotenv").config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require("../model/user.model.js");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. Check if user exists in your MongoDB
      let user = await User.findOne({ googleId: profile.id });
      
      // 2. If not, create a new user using 'profile' data
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          docName: profile.displayName || profile.emails[0].value.split("@")[0],
          authProvider: "google",
          // OAuth users don't have passwords - don't set it
        });
      }
      
      // 3. Call done(null, user)
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Necessary for session management
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});