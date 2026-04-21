const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['mudgar', 'gada', 'samtola', 'senaboard'],
        message: 'Category must be mudgar, gada, samtola, or senaboard',
      },
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    weights: [
      {
        type: String,
        required: true,
      },
    ],
    pricePerWeight: {
      type: Map,
      of: Number,
      required: [true, 'Price per weight is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to get minimum price for display
productSchema.virtual('minPrice').get(function () {
  const prices = Array.from(this.pricePerWeight.values());
  return prices.length > 0 ? Math.min(...prices) : 0;
});

// Virtual to get formatted price display
productSchema.virtual('priceDisplay').get(function () {
  const minPrice = this.minPrice;
  return `From Rs. ${minPrice.toLocaleString('en-IN')}`;
});

module.exports = mongoose.model('Product', productSchema);
