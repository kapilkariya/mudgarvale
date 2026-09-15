const express = require('express');
const {
  upsertCheckoutSession,
  getCheckoutSession,
} = require('../controllers/checkoutSessionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getCheckoutSession)
  .post(upsertCheckoutSession);

module.exports = router;