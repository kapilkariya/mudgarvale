const User = require('../models/User');
const OTP = require('../models/OTP');
const { generateOTP, sendOTPEmail } = require('../utils/email');
const { sendTokenResponse } = require('../utils/jwt');

// @desc    Send OTP for signup
// @route   POST /api/auth/send-signup-otp
// @access  Public
const sendSignupOTP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email, purpose: 'signup' });

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database with user data
    await OTP.create({
      email,
      otp,
      purpose: 'signup',
      userData: { name, password },
    });

    // Send OTP email
    await sendOTPEmail(email, otp, 'signup');

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
    });
  } catch (error) {
    console.error('Send signup OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
    });
  }
};

// @desc    Verify OTP and complete signup
// @route   POST /api/auth/verify-signup
// @access  Public
const verifySignup = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email,
      otp,
      purpose: 'signup',
      isUsed: false,
      expiresAt: { $gt: Date.now() },
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Determine role based on admin email
    const isAdmin = email === process.env.ADMIN_EMAIL;

    // Create user
    const user = await User.create({
      name: otpRecord.userData.name,
      email,
      password: otpRecord.userData.password,
      role: isAdmin ? 'admin' : 'user',
      isVerified: true,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Verify signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Signup verification failed',
    });
  }
};

// @desc    Send OTP for login
// @route   POST /api/auth/send-login-otp
// @access  Public
const sendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'No account found with this email',
      });
    }

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email, purpose: 'login' });

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database
    await OTP.create({
      email,
      otp,
      purpose: 'login',
    });

    // Send OTP email
    await sendOTPEmail(email, otp, 'login');

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
    });
  } catch (error) {
    console.error('Send login OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
    });
  }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-login
// @access  Public
const verifyLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email,
      otp,
      purpose: 'login',
      isUsed: false,
      expiresAt: { $gt: Date.now() },
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Get user
    const user = await User.findOne({ email });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Verify login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login verification failed',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user details',
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

module.exports = {
  sendSignupOTP,
  verifySignup,
  sendLoginOTP,
  verifyLogin,
  getMe,
  logout,
};
