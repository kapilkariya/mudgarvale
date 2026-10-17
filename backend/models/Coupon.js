const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    type: {
      type: String,
      required: [true, 'Discount type is required'],
      enum: {
        values: ['percent', 'flat'],
        message: 'Discount type must be percent or flat',
      },
    },
    value: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isListed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);