const FAQ = require("../model/FAQ.model");
const asyncHandler = require("../utils/asyncHandler");

// ─────────────────────────────────────────
// GET /api/faqs
// Admin — get all FAQs for this clinic
// ─────────────────────────────────────────
exports.getAllFAQs = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id);

  const faqs = await FAQ.find({ user_id }).sort({ order: 1, createdAt: -1 });

  res.json({
    success: true,
    count: faqs.length,
    data: faqs,
  });
});

// ─────────────────────────────────────────
// GET /api/faqs/active
// Widget — get only active FAQs for AI prompt
// Called by Chat service with API key
// ─────────────────────────────────────────
exports.getActiveFAQs = asyncHandler(async (req, res) => {
  // user_id comes from API key middleware (req.user_id)
  const user_id = String(req.user_id);

  const faqs = await FAQ.find({ user_id, isActive: true })
    .select("question answer")
    .sort({ order: 1 });

  res.json({
    success: true,
    count: faqs.length,
    data: faqs,
  });
});

// ─────────────────────────────────────────
// GET /api/faqs/:id
// Admin — get single FAQ
// ─────────────────────────────────────────
exports.getFAQById = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id);

  const faq = await FAQ.findOne({ _id: req.params.id, user_id });

  if (!faq) {
    return res.status(404).json({ success: false, message: "FAQ not found" });
  }

  res.json({ success: true, data: faq });
});

// ─────────────────────────────────────────
// POST /api/faqs
// Admin — create single FAQ
// ─────────────────────────────────────────
exports.createFAQ = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id);
  const { question, answer, order } = req.body;

  if (!question || !answer) {
    return res.status(400).json({
      success: false,
      message: "Question and answer are required",
    });
  }

  // Check duplicate question for same clinic
  const duplicate = await FAQ.findOne({
    user_id,
    question: { $regex: new RegExp(`^${question}$`, "i") },
  });

  if (duplicate) {
    return res.status(409).json({
      success: false,
      message: "An FAQ with this question already exists",
    });
  }

  const faq = await FAQ.create({
    user_id,
    question,
    answer,
    order: order || 0,
  });

  res.status(201).json({
    success: true,
    message: "FAQ created successfully",
    data: faq,
  });
});

// ─────────────────────────────────────────
// POST /api/faqs/bulk
// Admin — create multiple FAQs at once
// Useful for initial setup
// ─────────────────────────────────────────
exports.createBulkFAQs = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id);
  const { faqs } = req.body;

  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
    return res.status(400).json({
      success: false,
      message: "faqs array is required and must not be empty",
    });
  }

  if (faqs.length > 50) {
    return res.status(400).json({
      success: false,
      message: "Maximum 50 FAQs allowed per bulk create",
    });
  }

  // Validate each FAQ
  for (const faq of faqs) {
    if (!faq.question || !faq.answer) {
      return res.status(400).json({
        success: false,
        message: "Each FAQ must have a question and answer",
      });
    }
  }

  // Add user_id to each FAQ
  const faqDocs = faqs.map((faq, index) => ({
    user_id,
    question: faq.question,
    answer: faq.answer,
    order: faq.order || index,
  }));

  // insertMany with ordered:false continues even if some fail
  const created = await FAQ.insertMany(faqDocs, { ordered: false });

  res.status(201).json({
    success: true,
    message: `${created.length} FAQs created successfully`,
    data: created,
  });
});

// ─────────────────────────────────────────
// PUT /api/faqs/:id
// Admin — update FAQ
// ─────────────────────────────────────────
exports.updateFAQ = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id);
  const { question, answer, isActive, order } = req.body;

  if (!question && !answer && isActive === undefined && order === undefined) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one field to update",
    });
  }

  const updateData = {};
  if (question  !== undefined) updateData.question  = question;
  if (answer    !== undefined) updateData.answer    = answer;
  if (isActive  !== undefined) updateData.isActive  = isActive;
  if (order     !== undefined) updateData.order     = order;

  const faq = await FAQ.findOneAndUpdate(
    { _id: req.params.id, user_id }, // scoped to this clinic only
    { $set: updateData },
    { returnDocument: 'after', runValidators: true }
  );

  if (!faq) {
    return res.status(404).json({ success: false, message: "FAQ not found" });
  }

  res.json({
    success: true,
    message: "FAQ updated successfully",
    data: faq,
  });
});

// ─────────────────────────────────────────
// DELETE /api/faqs/:id
// Admin — delete single FAQ
// ─────────────────────────────────────────
exports.deleteFAQ = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id);

  const faq = await FAQ.findOneAndDelete({ _id: req.params.id, user_id });

  if (!faq) {
    return res.status(404).json({ success: false, message: "FAQ not found" });
  }

  res.json({ success: true, message: "FAQ deleted successfully" });
});

// ─────────────────────────────────────────
// DELETE /api/faqs
// Admin — delete ALL FAQs for this clinic
// ─────────────────────────────────────────
exports.deleteAllFAQs = asyncHandler(async (req, res) => {
  const user_id = String(req.user.id);

  const result = await FAQ.deleteMany({ user_id });

  res.json({
    success: true,
    message: `${result.deletedCount} FAQs deleted`,
  });
});