require("dotenv").config();
const ImageKit = require("imagekit");

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
    console.warn("⚠️  ImageKit Configuration Warning:");
    console.warn("Missing environment variables:", missing.join(", "));
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

  } else {
    console.error("✗ ImageKit initialization failed - missing credentials");
    imagekit = null;
  }
} catch (error) {
  console.error("✗ ImageKit initialization error:", error.message);
  imagekit = null;
}

module.exports = imagekit;