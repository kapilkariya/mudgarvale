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

    // --- 1. Add / Update Yoga Mat + Yoga Block Combo ---
    const comboName = 'Yoga Mat + Yoga Block (Set of 2) Combo';

    const comboData = {
      name: comboName,
      description:
        'Get the perfect workout combination with a premium ribbed yoga mat and a set of 2 high-density EVA foam yoga blocks. The textured mat provides grip and cushioning, while the blocks offer stability, balance, and support during yoga poses, stretching, and flexibility exercises. Ideal for home workouts, gyms, and yoga studios.',
      category: 'yoga',
      image: 'yogacombo',
      images: [
        'yogamat_2',
        'yogablock1_2',
        'yogablock1_3',
        'yogablock1_5',
      ],
      weights: ['4', '6', '8'],
      pricePerWeight: {
        '4': 1449,
        '6': 1699,
        '8': 1849,
      },
      lengthPerWeight: {},
      isActive: true,
      isSpecial: false,
    };

    const existingCombo = await Product.findOne({ name: comboName });

    if (existingCombo) {
      const updated = await Product.updateOne(
        { _id: existingCombo._id },
        { $set: comboData }
      );

      details.push({
        name: comboName,
        status: 'updated',
        modified: updated.modifiedCount,
        id: existingCombo._id,
      });
    } else {
      const combo = await Product.create(comboData);

      details.push({
        name: comboName,
        status: 'created',
        id: combo._id,
      });
    }

    // --- 2. Add / Update Premium Cobra Sort Danda ---
    const dandaName = 'Premium Cobra Sort Danda';

    const dandaData = {
      name: dandaName,
      description:
        'Premium Cobra Sort Danda crafted from strong, high-quality natural wood with a durable and sturdy design. Suitable for traditional training, practice, and fitness activities. Designed for comfortable handling and regular use, making it a practical choice for training centers, akhadas, and personal practice.',
      category: 'sticks',
      image: 'stick5',
      images: [
        'stick5_2',
        'stick5_3',
        'stick5_4',
      ],
      weights: ['3'],
      pricePerWeight: {
        '3': 350,
      },
      isActive: true,
      isSpecial: false,
    };

    const existingDanda = await Product.findOne({ name: dandaName });

    if (existingDanda) {
      const updated = await Product.updateOne(
        { _id: existingDanda._id },
        { $set: dandaData }
      );

      details.push({
        name: dandaName,
        status: 'updated',
        modified: updated.modifiedCount,
        id: existingDanda._id,
      });
    } else {
      const danda = await Product.create(dandaData);

      details.push({
        name: dandaName,
        status: 'created',
        id: danda._id,
      });
    }

    // --- 3. Update Tar Sort Danda price to 350 ---
    const tarName = 'Tar Sort Danda';

    const tarResult = await Product.updateOne(
      { name: tarName },
      { $set: { pricePerWeight: { '3': 350 } } }
    );

    if (tarResult.matchedCount === 0) {
      details.push({ name: tarName, status: 'not found' });
    } else {
      details.push({
        name: tarName,
        status: 'updated',
        modified: tarResult.modifiedCount,
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