require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");

connectDB();


const PORT = process.env.PORT || 5001;



app.listen(process.env.PORT || 5001, () => {
  console.log(`Server running on port ${process.env.PORT || 5001}`);
});


// Step 4 — handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});