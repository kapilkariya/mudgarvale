const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  sendSignupOTP,
  verifySignup,
  sendLoginOTP,
  verifyLogin,
  getMe,
  logout,
} = require('../controllers/authController');

// Public routes
router.post('/send-signup-otp', sendSignupOTP);
router.post('/verify-signup', verifySignup);
router.post('/send-login-otp', sendLoginOTP);
router.post('/verify-login', verifyLogin);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
