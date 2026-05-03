const asyncHandler = require("../utils/asyncHandler");
const redis = require("../service/redisClient");
const logger = require("../utils/logger");

const CACHE_TTL = 60 * 5; // cache clinic data for 5 minutes
const cacheKey  = (apiKey) => `clinic:${apiKey}`;

exports.verifyApiKey = asyncHandler(async (req, res, next) => {
  // Accept the key from either 'x-api-key' or 'Authorization: Bearer <key>'
  // so that both the chat widget (which sends Authorization) and direct API
  // callers (which send x-api-key) work without any changes to either side.
  let apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    const authHeader = req.headers["authorization"] ?? "";
    if (authHeader.startsWith("Bearer ")) {
      apiKey = authHeader.slice(7).trim();
    }
  }

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
      logger.info("Clinic data served from Redis cache");
      return next();
    }
  } catch (err) {
    logger.warn("Redis cache read failed — falling through to Tenant service");
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
      logger.info("Clinic data cached in Redis");
    } catch (err) {
      logger.warn("Redis cache write failed — continuing without cache");
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