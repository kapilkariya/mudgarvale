const CheckoutSession = require('../models/CheckoutSession');

// @desc    Get paginated checkout sessions (optional date range filter on updatedAt)
// @route   GET /api/admin/checkout-sessions?page=1&limit=20&from=YYYY-MM-DD&to=YYYY-MM-DD
// @access  Private/Admin
const getCheckoutSessions = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 15));
    const skip = (page - 1) * limit;

    // ✅ On the first page load, purge sessions with 0 items
    if (page === 1) {
      await CheckoutSession.deleteMany({ 'items.0': { $exists: false } });
    }

    // Build optional date-range filter on updatedAt
    const query = {};
    const { from, to } = req.query;

    if (from || to) {
      query.updatedAt = {};
      if (from) {
        const fromDate = new Date(from);
        fromDate.setHours(0, 0, 0, 0);
        query.updatedAt.$gte = fromDate;
      }
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        query.updatedAt.$lte = toDate;
      }
      if (Object.keys(query.updatedAt).length === 0) {
        delete query.updatedAt;
      }
    }

    const total = await CheckoutSession.countDocuments(query);

    const sessions = await CheckoutSession.find(query)
      .populate('userId', 'name email phone')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const hasMore = skip + sessions.length < total;

    res.status(200).json({
      success: true,
      data: sessions,
      page,
      hasMore,
      total,
    });
  } catch (error) {
    console.error('Get checkout sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch checkout sessions',
    });
  }
};

module.exports = {
  getCheckoutSessions,
};