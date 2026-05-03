const Appointment = require("../model/appointment.model");
const asyncHandler = require("../utils/asyncHandler");
const {
  appointmentListPipeline,
  appointmentCountPipeline,
  bookedSlotsPipeline,
  appointmentsByStatusPipeline,
  appointmentsByDateRangePipeline,
  topServicesPipeline,
  appointmentStatsPipeline,
  slotsByServicePipeline,
} = require("../utils/aggregationPipelines");

const AVAILABLE_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

// ─────────────────────────────────────────
// GET /api/appointments
// Admin — get all appointments for this clinic
// ─────────────────────────────────────────
const getAllAppointments = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id);
  const {
    status,
    date,
    dateFrom,
    dateTo,
    patientName,
    page = 1,
    limit = 10,
  } = req.query;

  const filters = {
    status,
    date,
    dateFrom,
    dateTo,
    patientName,
    page: parseInt(page),
    limit: parseInt(limit),
  };
  
  const pipeline = appointmentListPipeline(user_id, filters);
  const countPipeline = appointmentCountPipeline(user_id, filters);

  // OPTIMIZATION: Execute both data and count pipelines concurrently
  const [appointments, countResult] = await Promise.all([
    Appointment.aggregate(pipeline),
    Appointment.aggregate(countPipeline)
  ]);

  const total = countResult[0]?.total || 0;

  res.json({
    success: true,
    count: appointments.length,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    data: appointments,
  });
});

// ─────────────────────────────────────────
// GET /api/appointments/:id
// Admin — get single appointment
// ─────────────────────────────────────────
const getAppointmentById = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id);

  // OPTIMIZATION: Added .lean() to return a plain JS object, saving Mongoose overhead
  const appointment = await Appointment.findOne({
    _id: req.params.id,
    user_id,
  }).lean();

  if (!appointment) {
    return res
      .status(404)
      .json({ success: false, message: "Appointment not found" });
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

  const { patientName, phone, date, time, service, sessionId, notes } =
    req.body;

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

  // OPTIMIZATION: Added '_id' projection and .lean() for fastest possible conflict check
  const conflict = await Appointment.findOne({
    user_id,
    date,
    time,
    status: { $ne: "cancelled" },
  }, '_id').lean();

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
    phone: phone || "",
    date,
    time,
    service,
    sessionId: sessionId || "",
    notes: notes || "",
    status: "pending",
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
    { returnDocument: "after" },
  );

  if (!appointment) {
    return res
      .status(404)
      .json({ success: false, message: "Appointment not found" });
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
    return res
      .status(404)
      .json({ success: false, message: "Appointment not found" });
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
    return res
      .status(400)
      .json({ success: false, message: "date query param required" });
  }

  // Use aggregation for efficient slot retrieval
  const pipeline = bookedSlotsPipeline(user_id, date);
  const result = await Appointment.aggregate(pipeline);

  const bookedTimes = result[0]?.times || [];
  const available = AVAILABLE_SLOTS.filter(
    (slot) => !bookedTimes.includes(slot),
  );

  res.json({ success: true, date, available, booked: bookedTimes });
});

// ─────────────────────────────────────────
// GET /api/appointments/analytics/stats
// Admin — get appointment statistics
// ─────────────────────────────────────────
const getAppointmentStats = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id);

  const pipeline = appointmentStatsPipeline(user_id);
  const stats = await Appointment.aggregate(pipeline);

  res.json({
    success: true,
    data: stats[0] || {
      total: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
    },
  });
});

// ─────────────────────────────────────────
// GET /api/appointments/analytics/by-status
// Admin — get breakdown by status
// ─────────────────────────────────────────
const getAppointmentsByStatus = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id);

  const pipeline = appointmentsByStatusPipeline(user_id);
  const data = await Appointment.aggregate(pipeline);

  res.json({ success: true, data });
});

// ─────────────────────────────────────────
// GET /api/appointments/analytics/by-date-range
// Admin — get appointments by date range
// ─────────────────────────────────────────
const getAppointmentsByDateRange = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id);
  const { dateFrom, dateTo } = req.query;

  if (!dateFrom || !dateTo) {
    return res.status(400).json({
      success: false,
      message: "dateFrom and dateTo query params required",
    });
  }

  const pipeline = appointmentsByDateRangePipeline(user_id, dateFrom, dateTo);
  const data = await Appointment.aggregate(pipeline);

  res.json({ success: true, data });
});

// ─────────────────────────────────────────
// GET /api/appointments/analytics/top-services
// Admin — get most booked services
// ─────────────────────────────────────────
const getTopServices = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id);
  const { limit = 5 } = req.query;

  const pipeline = topServicesPipeline(user_id, parseInt(limit));
  const data = await Appointment.aggregate(pipeline);

  res.json({ success: true, data });
});

// ─────────────────────────────────────────
// GET /api/appointments/analytics/slots-by-service?date=2026-05-03
// Admin — get slots breakdown by service
// ─────────────────────────────────────────
const getSlotsByService = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id);
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      success: false,
      message: "date query param required",
    });
  }

  const pipeline = slotsByServicePipeline(user_id, date);
  const data = await Appointment.aggregate(pipeline);

  res.json({ success: true, date, data });
});

module.exports = {
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
};