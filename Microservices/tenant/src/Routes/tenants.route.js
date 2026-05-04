const express = require("express");
const router = express.Router();
const imagekit = require("../Services/imagekit.service");
const logger = require("../utils/logger");

const {
  getProfile,
  updateProfile,
  regenerateApiKey,
} = require("../Controllers/tenant.controller");

const { authenticate } = require("../Middlewares/auth.middleware");
const { verifyApiKey } = require("../Middlewares/apiKey.middleware");
const crypto = require("crypto");
const Tenant = require("../model/tenant.model");
const asyncHandler = require("../utils/asyncHandler");

// ── JWT protected routes (admin dashboard) ────────────────────
// All these require a JWT token from the centralized AUTH service
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.post("/regenerate-api-key", authenticate, regenerateApiKey);

// ── API key protected route (widget / AI system) ───────────────
// Used by internal services (Chat, FAQ, etc.) to fetch clinic information
// ⚠️  NO middleware here to avoid circular dependency - verification happens in handler
router.get(
  "/clinic-info",
  asyncHandler(async (req, res) => {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res
        .status(401)
        .json({ success: false, message: "API key missing" });
    }

    const hashedKey = crypto.createHash("sha256").update(apiKey).digest("hex");
    const tenant = await Tenant.findOne({ apiKey: hashedKey }).select(
      "+apiKey",
    );

    if (!tenant) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid API key" });
    }

    if (!tenant.isActive) {
      return res
        .status(403)
        .json({ success: false, message: "Account is deactivated" });
    }

    res.json({
      success: true,
      data: {
        user_id: tenant.user_id,
        clinicName: tenant.clinicName,
        phone: tenant.phone,
        workingHrs: tenant.workingHrs,
        services: tenant.services,
        welcomeMsg: tenant.welcomeMsg,
      },
    });
  }),
);

router.get("/imagekit-auth", (req, res) => {
  try {
   

    if (!imagekit) {
      return res.status(500).json({
        success: false,
        message: "ImageKit is not configured",
        details: "ImageKit service failed to initialize - check credentials in .env file"
      });
    }

    if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_PUBLIC_KEY) {
      return res.status(500).json({
        success: false,
        message: "ImageKit credentials not configured",
        details: "Missing IMAGEKIT_PRIVATE_KEY or IMAGEKIT_PUBLIC_KEY in environment"
      });
    }

    const result = imagekit.getAuthenticationParameters();
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error("ImageKit authentication failed", { message: error.message, error: error.toString() });
    res.status(500).json({
      success: false,
      message: "Failed to generate ImageKit authentication token",
      error: error.message,
      details: "Verify ImageKit credentials are valid and account is active. Check logs for details."
    });
  }
});

module.exports = router;
