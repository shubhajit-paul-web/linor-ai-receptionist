const express = require("express");
const router = express.Router();

const { chat, getClinicInfo } = require("../controllers/chat.controller");
const { verifyApiKey } = require("../middlewares/apiKey.middleware");

// All chat routes protected by API key
router.post("/", verifyApiKey, chat);
router.get("/clinic-info", verifyApiKey, getClinicInfo);

module.exports = router;
