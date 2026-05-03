/**
 * Quick Reference: Aggregation Pipeline Usage
 * 
 * This file demonstrates how to use the aggregation pipelines
 * and provides examples for common scenarios
 */

// ─────────────────────────────────────────────────────────────
// IMPORT AGGREGATION PIPELINES
// ─────────────────────────────────────────────────────────────

const {
  appointmentListPipeline,
  appointmentCountPipeline,
  bookedSlotsPipeline,
  appointmentsByStatusPipeline,
  appointmentsByDateRangePipeline,
  topServicesPipeline,
  appointmentStatsPipeline,
  slotsByServicePipeline,
} = require("./src/utils/aggregationPipelines");

const Appointment = require("./src/model/appointment.model");

// ─────────────────────────────────────────────────────────────
// EXAMPLE 1: Get Paginated List of Appointments
// ─────────────────────────────────────────────────────────────
async function getAppointmentsList() {
  const userId = "clinic-123";
  const filters = {
    status: "pending",
    page: 1,
    limit: 10,
  };

  const pipeline = appointmentListPipeline(userId, filters);
  const appointments = await Appointment.aggregate(pipeline);

  // Result: Array of 10 appointments, sorted by date
  console.log(appointments);
}

// ─────────────────────────────────────────────────────────────
// EXAMPLE 2: Search Appointments by Patient Name
// ─────────────────────────────────────────────────────────────
async function searchByPatient() {
  const userId = "clinic-123";
  const filters = {
    patientName: "John",
    dateFrom: "2026-05-01",
    dateTo: "2026-05-31",
    page: 1,
    limit: 20,
  };

  const pipeline = appointmentListPipeline(userId, filters);
  const results = await Appointment.aggregate(pipeline);

  console.log(`Found ${results.length} appointments for patient "John"`);
}

// ─────────────────────────────────────────────────────────────
// EXAMPLE 3: Check Available Slots for a Specific Date
// ─────────────────────────────────────────────────────────────
async function checkAvailableSlots() {
  const userId = "clinic-123";
  const date = "2026-05-15";

  const pipeline = bookedSlotsPipeline(userId, date);
  const result = await Appointment.aggregate(pipeline);

  const bookedTimes = result[0]?.times || [];
  const availableSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM",
  ].filter(slot => !bookedTimes.includes(slot));

  console.log(`Available slots for ${date}: ${availableSlots.join(", ")}`);
  // Output: Available slots for 2026-05-15: 10:00 AM, 03:00 PM, 04:00 PM
}

// ─────────────────────────────────────────────────────────────
// EXAMPLE 4: Get Dashboard Statistics
// ─────────────────────────────────────────────────────────────
async function getDashboardStats() {
  const userId = "clinic-123";

  const pipeline = appointmentStatsPipeline(userId);
  const stats = await Appointment.aggregate(pipeline);

  console.log("Dashboard Stats:", stats[0]);
  // Output:
  // {
  //   total: 150,
  //   pending: 35,
  //   confirmed: 100,
  //   cancelled: 15
  // }
}

// ─────────────────────────────────────────────────────────────
// EXAMPLE 5: Analyze Appointments by Status
// ─────────────────────────────────────────────────────────────
async function analyzeByStatus() {
  const userId = "clinic-123";

  const pipeline = appointmentsByStatusPipeline(userId);
  const data = await Appointment.aggregate(pipeline);

  console.log("Status Breakdown:", data);
  // Output: [
  //   { _id: "pending", count: 35 },
  //   { _id: "confirmed", count: 100 },
  //   { _id: "cancelled", count: 15 }
  // ]
}

// ─────────────────────────────────────────────────────────────
// EXAMPLE 6: Get Appointments for a Date Range
// ─────────────────────────────────────────────────────────────
async function getMonthlyBreakdown() {
  const userId = "clinic-123";
  const dateFrom = "2026-05-01";
  const dateTo = "2026-05-31";

  const pipeline = appointmentsByDateRangePipeline(userId, dateFrom, dateTo);
  const data = await Appointment.aggregate(pipeline);

  console.log("May Appointments by Date:");
  data.forEach(day => {
    console.log(`  ${day._id}: ${day.count} appointments`);
  });
}

// ─────────────────────────────────────────────────────────────
// EXAMPLE 7: Find Top Services
// ─────────────────────────────────────────────────────────────
async function getTopServices() {
  const userId = "clinic-123";
  const limit = 5;

  const pipeline = topServicesPipeline(userId, limit);
  const data = await Appointment.aggregate(pipeline);

  console.log("Top 5 Services:");
  data.forEach((service, index) => {
    console.log(`  ${index + 1}. ${service._id}: ${service.count} bookings`);
  });
  // Output:
  // Top 5 Services:
  //   1. Consultation: 85 bookings
  //   2. Follow-up: 45 bookings
  //   3. Treatment: 15 bookings
  //   etc.
}

