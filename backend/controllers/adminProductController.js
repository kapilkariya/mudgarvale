const Product = require('../models/Product');

// @desc    Get all products (admin)
// @route   GET /api/admin/products
// @access  Private (Admin)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, weights, pricePerWeight, isActive } = req.body;

    // Find product
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (weights) product.weights = weights;
    if (pricePerWeight) product.pricePerWeight = pricePerWeight;
    if (typeof isActive === 'boolean') product.isActive = isActive;

    if (req.body.image && req.body.image !== product.image) {
      product.image = req.body.image;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete product
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};

// @desc    One-off dev rename: Indian Hanuman Gada Model: 10 → Indian Ram Gada Model: 10
// @route   POST /api/admin/dev/rename-product
// @access  Private (Admin)
// @desc    Dev: add default lengthPerWeight to gada products missing it
// @route   POST /api/admin/dev/rename-product
// @access  Private (Admin)
// @desc    Dev: add default lengthPerWeight to all mudgar products
// @route   POST /api/admin/dev/rename-product
// @access  Private (Admin)
const devRenameProduct = async (req, res) => {
  try {
    const details = [];

    // --- 1. Rename Yoga Block Set + fix weights/price ---
    const renameResult = await Product.updateOne(
      { name: 'Yoga Block Set' },
      {
        $set: {
          name: 'Yoga Block (Brick) Set of 2',
          weights: ['1'],
          pricePerWeight: { '1': 700 },
        },
      }
    );

    if (renameResult.matchedCount === 0) {
      details.push({ name: 'Yoga Block Set', status: 'not found' });
    } else {
      details.push({
        name: 'Yoga Block Set',
        status: 'updated',
        modified: renameResult.modifiedCount,
      });
    }

    // --- 2. Update gada prices to 400/kg (exclude specific names) ---
    const excludedNames = [
      'Indian Bheem Gada Model: 13',
      'Indian Hanuman Gada Model: 2',
      'Indian Ram Gada Model: 10',
      'Angad Gada',
    ];

    const gadaProducts = await Product.find({
      category: 'gada',
      name: { $nin: excludedNames },
    });

    let gadaModified = 0;

    for (const product of gadaProducts) {
      const newPricePerWeight = {};
      for (const weight of product.weights) {
        const kg = Number(weight);
        newPricePerWeight[weight] = kg * 400;
      }

      const res = await Product.updateOne(
        { _id: product._id },
        { $set: { pricePerWeight: newPricePerWeight } }
      );

      gadaModified += res.modifiedCount;
    }

    details.push({
      gada: true,
      matched: gadaProducts.length,
      modified: gadaModified,
      excluded: excludedNames,
    });

    return res.status(200).json({
      success: true,
      message: 'Dev updates applied',
      details,
    });
  } catch (error) {
    console.error('Dev update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update products',
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  updateProduct,
  deleteProduct,
  devRenameProduct,
};