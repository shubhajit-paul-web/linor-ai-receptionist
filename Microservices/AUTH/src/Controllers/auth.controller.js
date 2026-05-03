// src/controllers/auth.controller.js
const User = require("../model/user.model.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");
const logger = require("../utils/logger.js");
const crypto = require("crypto");

// ─── Helpers ──────────────────────────────────────
const generateApiKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

const hashApiKey = (key) => {
  return crypto.createHash("sha256").update(key).digest("hex");
};

// ─── Helper: Create token and send response ───────────────────
const sendTokenResponse = (user, statusCode, res, apiKey = null) => {
  const token = user.generateToken();

  // Cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  };

  // Remove password from output
  user.password = undefined;

  const responseData = {
    user: {
      id: user._id,
      email: user.email,
      docName: user.docName,
      isProfileComplete: user.isProfileComplete,
    },
    token,
  };

  // Include the API key on registration (shown only once)
  if (apiKey) {
    responseData.apiKey = apiKey;
  }

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json(new ApiResponse(statusCode, responseData, "Success"));
};

// ─── SIGNUP (Hospital Registration) ──────────────────────────
const signup = asyncHandler(async (req, res) => {
  const { docName, email, password } = req.body;

  logger.debug("Signup attempt", { email, docName });

  // Check if hospital already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    logger.warn("Signup failed: email already registered", { email });
    throw new ApiError(400, "Email already registered");
  }

  // Create hospital account — password gets hashed by pre('save') middleware
  const user = await User.create({
    docName,
    email,
    password,
  });

  logger.info("User registered successfully", { email, userId: user._id });

  // Return raw API key (shown only once)
  sendTokenResponse(user, 201, res);
});

// ─── LOGIN ───────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input exists
  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  logger.debug("Login attempt", { email });

  // Find user and explicitly include password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    // Important: same error message for wrong email OR wrong password
    logger.warn("Login failed: invalid credentials", { email, reason: "user_not_found" });
    throw new ApiError(401, "Invalid credentials");
  }

  // Check if account is active (for tenants)
  if (user.isActive === false) {
    logger.warn("Login failed: account deactivated", { email, userId: user._id });
    throw new ApiError(403, "Account is deactivated. Contact support.");
  }

  // Check password
  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    logger.warn("Login failed: invalid credentials", { email, reason: "wrong_password" });
    throw new ApiError(401, "Invalid credentials");
  }

  logger.info("User logged in successfully", { email, userId: user._id });

  sendTokenResponse(user, 200, res);
});

// ─── LOGOUT ──────────────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  logger.debug("User logout", { userId: req.user?.id });

  res.cookie("token", "", {
    expires: new Date(0), // Expire immediately
    httpOnly: true,
  });

  res.json(new ApiResponse(200, {}, "Logged out successfully"));
});

// ─── GET CURRENT USER ─────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by auth middleware
  const user = await User.findById(req.user.id);

  if (!user) {
    logger.warn("Get user failed: user not found", { userId: req.user.id });
    throw new ApiError(404, "User not found");
  }

  res.json(new ApiResponse(200, user, "User fetched"));
});

module.exports = {
  signup,
  login,
  logout,
  getMe,
};
