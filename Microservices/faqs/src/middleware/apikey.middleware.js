const crypto = require("crypto");
const asyncHandler = require("../utils/asyncHandler");

// FAQ service doesn't have Tenant model
// So we call Tenant service to verify API key
// OR — simpler for hackathon — just verify the key exists
// by calling Tenant service's /clinic-info endpoint

const hashApiKey = (key) =>
  crypto.createHash("sha256").update(key).digest("hex");

exports.verifyApiKey = asyncHandler(async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ success: false, message: "API key missing" });
  }

  try {
    // Call Tenant service to verify the API key and get user_id
    const response = await fetch(
      `${process.env.TENANT_SERVICE_URL}/api/tenants/clinic-info`,
      {
        headers: { "x-api-key": apiKey },
      }
    );

    if (!response.ok) {
      return res.status(403).json({ success: false, message: "Invalid API key" });
    }

    const data = await response.json();

    // Tenant service returns clinic info — extract user_id
    req.user_id = data.data.user_id;
    req.clinic  = data.data;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Could not verify API key. Tenant service unavailable.",
    });
  }
});