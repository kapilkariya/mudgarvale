const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAllProducts,
  updateProduct,
  deleteProduct,
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

const router = express.Router();

// All routes are protected and require admin access
router.use(protect);
router.use(adminOnly);

// Product management routes
router.get('/products', getAllProducts);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Order management routes
router.get('/orders', getAllOrders);
router.get('/orders/paginated', getOrdersPaginated);
router.get('/orders/date-range', getOrdersByDateRange);
router.get('/orders/stats', getOrderStats);

// ⚠️ Bulk routes MUST come BEFORE '/orders/:id' routes
router.patch('/orders/bulk-status', bulkUpdateOrderStatus);
router.get('/orders/bulk-status/preview', previewBulkUpdateOrderStatus);

// Single-order routes (with :id param) — must come LAST
router.put('/orders/:id', updateOrder);
router.patch('/orders/:id/status', updateOrderStatus);

// ✅ Checkout sessions (admin view + place-order action)
router.get('/checkout-sessions', getCheckoutSessions);
router.post('/checkout-sessions/:id/place-order', placeOrderFromSession);

module.exports = router;