const express = require('express');
const {
  createOrder,
  verifyPayment,
  cancelPendingOrder,
  getMyOrders,
  getOrderById,
} = require('../controllers/orderController');
const { validateCoupon, getListedCoupons } = require('../controllers/couponController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').post(createOrder);
router.route('/verify-payment').post(verifyPayment);
router.route('/cancel-pending').post(cancelPendingOrder);
router.route('/my-orders').get(getMyOrders);

// Coupon endpoints (checkout page)
router.route('/validate-coupon').post(validateCoupon);
router.route('/listed-coupons').get(getListedCoupons);

router.route('/:id').get(getOrderById);

module.exports = router;