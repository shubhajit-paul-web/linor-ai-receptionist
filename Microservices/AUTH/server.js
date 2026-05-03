require("dotenv").config();

const connectDB = require("./src/db/db.js");
const validateEnv = require("./src/config/env.js");
const app = require("./src/app.js");

// Step 1 — validate all env variables exist
validateEnv()

// Step 2 — connect to database
connectDB();

// Step 3 — start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Step 4 — handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});
