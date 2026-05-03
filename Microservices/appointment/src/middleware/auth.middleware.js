const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const logger = require("../utils/logger");

// Same pattern as Tenant and FAQ service
// Just verify JWT — shared secret — no DB call, no cross-service import
exports.authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    logger.warn("No authentication token provided", { path: req.path });
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: String(decoded.id) };
    logger.debug("Token verified successfully", { userId: req.user.id });
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      logger.warn("Token expired", { path: req.path });
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    logger.warn("Invalid token provided", { path: req.path, error: err.message });
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
});


