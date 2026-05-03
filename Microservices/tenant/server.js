require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
const logger = require("./src/utils/logger");

connectDB();


const PORT = process.env.PORT || 5001;



app.listen(process.env.PORT || 5001, () => {
  logger.info("Server started", { port: process.env.PORT || 5001, environment: process.env.NODE_ENV || "development" });
});

// Step 4 — handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled promise rejection", { message: err.message, error: err.toString() });
  process.exit(1);
});