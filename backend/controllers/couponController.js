const Coupon = require('../models/Coupon');

// @desc    List all coupons (admin)
// @route   GET /api/admin/coupons
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, count: coupons.length, data: coupons });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch coupons', error: error.message });
  }
};

// @desc    Create a coupon (admin)
// @route   POST /api/admin/coupons
const createCoupon = async (req, res) => {
  try {
    const { code, type, value, description, isActive, isListed } = req.body;

    if (!code || !type || value === undefined) {
      return res.status(400).json({ success: false, message: 'code, type and value are required' });
    }
    if (!['percent', 'flat'].includes(type)) {
      return res.status(400).json({ success: false, message: 'type must be percent or flat' });
    }
    const numValue = Number(value);
    if (!Number.isFinite(numValue) || numValue < 0) {
      return res.status(400).json({ success: false, message: 'value must be a non-negative number' });
    }
    if (type === 'percent' && numValue > 100) {
      return res.status(400).json({ success: false, message: 'Percent discount cannot exceed 100' });
    }

    const cleanCode = String(code).trim().toUpperCase();

    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: cleanCode,
      type,
      value: numValue,
      description: typeof description === 'string' ? description.trim() : '',
      isActive: isActive !== false,
      isListed: isListed === true,
    });

    res.status(201).json({ success: true, message: 'Coupon created', data: coupon });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ success: false, message: 'Failed to create coupon', error: error.message });
  }
};

// @desc    Delete a coupon (admin)
// @route   DELETE /api/admin/coupons/:id
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.status(200).json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete coupon', error: error.message });
  }
};

// @desc    Toggle isListed (admin)
// @route   PATCH /api/admin/coupons/:id/list
const toggleCouponListed = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    coupon.isListed = !coupon.isListed;
    await coupon.save();

    res.status(200).json({
      success: true,
      message: `Coupon ${coupon.isListed ? 'shown on' : 'hidden from'} checkout`,
      data: coupon,
    });
  } catch (error) {
    console.error('Toggle coupon listed error:', error);
    res.status(500).json({ success: false, message: 'Failed to update coupon', error: error.message });
  }
};

// @desc    Validate a coupon against a subtotal (checkout)
// @route   POST /api/orders/validate-coupon
const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const cleanCode = String(code).trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: cleanCode });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }
    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: 'This coupon is no longer active' });
    }

    const sub = Number(subtotal);
    if (!Number.isFinite(sub) || sub < 0) {
      return res.status(400).json({ success: false, message: 'Invalid subtotal' });
    }

    const { discountAmount, finalSubtotal } = computeDiscount(coupon, sub);

    if (discountAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Coupon gives no discount on this order' });
    }

    res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description || '',
        discountAmount,
        finalSubtotal,
      },
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ success: false, message: 'Failed to validate coupon', error: error.message });
  }
};

// @desc    List coupons that should appear on checkout (active + isListed)
// @route   GET /api/orders/listed-coupons
const getListedCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true, isListed: true })
      .select('code type value description')
      .lean();

    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    console.error('Get listed coupons error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch coupons', error: error.message });
  }
};

// Shared helper — returns { discountAmount, finalSubtotal }
const computeDiscount = (coupon, subtotal) => {
  let discountAmount = 0;

  if (coupon.type === 'percent') {
    discountAmount = Math.round((subtotal * coupon.value) / 100);
  } else if (coupon.type === 'flat') {
    discountAmount = coupon.value;
  }

  discountAmount = Math.min(discountAmount, subtotal);
  discountAmount = Math.max(discountAmount, 0);

  return {
    discountAmount,
    finalSubtotal: subtotal - discountAmount,
  };
};

module.exports = {
  getCoupons,
  createCoupon,
  deleteCoupon,
  toggleCouponListed,
  validateCoupon,
  getListedCoupons,
  computeDiscount,
};