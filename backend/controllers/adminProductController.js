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
    const yogaProducts = [
      {
        name: 'Yoga Block Set',
        description:
          'Improve your yoga practice with this premium teal blue yoga block set, made from high-density EVA foam for durability, stability, and comfortable support. The lightweight blocks feature a smooth, firm surface that helps improve balance, flexibility, and posture during yoga poses and stretching exercises. Suitable for beginners and experienced practitioners at home, gyms, and yoga studios.',
        category: 'yoga',
        image: 'yogablock1',
        weights: ['2', '4'],
        pricePerWeight: { '2': 400, '4': 700 },
        isActive: true,
        isSpecial: false,
      },
      {
        name: 'Yoga Mat',
        description:
          'Enhance your yoga and fitness routine with this premium green yoga mat, designed with a textured, ribbed surface for improved grip and comfort. Its cushioned design supports yoga poses, stretching, meditation, and everyday floor workouts. Suitable for home workouts, gyms, yoga studios, and regular fitness practice.',
        category: 'yoga',
        image: 'yogamat1',
        weights: ['4', '8', '10'],
        pricePerWeight: { '4': 700, '8': 1200, '10': 1700 },
        isActive: true,
        isSpecial: false,
      },
    ];

    let created = 0;
    let skipped = 0;

    for (const p of yogaProducts) {
      const existing = await Product.findOne({ name: p.name });
      if (existing) {
        skipped++;
        continue;
      }
      await Product.create(p);
      created++;
    }

    return res.status(200).json({
      success: true,
      message: `Created ${created} yoga product(s), skipped ${skipped} existing`,
    });
  } catch (error) {
    console.error('Dev add yoga products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add yoga products',
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