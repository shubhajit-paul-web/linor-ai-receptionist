require("dotenv").config();
const app = require("./src/app");

app.listen(process.env.PORT || 5004, () => {
  console.log(`Chat Service running on port ${process.env.PORT || 5004}`);
});