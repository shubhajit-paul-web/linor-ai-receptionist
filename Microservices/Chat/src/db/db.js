const mongoose = require("mongoose");
const logger = require("../utils/logger.js");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: "majority",
    });
    logger.info("MongoDB connected successfully", { host: connection.connection.host });
  } catch (error) {
    logger.error("MongoDB connection failed", { message: error.message, uri: process.env.MONGODB_URI });
    process.exit(1);
  }
};

module.exports = connectDB;
