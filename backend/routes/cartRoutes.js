const express = require('express');
const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  syncCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All cart routes are protected
router.use(protect);

router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.route('/sync')
  .post(syncCart);

router.route('/:itemId')
  .put(updateQuantity)
  .delete(removeFromCart);

module.exports = router;
