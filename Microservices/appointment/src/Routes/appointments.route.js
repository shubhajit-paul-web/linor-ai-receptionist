const express = require("express");
const router = express.Router();

const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getAvailableSlots,
  getAppointmentStats,
  getAppointmentsByStatus,
  getAppointmentsByDateRange,
  getTopServices,
  getSlotsByService,
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

// ── Analytics routes — JWT protected ──────────────────────────
router.get("/analytics/stats", authenticate, getAppointmentStats);
router.get("/analytics/by-status", authenticate, getAppointmentsByStatus);
router.get("/analytics/by-date-range", authenticate, getAppointmentsByDateRange);
router.get("/analytics/top-services", authenticate, getTopServices);
router.get("/analytics/slots-by-service", authenticate, getSlotsByService);

module.exports = router;
