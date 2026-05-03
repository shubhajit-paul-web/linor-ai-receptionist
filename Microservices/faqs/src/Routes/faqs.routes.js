const express = require("express");
const router = express.Router();

const {
  getAllFAQs,
  getActiveFAQs,
  getFAQById,
  createFAQ,
  createBulkFAQs,
  updateFAQ,
  deleteFAQ,
  deleteAllFAQs,
} = require("../controller/faq.Controller");

const { authenticate } = require("../middleware/auth.middleware");
const { verifyApiKey } = require("../middleware/apikey.middleware");

// ── Widget route — API key protected ──────────────────────────
// Called by Chat service to get FAQs for AI prompt
router.get("/active", verifyApiKey, getActiveFAQs);

// ── Admin routes — JWT protected ──────────────────────────────
router.get("/", authenticate, getAllFAQs);
router.get("/:id", authenticate, getFAQById);
router.post("/", authenticate, createFAQ);
router.post("/bulk", authenticate, createBulkFAQs);
router.put("/:id", authenticate, updateFAQ);
router.delete("/", authenticate, deleteAllFAQs);
router.delete("/:id", authenticate, deleteFAQ);

module.exports = router;