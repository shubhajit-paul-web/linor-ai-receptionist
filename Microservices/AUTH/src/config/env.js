// src/config/env.js
const logger = require("../utils/logger.js");

const requiredEnvVars = ["PORT", "MONGODB_URI", "JWT_SECRET", "JWT_EXPIRES_IN"];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    logger.error("Missing required environment variables", { missing });
    process.exit(1);
  }

  logger.debug("Environment variables validated successfully");
};

module.exports = validateEnv;
