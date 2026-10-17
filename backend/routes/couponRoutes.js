const express = require('express');
const { validateCoupon } = require('../controllers/couponController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/validate', validateCoupon);

module.exports = router;const express = require('express');
const { validateCoupon } = require('../controllers/couponController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/validate', validateCoupon);

module.exports = router;