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
        values: ['mudgar', 'gada', 'samtola', 'senaboard', 'sticks'],
        message: 'Category must be mudgar, gada, samtola, senaboard, or sticks',
      },
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    image2: {
      type: String,
      required: false,
      default: null,
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
    isSpecial: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ Bulletproof virtual — handles Map, plain object, or malformed data
// Never throws, so a bad product can't crash the whole listing endpoint.
productSchema.virtual('minPrice').get(function () {
  try {
    if (!this.pricePerWeight) return 0;

    // Mongoose Map has .values(), plain objects don't
    const rawValues =
      typeof this.pricePerWeight.values === 'function'
        ? Array.from(this.pricePerWeight.values())
        : Object.values(this.pricePerWeight);

    const nums = rawValues
      .map((v) => Number(v))
      .filter((n) => Number.isFinite(n));

    return nums.length > 0 ? Math.min(...nums) : 0;
  } catch (err) {
    // Log once so you know which product is bad, but don't crash
    console.warn(
      `[Product] minPrice virtual failed for product ${this._id}:`,
      err.message
    );
    return 0;
  }
});

// ✅ Bulletproof priceDisplay — same reasoning
productSchema.virtual('priceDisplay').get(function () {
  try {
    const minPrice = this.minPrice;
    return `From Rs. ${Number(minPrice || 0).toLocaleString('en-IN')}`;
  } catch {
    return 'From Rs. 0';
  }
});

module.exports = mongoose.model('Product', productSchema);