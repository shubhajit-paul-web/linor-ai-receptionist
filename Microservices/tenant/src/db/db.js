const mongoose = require("mongoose");
const logger = require("../utils/logger");

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info("MongoDB connected", { host: conn.connection.host });
  } catch (err) {
    logger.error("MongoDB connection failed", { message: err.message, error: err.toString() });
    process.exit(1); // kill server if DB fails — don't run blind
  }
}

module.exports = connectDB;