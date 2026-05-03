const Tenant = require("../model/tenant.model");
const asyncHandler = require("../utils/asyncHandler");
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
    return res.status(404).json({
      success: false,
      message: "Clinic profile not found. Please complete your profile first.",
    });
  }

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
    return res.status(400).json({
      success: false,
      message: "Provide at least one field to update",
    });
  }

  // Build update — only include fields that were actually sent
  const updateData = {};
  if (clinicName !== undefined) updateData.clinicName = clinicName;
  if (address !== undefined) updateData.address = address;
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
    { returnDocument: 'after', runValidators: true },
  );

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
  console.log("req.user:", req.user); // what does token give?
  const user_id = String(req.user.id);
  console.log("searching for user_id:", user_id);


  const clinic = await Tenant.findOne({ user_id });
  console.log("clinic found:", clinic);    
  if (!clinic) {
    return res.status(404).json({
      success: false,
      message: "Clinic not found. Please complete your profile first.",
    });
  }

  const rawApiKey = generateApiKey();
  await Tenant.findOneAndUpdate({ user_id }, { apiKey: hashApiKey(rawApiKey) });

  res.json({
    success: true,
    message: "New API key generated. Update your embed script.",
    apiKey: rawApiKey, // ⚠️ shown ONCE
  });
});
