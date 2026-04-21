const express = require('express');
const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All order routes are protected (require login)
router.use(protect);

router.route('/')
  .post(createOrder);

router.route('/verify-payment')
  .post(verifyPayment);

router.route('/my-orders')
  .get(getMyOrders);

router.route('/:id')
  .get(getOrderById);

module.exports = router;
