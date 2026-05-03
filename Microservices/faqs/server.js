require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = require("./src/app");
const connectDB = require("./src/db/db");

// DB Connection
connectDB();
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
