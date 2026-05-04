const express = require("express");
const router = express.Router();

const {
  chat,
  getClinicInfo,
  requestTransfer,
} = require("../controllers/chat.controller");
const { verifyApiKey } = require("../middlewares/apikey.middleware.js");

// All chat routes protected by API key
router.post("/", verifyApiKey, chat);
router.get("/clinic-info", verifyApiKey, getClinicInfo);
router.post("/transfer", verifyApiKey, requestTransfer);

module.exports = router;
