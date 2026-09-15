const mongoose = require('mongoose');

// Reuse the same cart item sub-shape used by Cart model
const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    selectedWeight: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    category: { type: String, default: '' },
  },
  { _id: false }
);

// Store the address object as-is (no new address structure)
const addressSnapshotSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    phone2: { type: String, default: '' },
    buildingFlatNo: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
  },
  { _id: false, strict: false } // strict:false so ANY extra address fields survive
);

const checkoutSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // ✅ Only ONE active session per user
    },
    address: {
      type: addressSnapshotSchema,
      required: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

checkoutSessionSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('CheckoutSession', checkoutSessionSchema);