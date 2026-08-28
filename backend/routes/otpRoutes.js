const express = require('express');
const { sendOTP, verifyOTP } = require('../controllers/otpController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All OTP routes are protected (require login)
router.use(protect);

// @route   POST /api/otp/send
// @desc    Send OTP to mobile number
// @access  Private
router.route('/send')
  .post(sendOTP);

// @route   POST /api/otp/verify
// @desc    Verify OTP
// @access  Private
router.route('/verify')
  .post(verifyOTP);

module.exports = router;
