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

    // --- 1. Rename Traditional Mudgar Model: 13 ---
    const mudgarOldName = 'Traditional Mudgar Model: 13';
    const mudgarNewName = 'Traditional Indian Club Mudgar Model: 13';

    const mudgarResult = await Product.updateOne(
      { name: mudgarOldName },
      { $set: { name: mudgarNewName } }
    );

    if (mudgarResult.matchedCount === 0) {
      details.push({ name: mudgarOldName, status: 'not found' });
    } else {
      details.push({
        name: mudgarOldName,
        status: 'renamed',
        newName: mudgarNewName,
        modified: mudgarResult.modifiedCount,
      });
    }

    // --- 2. Update Yoga Mat weights + prices ---
    const yogaMatName = 'Yoga Mat';

    const yogaMatResult = await Product.updateOne(
      { name: yogaMatName },
      {
        $set: {
          weights: ['4', '6', '8', '10'],
          pricePerWeight: {
            '4': 849,
            '6': 1099,
            '8': 1249,
            '10': 1349,
          },
        },
      }
    );

    if (yogaMatResult.matchedCount === 0) {
      details.push({ name: yogaMatName, status: 'not found' });
    } else {
      details.push({
        name: yogaMatName,
        status: 'updated',
        modified: yogaMatResult.modifiedCount,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Dev update applied',
      details,
    });
  } catch (error) {
    console.error('Dev update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
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