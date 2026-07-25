const Product = require('../models/Product');

// @desc    Create new product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, category, weights, pricePerWeight, image } = req.body;

    // Parse weights and pricePerWeight if sent as JSON strings
    const parsedWeights = typeof weights === 'string' ? JSON.parse(weights) : weights;
    const parsedPricePerWeight = typeof pricePerWeight === 'string' ? JSON.parse(pricePerWeight) : pricePerWeight;

    // Validate category
    const allowedCategories = ['mudgar', 'gada', 'samtola', 'senaboard'];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be one of: mudgar, gada, samtola, senaboard',
      });
    }

    if (!image || !String(image).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product image filename is required',
      });
    }

    const product = await Product.create({
      name,
      description,
      category,
      image: String(image).trim(),
      weights: parsedWeights,
      pricePerWeight: parsedPricePerWeight,
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
    const { category, search, minPrice, maxPrice } = req.query;
    let query = { isActive: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
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

    // Parse JSON fields if needed
    if (updateData.weights && typeof updateData.weights === 'string') {
      updateData.weights = JSON.parse(updateData.weights);
    }
    if (updateData.pricePerWeight && typeof updateData.pricePerWeight === 'string') {
      updateData.pricePerWeight = JSON.parse(updateData.pricePerWeight);
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

    // Instead of hard delete, mark as inactive (soft delete)
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
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
    const allowedCategories = ['mudgar', 'gada', 'samtola', 'senaboard'];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category',
      });
    }

    const products = await Product.find({
      category,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
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
