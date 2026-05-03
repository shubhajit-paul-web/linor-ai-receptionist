const mongoose = require("mongoose");
const logger = require("../utils/logger.js");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    logger.info("MongoDB connected successfully", { host: connection.connection.host });
  } catch (error) {
    logger.error("MongoDB connection failed", { message: error.message, uri: process.env.MONGODB_URI });
    process.exit(1);
  }
};

module.exports = connectDB;
