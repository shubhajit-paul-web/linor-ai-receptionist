require("dotenv").config();

const connectDB = require("./src/db/db.js");
const validateEnv = require("./src/config/env.js");
const app = require("./src/app.js");
const logger = require("./src/utils/logger.js");

// Step 1 — validate all env variables exist
validateEnv()

// Step 2 — connect to database
connectDB();

// Step 3 — start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Step 4 — handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", { message: err.message, stack: err.stack });
  process.exit(1);
});
