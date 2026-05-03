const mongoose = require("mongoose");
const logger = require("../utils/logger");

function CONNECTDB() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => logger.info("Connected to db"))
    .catch((err) => {
      logger.error("Database connection failed: %s", err.message);
    });
}

module.exports = CONNECTDB;
