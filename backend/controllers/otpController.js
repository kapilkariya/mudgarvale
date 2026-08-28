const axios = require('axios');

// In-memory OTP storage - store session IDs for verification (in production, use Redis or database)
const otpStore = new Map();

// @desc    Send OTP to mobile number
// @route   POST /api/otp/send
// @access  Private
const sendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;

    // Validate mobile number
    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile number. Must be 10 digits.',
      });
    }

    // 2Factor.in API configuration
    const apiKey = process.env.SMS_API;

    // Check if API credentials are configured
    if (!apiKey) {
      console.warn('SMS_API key missing - using development mode (OTP will be logged to console)');
      
      // Generate a random 6-digit OTP for development mode
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`DEV MODE OTP for ${mobile}: ${otp}`);
      
      // In development mode, still store the OTP and return success
      const expiryTime = Date.now() + 15 * 60 * 1000;
      otpStore.set(mobile, {
        otp: otp,
        expiry: expiryTime,
        attempts: 0,
      });

      return res.status(200).json({
        success: true,
        message: 'OTP sent successfully (development mode)',
        devMode: true,
      });
    }

    // Call 2Factor.in API to send OTP
    try {
      console.log(`Sending OTP via 2Factor.in to: ${mobile}`);
      
      // 2Factor.in expects phone number with country code (91 for India)
      const phoneNumberWithCountryCode = `91${mobile}`;
      
      const response = await axios.get(
        `https://2factor.in/API/V1/${apiKey}/SMS/${phoneNumberWithCountryCode}/AUTOGEN`
      );

      console.log('2Factor.in API response:', response.data);

      if (response.data.Status !== 'Success') {
        console.error('2Factor.in API error:', response.data);
        return res.status(400).json({
          success: false,
          message: response.data.Details || 'Failed to send OTP',
        });
      }

      // Store the session ID for verification (2Factor.in returns session ID)
      const sessionId = response.data.Details;
      const expiryTime = Date.now() + 15 * 60 * 1000;
      
      otpStore.set(mobile, {
        sessionId: sessionId,
        expiry: expiryTime,
        attempts: 0,
      });

      console.log(`OTP sent successfully to ${mobile}, Session ID: ${sessionId}`);

      res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
      });
    } catch (apiError) {
      console.error('2Factor.in API call failed:', apiError.response?.data || apiError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to connect to SMS service',
        error: apiError.message,
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message,
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/otp/verify
// @access  Private
const verifyOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    // Validate input
    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number and OTP are required',
      });
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile number. Must be 10 digits.',
      });
    }

    // Check if session exists for this mobile
    const storedData = otpStore.get(mobile);
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired. Please request a new OTP.',
      });
    }

    // Check if session has expired
    if (Date.now() > storedData.expiry) {
      otpStore.delete(mobile);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.',
      });
    }

    // Check if maximum attempts reached (3 attempts)
    if (storedData.attempts >= 3) {
      otpStore.delete(mobile);
      return res.status(400).json({
        success: false,
        message: 'Maximum OTP attempts reached. Please request a new OTP.',
      });
    }

    const apiKey = process.env.SMS_API;

    // If API key is missing (development mode), verify locally
    if (!apiKey) {
      // In development mode, verify against stored OTP
      if (storedData.otp !== otp) {
        storedData.attempts += 1;
        otpStore.set(mobile, storedData);
        
        const remainingAttempts = 3 - storedData.attempts;
        return res.status(400).json({
          success: false,
          message: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
        });
      }

      // OTP verified successfully - remove from store
      otpStore.delete(mobile);
      console.log(`OTP verified successfully for ${mobile} (development mode)`);

      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
      });
    }

    // Call 2Factor.in API to verify OTP
    try {
      console.log(`Verifying OTP via 2Factor.in for: ${mobile}, Session ID: ${storedData.sessionId}`);
      
      const response = await axios.get(
        `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${storedData.sessionId}/${otp}`
      );

      console.log('2Factor.in verification response:', response.data);

      if (response.data.Status !== 'Success') {
        storedData.attempts += 1;
        otpStore.set(mobile, storedData);
        
        const remainingAttempts = 3 - storedData.attempts;
        return res.status(400).json({
          success: false,
          message: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
        });
      }

      // OTP verified successfully - remove from store
      otpStore.delete(mobile);
      console.log(`OTP verified successfully for ${mobile}`);

      res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
      });
    } catch (apiError) {
      console.error('2Factor.in verification call failed:', apiError.response?.data || apiError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify OTP',
        error: apiError.message,
      });
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message,
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};
