const CheckoutSession = require('../models/CheckoutSession');

// @desc    Create or update the current user's CheckoutSession
// @route   POST /api/checkout-session
// @access  Private
const upsertCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, items, totalAmount } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required',
      });
    }

    const session = await CheckoutSession.findOneAndUpdate(
      { userId },
      {
        userId,
        address,
        items: Array.isArray(items) ? items : [],
        totalAmount: Number(totalAmount) || 0,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Checkout session saved',
      data: session,
    });
  } catch (error) {
    console.error('Upsert checkout session error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save checkout session',
    });
  }
};

// @desc    Get current user's CheckoutSession
// @route   GET /api/checkout-session
// @access  Private
const getCheckoutSession = async (req, res) => {
  try {
    const session = await CheckoutSession.findOne({ userId: req.user.id });
    return res.status(200).json({
      success: true,
      data: session || null,
    });
  } catch (error) {
    console.error('Get checkout session error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch checkout session',
    });
  }
};

module.exports = {
  upsertCheckoutSession,
  getCheckoutSession,
};