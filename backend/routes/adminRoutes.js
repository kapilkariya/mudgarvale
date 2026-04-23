const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/adminProductController');
const {
  getAllOrders,
  updateOrderStatus,
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
router.get('/orders', getAllOrders);
router.get('/orders/stats', getOrderStats);
router.patch('/orders/:id/status', updateOrderStatus);

module.exports = router;
