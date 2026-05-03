const express = require("express");
const router = express.Router();

const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getAvailableSlots,
} = require("../controller/appointmentController");

const { authenticate } = require("../middleware/auth.middleware.js");
const { verifyApiKey } = require("../middleware/apiKeyAuth.js");

// ── Widget/Chat routes — API key protected ─────────────────────
router.post("/", verifyApiKey, createAppointment);
router.get("/available-slots", verifyApiKey, getAvailableSlots);

// ── Admin routes — JWT protected ──────────────────────────────
router.get("/", authenticate, getAllAppointments);
router.get("/:id", authenticate, getAppointmentById);
router.patch("/:id/status", authenticate, updateAppointmentStatus);
router.delete("/:id", authenticate, deleteAppointment);

module.exports = router;
