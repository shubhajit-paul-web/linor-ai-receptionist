const Appointment = require("../model/appointment.model");
const asyncHandler = require("../utils/asyncHandler");

const AVAILABLE_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM",
];

// ─────────────────────────────────────────
// GET /api/appointments
// Admin — get all appointments for this clinic
// ─────────────────────────────────────────
const getAllAppointments = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id);
  const { status, date } = req.query;

  const filter = { user_id };
  if (status) filter.status = status;
  if (date)   filter.date   = date;

  const appointments = await Appointment.find(filter).sort({ createdAt: -1 });

  res.json({ success: true, count: appointments.length, data: appointments });
});

// ─────────────────────────────────────────
// GET /api/appointments/:id
// Admin — get single appointment
// ─────────────────────────────────────────
const getAppointmentById = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id);

  const appointment = await Appointment.findOne({
    _id: req.params.id,
    user_id,
  });

  if (!appointment) {
    return res.status(404).json({ success: false, message: "Appointment not found" });
  }

  res.json({ success: true, data: appointment });
});

// ─────────────────────────────────────────
// POST /api/appointments
// Widget/Chat — book appointment via API key
// ─────────────────────────────────────────
const createAppointment = asyncHandler(async (req, res) => {
  // user_id comes from API key middleware
  const user_id = String(req.user_id);

  const { patientName, phone, date, time, service, sessionId, notes } = req.body;

  // Validate required fields
  if (!patientName || !date || !time || !service) {
    return res.status(400).json({
      success: false,
      message: "patientName, date, time and service are required",
    });
  }

  // Validate time slot
  if (!AVAILABLE_SLOTS.includes(time)) {
    return res.status(400).json({
      success: false,
      message: `Invalid time. Available slots: ${AVAILABLE_SLOTS.join(", ")}`,
    });
  }

  // Conflict check — same clinic, same date, same time, not cancelled
  const conflict = await Appointment.findOne({
    user_id,
    date,
    time,
    status: { $ne: "cancelled" },
  });

  if (conflict) {
    return res.status(409).json({
      success: false,
      message: `Slot ${time} on ${date} is already booked. Please choose another time.`,
      availableSlots: AVAILABLE_SLOTS,
    });
  }

  const appointment = await Appointment.create({
    user_id,
    patientName,
    phone:     phone     || "",
    date,
    time,
    service,
    sessionId: sessionId || "",
    notes:     notes     || "",
    status:    "pending",
  });

  res.status(201).json({
    success: true,
    message: "Appointment booked successfully",
    data: appointment,
  });
});

// ─────────────────────────────────────────
// PATCH /api/appointments/:id/status
// Admin — update appointment status
// ─────────────────────────────────────────
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id);
  const { status } = req.body;

  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be pending, confirmed or cancelled",
    });
  }

  const appointment = await Appointment.findOneAndUpdate(
    { _id: req.params.id, user_id },
    { status },
    { returnDocument: 'after' }
  );

  if (!appointment) {
    return res.status(404).json({ success: false, message: "Appointment not found" });
  }

  res.json({ success: true, data: appointment });
});

// ─────────────────────────────────────────
// DELETE /api/appointments/:id
// Admin — delete appointment
// ─────────────────────────────────────────
const deleteAppointment = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id);

  const appointment = await Appointment.findOneAndDelete({
    _id: req.params.id,
    user_id,
  });

  if (!appointment) {
    return res.status(404).json({ success: false, message: "Appointment not found" });
  }

  res.json({ success: true, message: "Appointment deleted" });
});

// ─────────────────────────────────────────
// GET /api/appointments/available-slots?date=2026-05-03
// Admin + Widget — check free slots for a date
// ─────────────────────────────────────────
const getAvailableSlots = asyncHandler(async (req, res) => {
  const { date } = req.query;

  // Works for both JWT (admin) and API key (widget)
  const user_id = String(req.user?.id || req.user_id);

  if (!date) {
    return res.status(400).json({ success: false, message: "date query param required" });
  }

  const booked = await Appointment.find({
    user_id,
    date,
    status: { $ne: "cancelled" },
  }).select("time");

  const bookedTimes = booked.map((a) => a.time);
  const available   = AVAILABLE_SLOTS.filter((slot) => !bookedTimes.includes(slot));

  res.json({ success: true, date, available, booked: bookedTimes });
});

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getAvailableSlots,
};