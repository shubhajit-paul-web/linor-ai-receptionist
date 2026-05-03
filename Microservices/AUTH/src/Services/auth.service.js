// services/auth.service.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashed) => {
  return await bcrypt.compare(password, hashed);
};

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 🔐 API KEY
const generateApiKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

const hashApiKey = (key) => {
  return crypto.createHash("sha256").update(key).digest("hex");
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  generateApiKey,
  hashApiKey,
};