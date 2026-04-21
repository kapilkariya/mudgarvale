// @desc    Get public config values
// @route   GET /api/config
// @access  Public
const getPublicConfig = async (req, res) => {
  try {
    // Only expose non-sensitive values
    const config = {
      deliveryCharge: parseInt(process.env.DELIVERY_CHARGE) || 400,
      codAdvanceAmount: parseInt(process.env.COD_ADVANCE_AMOUNT) || 200,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
    };

    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get config',
    });
  }
};

module.exports = {
  getPublicConfig,
};
