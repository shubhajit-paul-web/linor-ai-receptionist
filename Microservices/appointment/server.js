require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = require("./src/app");
const connectDB = require("./src/db/db");
const logger = require("./src/utils/logger");

// DB Connection
connectDB();
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
