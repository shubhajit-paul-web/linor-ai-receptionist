const ApiError = require("../utils/ApiError.js");

const errorHandler = (err, req, res, next) => {
  // If it's our custom ApiError — use its properties
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate value — this already exists",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  // Fallback — unknown error
  console.error("Unhandled error:", err);
  return res.status(500).json({
    success: false,
    message: "Something went wrong on our end",
  });
};

module.exports = errorHandler;
