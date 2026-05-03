require("dotenv").config();
const ImageKit = require("imagekit");
const logger = require("../utils/logger");

// Validate ImageKit configuration
const validateImageKitConfig = () => {
  const required = {
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    logger.warn("ImageKit configuration incomplete", { missing });
  }

  return {
    isValid: missing.length === 0,
    missing,
  };
};

// Initialize ImageKit with validation
let imagekit;

try {
  const config = validateImageKitConfig();
  
  if (config.isValid) {
    imagekit = new ImageKit({
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    });
    logger.info("ImageKit initialized successfully", { endpoint: process.env.IMAGEKIT_URL_ENDPOINT });

  } else {
    logger.error("ImageKit initialization failed", { reason: "Missing credentials", missing: config.missing });
    imagekit = null;
  }
} catch (error) {
  logger.error("ImageKit initialization error", { message: error.message, error: error.toString() });
  imagekit = null;
}

module.exports = imagekit;