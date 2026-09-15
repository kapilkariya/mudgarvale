const Product = require('../models/Product');

// Helper: normalize pricePerWeight to a plain object with string keys & number values
const normalizePricePerWeight = (raw) => {
  const out = {};
  if (!raw || typeof raw !== 'object') return out;

  // Handle Map
  if (typeof raw.entries === 'function' && typeof raw.get === 'function') {
    for (const [k, v] of raw.entries()) {
      const key = String(k).trim();
      const num = Number(v);
      if (key && Number.isFinite(num)) out[key] = num;
    }
    return out;
  }

  // Handle plain object
  for (const [k, v] of Object.entries(raw)) {
    const key = String(k).trim();
    const num = Number(v);
    if (key && Number.isFinite(num)) out[key] = num;
  }
  return out;
};

// Helper: attach computed virtuals to a lean product object
const attachVirtuals = (product) => {
  const priceMap = normalizePricePerWeight(product.pricePerWeight);
  const prices = Object.values(priceMap);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

  return {
    ...product,
    pricePerWeight: priceMap,
    weights: Array.isArray(product.weights) ? product.weights.map(String) : [],
    minPrice,
    priceDisplay: `From Rs. ${minPrice.toLocaleString('en-IN')}`,
  };
};

// @desc    Create new product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, category, weights, pricePerWeight, image } = req.body;

    const parsedWeights = typeof weights === 'string' ? JSON.parse(weights) : weights;
    const parsedPricePerWeight = typeof pricePerWeight === 'string' ? JSON.parse(pricePerWeight) : pricePerWeight;

    const allowedCategories = ['mudgar', 'gada', 'samtola', 'senaboard', 'sticks'];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be one of: mudgar, gada, samtola, senaboard, sticks',
      });
    }

    if (!image || !String(image).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product image filename is required',
      });
    }

    const normalizedWeights = Array.isArray(parsedWeights)
      ? parsedWeights.map((w) => String(w).trim()).filter(Boolean)
      : [];

    const normalizedPricePerWeight = normalizePricePerWeight(parsedPricePerWeight);

    const product = await Product.create({
      name,
      description,
      category,
      image: String(image).trim(),
      weights: normalizedWeights,
      pricePerWeight: normalizedPricePerWeight,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product',
    });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    // .lean() returns plain objects — Maps become plain objects automatically
    const products = await Product.find(query).sort({ createdAt: -1 }).lean();

    const safeProducts = products.map(attachVirtuals);

    res.status(200).json({
      success: true,
      count: safeProducts.length,
      data: safeProducts,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const safeProduct = attachVirtuals(product);

    res.status(200).json({
      success: true,
      data: safeProduct,
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    });
  }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const updateData = { ...req.body };

    if (updateData.weights && typeof updateData.weights === 'string') {
      updateData.weights = JSON.parse(updateData.weights);
    }
    if (updateData.pricePerWeight && typeof updateData.pricePerWeight === 'string') {
      updateData.pricePerWeight = JSON.parse(updateData.pricePerWeight);
    }

    if (Array.isArray(updateData.weights)) {
      updateData.weights = updateData.weights.map((w) => String(w).trim()).filter(Boolean);
    }

    if (updateData.pricePerWeight && typeof updateData.pricePerWeight === 'object') {
      updateData.pricePerWeight = normalizePricePerWeight(updateData.pricePerWeight);
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update product',
    });
  }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const allowedCategories = ['mudgar', 'gada', 'samtola', 'senaboard', 'sticks'];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category',
      });
    }

    const products = await Product.find({ category, isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    const safeProducts = products.map(attachVirtuals);

    res.status(200).json({
      success: true,
      count: safeProducts.length,
      data: safeProducts,
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
};