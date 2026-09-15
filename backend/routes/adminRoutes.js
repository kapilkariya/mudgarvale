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
  bulkUpdateOrderStatus,          // ✅ NEW
  previewBulkUpdateOrderStatus,   // ✅ NEW
  getOrderStats,
} = require('../controllers/adminOrderController');

const router = express.Router();

// All routes are protected and require admin access
router.use(protect);
router.use(adminOnly);

// Product management routes
router.get('/products', getAllProducts);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Order management routes
router.get('/orders', getAllOrders);                     // Original
router.get('/orders/paginated', getOrdersPaginated);     // Paginated
router.get('/orders/date-range', getOrdersByDateRange);  // Date range filter
router.get('/orders/stats', getOrderStats);              // Stats

// ⚠️ Bulk routes MUST come BEFORE '/orders/:id' routes
// Otherwise Express treats "bulk-status" as an :id value
router.patch('/orders/bulk-status', bulkUpdateOrderStatus);           // ✅ NEW
router.get('/orders/bulk-status/preview', previewBulkUpdateOrderStatus); // ✅ NEW

// Single-order routes (with :id param) — must come LAST
router.put('/orders/:id', updateOrder);
router.patch('/orders/:id/status', updateOrderStatus);

module.exports = router;