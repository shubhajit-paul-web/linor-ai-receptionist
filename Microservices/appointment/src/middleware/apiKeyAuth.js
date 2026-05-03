const asyncHandler = require("../utils/asyncHandler");
const logger = require("../utils/logger");

// Calls Tenant service to verify API key — same pattern as FAQ service
// No direct DB access, no cross-service model imports
exports.verifyApiKey = asyncHandler(async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    logger.warn("API key missing from request", { path: req.path });
    return res.status(401).json({ success: false, message: "API key missing" });
  }

  try {
    logger.debug("Verifying API key", { path: req.path });
    const response = await fetch(
      `${process.env.TENANT_SERVICE_URL}/api/tenants/clinic-info`,
      { headers: { "x-api-key": apiKey } },
    );

    if (!response.ok) {
      logger.warn("Invalid API key provided", { path: req.path, status: response.status });
      return res
        .status(403)
        .json({ success: false, message: "Invalid API key" });
    }

    const data = await response.json();

    // Attach user_id and clinic info from Tenant service
    req.user_id = data.data.user_id;
    req.clinic = data.data;
    logger.debug("API key verified successfully", { userId: req.user_id });
    next();
  } catch (err) {
    logger.error("Failed to verify API key", {
      message: err.message,
      stack: err.stack,
      path: req.path,
    });
    return res.status(500).json({
      success: false,
      message: "Could not verify API key. Tenant service unavailable.",
    });
  }
});
