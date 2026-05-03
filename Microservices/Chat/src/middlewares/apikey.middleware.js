const asyncHandler = require("../utils/asyncHandler");

exports.verifyApiKey = asyncHandler(async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ success: false, message: "API key missing" });
  }

  try {
    const response = await fetch(
      `${process.env.TENANT_SERVICE_URL}/api/tenants/clinic-info`,
      { headers: { "x-api-key": apiKey } }
    );

    if (!response.ok) {
      return res.status(403).json({ success: false, message: "Invalid API key" });
    }

    const data = await response.json();
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