const asyncHandler = require("../utils/asyncHandler");
const redis = require("../service/redisClient");

const CACHE_TTL = 60 * 5; // cache clinic data for 5 minutes
const cacheKey  = (apiKey) => `clinic:${apiKey}`;

exports.verifyApiKey = asyncHandler(async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ success: false, message: "API key missing" });
  }

  // ── Check Redis cache first ────────────────────────────────
  try {
    const cached = await redis.get(cacheKey(apiKey));
    if (cached) {
      const data = JSON.parse(cached);
      req.user_id = data.user_id;
      req.clinic  = data;
      console.log("⚡ Clinic data served from Redis cache");
      return next();
    }
  } catch (err) {
    console.warn("Redis cache read failed — falling through to Tenant service");
  }

  // ── Cache miss — call Tenant service ──────────────────────
  try {
    const response = await fetch(
      `${process.env.TENANT_SERVICE_URL}/api/tenants/clinic-info`,
      { headers: { "x-api-key": apiKey } }
    );

    if (!response.ok) {
      return res.status(403).json({ success: false, message: "Invalid API key" });
    }

    const data = await response.json();

    // ── Store in Redis for next requests ──────────────────
    try {
      await redis.setex(cacheKey(apiKey), CACHE_TTL, JSON.stringify(data.data));
      console.log("✅ Clinic data cached in Redis");
    } catch (err) {
      console.warn("Redis cache write failed — continuing without cache");
    }

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