const mongoose = require("mongoose");
const logger = require("../utils/logger");

function connectDB() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => logger.info("Connected to database"))
    .catch((err) => {
      logger.error("Database connection failed", {
        message: err.message,
        stack: err.stack,
      });
    });
}

module.exports = connectDB;
