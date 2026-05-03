/**
 * MongoDB Aggregation Pipeline Utilities
 * Optimized queries for common appointment operations
 */

// ─────────────────────────────────────────
// Get appointments with filtering, sorting & pagination
// ─────────────────────────────────────────
const appointmentListPipeline = (userId, filters = {}, options = {}) => {
  const {
    status,
    date,
    dateFrom,
    dateTo,
    patientName,
    page = 1,
    limit = 10,
  } = filters;

  const skip = (page - 1) * limit;
  const pipeline = [];

  // Stage 1: Match clinic
  const matchStage = { user_id: userId };
  if (status) matchStage.status = status;
  if (date) matchStage.date = date;
  if (dateFrom || dateTo) {
    matchStage.date = {};
    if (dateFrom) matchStage.date.$gte = dateFrom;
    if (dateTo) matchStage.date.$lte = dateTo;
  }
  if (patientName) {
    matchStage.$text = { $search: patientName };
  }

  pipeline.push({ $match: matchStage });

  // Stage 2: Sort by creation date descending
  pipeline.push({ $sort: { createdAt: -1 } });

  // Stage 3: Pagination
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  // Stage 4: Project only needed fields
  pipeline.push({
    $project: {
      _id: 1,
      user_id: 1,
      patientName: 1,
      phone: 1,
      date: 1,
      time: 1,
      service: 1,
      status: 1,
      notes: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  });

  return pipeline;
};

// ─────────────────────────────────────────
// Get appointment count for pagination
// ─────────────────────────────────────────
const appointmentCountPipeline = (userId, filters = {}) => {
  const { status, date, dateFrom, dateTo, patientName } = filters;

  const matchStage = { user_id: userId };
  if (status) matchStage.status = status;
  if (date) matchStage.date = date;
  if (dateFrom || dateTo) {
    matchStage.date = {};
    if (dateFrom) matchStage.date.$gte = dateFrom;
    if (dateTo) matchStage.date.$lte = dateTo;
  }
  if (patientName) {
    matchStage.patientName = { $regex: patientName, $options: "i" };
  }

  return [{ $match: matchStage }, { $count: "total" }];
};

// ─────────────────────────────────────────
// Get booked slots for a date (optimized)
// ─────────────────────────────────────────
const bookedSlotsPipeline = (userId, date) => {
  return [
    {
      $match: {
        user_id: userId,
        date: date,
        status: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: null,
        times: { $push: "$time" },
      },
    },
    {
      $project: {
        _id: 0,
        times: 1,
      },
    },
  ];
};

// ─────────────────────────────────────────
// Analytics: appointments by status
// ─────────────────────────────────────────
const appointmentsByStatusPipeline = (userId) => {
  return [
    { $match: { user_id: userId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ];
};

// ─────────────────────────────────────────
// Analytics: appointments by date range
// ─────────────────────────────────────────
const appointmentsByDateRangePipeline = (userId, dateFrom, dateTo) => {
  return [
    {
      $match: {
        user_id: userId,
        date: { $gte: dateFrom, $lte: dateTo },
        status: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: "$date",
        count: { $sum: 1 },
        services: { $push: "$service" },
      },
    },
    { $sort: { _id: 1 } },
  ];
};

// ─────────────────────────────────────────
// Analytics: top services
// ─────────────────────────────────────────
const topServicesPipeline = (userId, limit = 5) => {
  return [
    { $match: { user_id: userId, status: { $ne: "cancelled" } } },
    {
      $group: {
        _id: "$service",
        count: { $sum: 1 },
        lastBooked: { $max: "$date" },
      },
    },
    { $sort: { count: -1 } },
    { $limit: limit },
  ];
};

// ─────────────────────────────────────────
// Analytics: appointment statistics
// ─────────────────────────────────────────
const appointmentStatsPipeline = (userId) => {
  return [
    { $match: { user_id: userId } },
    {
      $facet: {
        total: [{ $count: "count" }],
        pending: [{ $match: { status: "pending" } }, { $count: "count" }],
        confirmed: [{ $match: { status: "confirmed" } }, { $count: "count" }],
        cancelled: [{ $match: { status: "cancelled" } }, { $count: "count" }],
      },
    },
    {
      $project: {
        total: { $arrayElemAt: ["$total.count", 0] },
        pending: { $arrayElemAt: ["$pending.count", 0] },
        confirmed: { $arrayElemAt: ["$confirmed.count", 0] },
        cancelled: { $arrayElemAt: ["$cancelled.count", 0] },
      },
    },
  ];
};

// ─────────────────────────────────────────
// Get slots booked by service type
// ─────────────────────────────────────────
const slotsByServicePipeline = (userId, date) => {
  return [
    {
      $match: {
        user_id: userId,
        date: date,
        status: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: "$service",
        slots: { $push: { time: "$time", patient: "$patientName" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ];
};

module.exports = {
  appointmentListPipeline,
  appointmentCountPipeline,
  bookedSlotsPipeline,
  appointmentsByStatusPipeline,
  appointmentsByDateRangePipeline,
  topServicesPipeline,
  appointmentStatsPipeline,
  slotsByServicePipeline,
};