// ─────────────────────────────────────────────────────────────
// EXAMPLE 8: Get Slots Breakdown by Service
// ─────────────────────────────────────────────────────────────
async function getSlotsByService() {
  const userId = "clinic-123";
  const date = "2026-05-15";

  const pipeline = slotsByServicePipeline(userId, date);
  const data = await Appointment.aggregate(pipeline);

  console.log(`Slots booked by service on ${date}:`);
  data.forEach(service => {
    console.log(`  ${service._id}:`);
    service.slots.forEach(slot => {
      console.log(`    - ${slot.time}: ${slot.patient}`);
    });
  });
  // Output:
  // Slots booked by service on 2026-05-15:
  //   Consultation:
  //     - 10:00 AM: John Smith
  //     - 11:00 AM: Jane Doe
  //   Follow-up:
  //     - 02:00 PM: Bob Johnson
}

// ─────────────────────────────────────────────────────────────
// EXAMPLE 9: Get Count for Pagination
// ─────────────────────────────────────────────────────────────
async function getPaginationInfo() {
  const userId = "clinic-123";
  const filters = {
    status: "pending",
    limit: 10,
  };

  // Get total count
  const countPipeline = appointmentCountPipeline(userId, filters);
  const countResult = await Appointment.aggregate(countPipeline);
  const total = countResult[0]?.total || 0;

  const totalPages = Math.ceil(total / filters.limit);

  console.log(`Total pending appointments: ${total}`);
  console.log(`Total pages (limit 10): ${totalPages}`);
}

// ─────────────────────────────────────────────────────────────
// EXAMPLE 10: Combined - Get List with Count
// ─────────────────────────────────────────────────────────────
async function getAppointmentsWithCount() {
  const userId = "clinic-123";
  const filters = {
    status: "confirmed",
    page: 1,
    limit: 15,
  };

  // Run both queries in parallel for better performance
  const [appointments, countResult] = await Promise.all([
    Appointment.aggregate(appointmentListPipeline(userId, filters)),
    Appointment.aggregate(appointmentCountPipeline(userId, filters)),
  ]);

  const total = countResult[0]?.total || 0;
  const totalPages = Math.ceil(total / filters.limit);

  return {
    data: appointments,
    pagination: {
      current: filters.page,
      total: totalPages,
      count: appointments.length,
      totalRecords: total,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// API ENDPOINT USAGE REFERENCE
// ─────────────────────────────────────────────────────────────

/*
EXISTING ENDPOINTS (Enhanced):

1. GET /api/appointments?page=1&limit=10&status=pending&date=2026-05-15
   - Now uses aggregation pipeline
   - Faster with pagination support
   - Returns: { success, count, total, page, limit, data[] }

2. GET /api/appointments/available-slots?date=2026-05-15
   - Optimized with aggregation
   - Returns: { success, date, available[], booked[] }

---

NEW ANALYTICS ENDPOINTS:

3. GET /api/appointments/analytics/stats
   - Get appointment statistics
   - Returns: { success, data: { total, pending, confirmed, cancelled } }

4. GET /api/appointments/analytics/by-status
   - Breakdown by status
   - Returns: { success, data: [{ _id, count }] }

5. GET /api/appointments/analytics/by-date-range?dateFrom=2026-05-01&dateTo=2026-05-31
   - Appointments by date range
   - Returns: { success, data: [{ _id, count, services[] }] }

6. GET /api/appointments/analytics/top-services?limit=5
   - Top N services by bookings
   - Returns: { success, data: [{ _id, count, lastBooked }] }

7. GET /api/appointments/analytics/slots-by-service?date=2026-05-15
   - Slots grouped by service
   - Returns: { success, date, data: [{ _id, slots[], count }] }
*/

// ─────────────────────────────────────────────────────────────
// PERFORMANCE TIPS
// ─────────────────────────────────────────────────────────────

/*
1. ALWAYS use pagination for user-facing lists
   - Use page/limit parameters
   - Avoid loading entire collection

2. Cache analytics results
   - Results don't change every second
   - Use 1-hour TTL for daily stats
   - Use 1-minute TTL for hourly stats

3. Index matters
   - Always filter by user_id first (matches compound index)
   - Date filters use indexes effectively
   - Combine frequently used filters

4. Monitor slow queries
   - Enable MongoDB profiling
   - Alert on queries > 100ms
   - Adjust indexes accordingly

5. Use aggregation for complex operations
   - Grouping
   - Complex sorting
   - Multi-stage filtering
   - Calculations across documents
*/

module.exports = {
  getAppointmentsList,
  searchByPatient,
  checkAvailableSlots,
  getDashboardStats,
  analyzeByStatus,
  getMonthlyBreakdown,
  getTopServices,
  getSlotsByService,
  getPaginationInfo,
  getAppointmentsWithCount,
};
