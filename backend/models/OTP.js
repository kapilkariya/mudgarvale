const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['signup', 'login', 'reset_password'],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: function () {
        return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      },
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    userData: {
      // Store temporary user data for signup
      name: String,
      password: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index to auto-delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', otpSchema);
