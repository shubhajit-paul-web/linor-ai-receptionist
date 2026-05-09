const Tenant = require("../model/tenant.model");
const asyncHandler = require("../utils/asyncHandler");
const logger = require("../utils/logger");
const crypto = require("crypto");

const generateApiKey = () => crypto.randomBytes(32).toString("hex");
const hashApiKey = (key) =>
  crypto.createHash("sha256").update(key).digest("hex");

const checkIsComplete = (clinic) => {
  return !!(
    clinic.clinicName &&
    clinic.address &&
    clinic.phone &&
    clinic.services?.length > 0
  );
};

// ─────────────────────────────────────────
// GET /api/tenants/profile
// ─────────────────────────────────────────
exports.getProfile = asyncHandler(async (req, res) => {
  // req.user.id comes from JWT — decoded in auth.middleware.js
  // JWT was signed in Auth service as: jwt.sign({ id: this._id }, ...)
  // So decoded.id = MongoDB _id from Auth service = our user_id
  const user_id = String(req.user.id);

  const clinic = await Tenant.findOne({ user_id });

  if (!clinic) {
    logger.warn("Clinic profile not found", { userId: user_id });
    return res.status(404).json({
      success: false,
      message: "Clinic profile not found. Please complete your profile first.",
    });
  }

  logger.info("Profile retrieved", {
    userId: user_id,
    clinicName: clinic.clinicName,
  });
  res.json({ success: true, data: clinic });
});

// ─────────────────────────────────────────
// PUT /api/tenants/profile
// ─────────────────────────────────────────
exports.updateProfile = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id); // from JWT — same id Auth service used when signing

  const {
    clinicName,
    address,
    city, // <-- Add this
    postalCode,
    phone,
    workingHrs,
    services,
    welcomeMsg,
    logoUrl,
  } = req.body;

  if (
    !clinicName &&
    !address &&
    !phone &&
    !workingHrs &&
    !services &&
    !welcomeMsg &&
    !logoUrl
  ) {
    logger.warn("Profile update validation failed", {
      userId: user_id,
      reason: "No fields provided",
    });
    return res.status(400).json({
      success: false,
      message: "Provide at least one field to update",
    });
  }

  // Build update — only include fields that were actually sent
  const updateData = {};
  if (clinicName !== undefined) updateData.clinicName = clinicName;
  if (address !== undefined) updateData.address = address;
  if (city !== undefined) updateData.city = city;
  if (postalCode !== undefined) updateData.postalCode = postalCode;
  if (phone !== undefined) updateData.phone = phone;
  if (workingHrs !== undefined) updateData.workingHrs = workingHrs;
  if (services !== undefined) updateData.services = services;
  if (welcomeMsg !== undefined) updateData.welcomeMsg = welcomeMsg;
  if (logoUrl !== undefined) updateData.logoUrl = logoUrl;

  // Check existing clinic — ONE db call
  const existing = await Tenant.findOne({ user_id });

  // ── FIRST TIME — create clinic record ──────────────────────
  if (!existing) {
    const rawApiKey = generateApiKey();
    const hashedApiKey = hashApiKey(rawApiKey);

    const clinic = await Tenant.create({
      user_id, // THIS is the fix — always set explicitly from JWT
      apiKey: hashedApiKey,
      ...updateData,
      isProfileComplete: checkIsComplete(updateData),
    });

    logger.info("Clinic profile created", {
      userId: user_id,
      clinicName: clinic.clinicName,
      isComplete: clinic.isProfileComplete,
    });

    return res.status(201).json({
      success: true,
      message: clinic.isProfileComplete
        ? "Profile complete! Your AI receptionist is ready."
        : "Profile created. Please fill remaining details.",
      apiKey: rawApiKey, // ⚠️ shown ONCE — frontend must save this
      data: clinic,
    });
  }

  // ── EXISTING — update in ONE db call ───────────────────────
  const merged = { ...existing.toObject(), ...updateData };
  updateData.isProfileComplete = checkIsComplete(merged);

  const clinic = await Tenant.findOneAndUpdate(
    { user_id },
    { $set: updateData },
    { returnDocument: "after", runValidators: true },
  );

  logger.info("Clinic profile updated", {
    userId: user_id,
    clinicName: clinic.clinicName,
    isComplete: clinic.isProfileComplete,
  });

  res.json({
    success: true,
    message: clinic.isProfileComplete
      ? "Profile complete! Your AI receptionist is ready."
      : "Profile updated",
    data: clinic,
  });
});

// ─────────────────────────────────────────
// POST /api/tenants/regenerate-api-key
// ─────────────────────────────────────────
exports.regenerateApiKey = asyncHandler(async (req, res) => {
  logger.debug("Regenerating API key", { user: req.user });
  const user_id = String(req.user.id);
  logger.debug("Searching for clinic", { userId: user_id });

  const clinic = await Tenant.findOne({ user_id });
  logger.debug("Clinic lookup result", { found: !!clinic, userId: user_id });
  if (!clinic) {
    logger.warn("Cannot regenerate API key - clinic not found", {
      userId: user_id,
    });
    return res.status(404).json({
      success: false,
      message: "Clinic not found. Please complete your profile first.",
    });
  }

  const rawApiKey = generateApiKey();

  const newHashedKey = hashApiKey(rawApiKey);

  // ── Invalidate old key's Redis cache ──────────────────────
  // Chat service caches clinic data as `clinic:<SHA256(rawKey)>`.
  // The old hash IS the value currently stored in clinic.apiKey
  // (which we fetched above with .select("+apiKey")).
  // Re-fetch with +apiKey to get the old hash, then delete it.
  try {
    const clinicWithKey = await Tenant.findOne({ user_id }).select("+apiKey");
    if (clinicWithKey?.apiKey) {
      const Redis = require("ioredis");
      const redisClient = new Redis(process.env.REDIS_URL, {
        lazyConnect: true,
      });
      await redisClient.connect().catch(() => {});
      await redisClient.del(`clinic:${clinicWithKey.apiKey}`);
      await redisClient.quit();
      logger.info("Old API key cache invalidated in Redis", {
        userId: user_id,
      });
    }
  } catch (err) {
    logger.warn("Redis cache invalidation failed — old key expires in 4h", {
      error: err.message,
    });
  }

  await Tenant.findOneAndUpdate({ user_id }, { apiKey: newHashedKey });
  logger.info("API key regenerated", {
    userId: user_id,
    clinicName: clinic.clinicName,
  });

  res.json({
    success: true,
    message: "New API key generated. Update your embed script.",
    apiKey: rawApiKey, // ⚠️ shown ONCE
  });
});
