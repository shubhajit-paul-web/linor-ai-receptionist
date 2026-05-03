const crypto = require("crypto");
const Tenant = require("../model/tenant.model");
const asyncHandler = require("../utils/asyncHandler");

const hashApiKey = (key) => {
  return crypto.createHash("sha256").update(key).digest("hex");
};

exports.verifyApiKey = asyncHandler(async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ message: "API key missing" });
  }

  const hashedKey = hashApiKey(apiKey);

  // Fetch tenant from TENANT database using apiKey
  const tenant = await Tenant.findOne({ apiKey: hashedKey }).select("+apiKey");

  if (!tenant) {
    return res.status(403).json({ message: "Invalid API key" });
  }

  if (!tenant.isActive) {
    return res.status(403).json({ message: "Account is deactivated" });
  }

  req.tenant = tenant;
  next();
});