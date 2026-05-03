// src/config/env.js

const requiredEnvVars = ["PORT", "MONGODB_URI", "JWT_SECRET", "JWT_EXPIRES_IN"];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("Missing required environment variables:");
    missing.forEach((key) => console.error(`  - ${key}`));
    process.exit(1);
  }
};

module.exports = validateEnv;
