const express = require("express");
const router = express.Router();

const {
  chat,
  getClinicInfo,
  getChatSessions,
  requestTransfer,
} = require("../controllers/chat.controller");
const { verifyApiKey } = require("../middlewares/apiKey.middleware.js");

// All chat routes protected by API key
router.post("/", verifyApiKey, chat);
router.get("/clinic-info", verifyApiKey, getClinicInfo);
router.get("/sessions", verifyApiKey, getChatSessions);
router.post("/transfer", verifyApiKey, requestTransfer);

module.exports = router;
