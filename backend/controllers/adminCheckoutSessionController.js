const CheckoutSession = require('../models/CheckoutSession');
const Order = require('../models/Order');

// @desc    Get paginated checkout sessions (optional date range filter on updatedAt)
// @route   GET /api/admin/checkout-sessions?page=1&limit=20&from=YYYY-MM-DD&to=YYYY-MM-DD
// @access  Private/Admin
const getCheckoutSessions = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 15));
    const skip = (page - 1) * limit;

    // On the first page load, purge sessions with 0 items
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

// @desc    Convert a checkout session into a real order, then delete the session
// @route   POST /api/admin/checkout-sessions/:id/place-order
// @access  Private/Admin
const placeOrderFromSession = async (req, res) => {
  try {
    const { paymentType } = req.body || {};

    if (!['cod', 'paid'].includes(paymentType)) {
      return res.status(400).json({
        success: false,
        message: 'paymentType must be "cod" or "paid"',
      });
    }

    const session = await CheckoutSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Checkout session not found',
      });
    }

    const items = session.items || [];
    if (!items.length) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Cannot place an order.',
      });
    }

    // Subtotal from items
    const subtotal = items.reduce(
      (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0),
      0
    );

    // Total is what the session already had stored
    const totalAmount = Number(session.totalAmount) || subtotal;

    // Delivery charge is derived — never entered manually
    const deliveryCharge = Math.max(totalAmount - subtotal, 0);

    let paymentStatus;
    let paidAmount;
    let remainingAmount;

    if (paymentType === 'cod') {
      // COD: delivery charge was collected upfront as advance
      paymentStatus = 'partial_paid';
      paidAmount = deliveryCharge;
      remainingAmount = Math.max(totalAmount - deliveryCharge, 0);
    } else {
      // Fully paid
      paymentStatus = 'paid';
      paidAmount = totalAmount;
      remainingAmount = 0;
    }

    const order = await Order.create({
      userId: session.userId,
      items,
      totalAmount,
      deliveryCharge,
      paymentMethod: paymentType === 'cod' ? 'cod' : 'online',
      paymentStatus,
      orderStatus: 'confirmed',
      address: session.address,
      freeGift: session.freeGift || 0,
      paidAmount,
      remainingAmount,
    });

    await CheckoutSession.deleteOne({ _id: session._id });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    console.error('Place order from session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place order from session',
      error: error.message,
    });
  }
};

module.exports = {
  getCheckoutSessions,
  placeOrderFromSession,
};