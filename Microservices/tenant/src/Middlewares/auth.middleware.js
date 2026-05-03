const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const logger = require("../utils/logger");

// Validates JWT tokens issued by the centralized AUTH service
exports.authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check Headers first
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2. Fallback to Cookies (Just like your Auth service!)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    logger.warn("Authentication failed", { reason: "No token provided" });
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Convert id to string to ensure consistency
    req.user = { id: String(decoded.id) };
    req.token = token; // Store token for passing to other microservices
    logger.debug("Token authenticated", { userId: req.user.id });

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      logger.warn("Token expired", { error: err.message });
      return res.status(401).json({ message: "Token has expired" });
    }
    logger.warn("Invalid token", { error: err.message });
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});
