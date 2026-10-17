const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAllProducts,
  updateProduct,
  deleteProduct,
  devRenameProduct,
} = require('../controllers/adminProductController');
const {
  getAllOrders,
  getOrdersPaginated,
  getOrdersByDateRange,
  updateOrder,
  updateOrderStatus,
  bulkUpdateOrderStatus,
  previewBulkUpdateOrderStatus,
  getOrderStats,
} = require('../controllers/adminOrderController');
const {
  getCheckoutSessions,
  placeOrderFromSession,
} = require('../controllers/adminCheckoutSessionController');
const {
  getCoupons,
  createCoupon,
  deleteCoupon,
  toggleCouponListed,
} = require('../controllers/couponController');

const router = express.Router();

router.use(protect);
router.use(adminOnly);

// Product management
router.get('/products', getAllProducts);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/dev/rename-product', devRenameProduct);

// Order management
router.get('/orders', getAllOrders);
router.get('/orders/paginated', getOrdersPaginated);
router.get('/orders/date-range', getOrdersByDateRange);
router.get('/orders/stats', getOrderStats);

router.patch('/orders/bulk-status', bulkUpdateOrderStatus);
router.get('/orders/bulk-status/preview', previewBulkUpdateOrderStatus);

router.put('/orders/:id', updateOrder);
router.patch('/orders/:id/status', updateOrderStatus);

// Checkout sessions
router.get('/checkout-sessions', getCheckoutSessions);
router.post('/checkout-sessions/:id/place-order', placeOrderFromSession);

// Coupon management
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.delete('/coupons/:id', deleteCoupon);
router.patch('/coupons/:id/list', toggleCouponListed);

module.exports = router;