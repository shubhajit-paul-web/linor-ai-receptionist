const ApiError = require("../utils/ApiError.js");
const logger = require("../utils/logger.js");

const errorHandler = (err, req, res, next) => {
  // If it's our custom ApiError — use its properties
  if (err instanceof ApiError) {
    logger.warn(`ApiError: ${err.message}`, { statusCode: err.statusCode });
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    logger.warn(`Validation error`, { errors: Object.values(err.errors).map((e) => e.message) });
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    logger.warn(`Duplicate key error`, { code: err.code, keyPattern: err.keyPattern });
    return res.status(400).json({
      success: false,
      message: "Duplicate value — this already exists",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    logger.warn(`JWT error: ${err.message}`);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  // Fallback — unknown error
  logger.error(`Unhandled error`, { message: err.message, stack: err.stack, name: err.name });
  return res.status(500).json({
    success: false,
    message: "Something went wrong on our end",
  });
};

module.exports = errorHandler;
