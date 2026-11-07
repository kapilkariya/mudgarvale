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

    // Helper: create product if name doesn't exist
    const addProduct = async (data, pricePerWeight) => {
      const existing = await Product.findOne({ name: data.name });

      if (existing) {
        details.push({ name: data.name, status: 'already exists' });
        return;
      }

      const product = await Product.create({
        ...data,
        pricePerWeight,
        lengthPerWeight: {},
        isActive: true,
        isSpecial: false,
      });

      details.push({ name: data.name, status: 'created', id: product._id });
    };

    // --- 1. Sena PushupBoard Model :6 (3 feet) ---
    await addProduct(
      {
        name: 'Sena PushupBoard Model :6(3 feet)',
        category: 'senaboard',
        image: 'sena9',
        images: ['sena9_2', 'sena9_3'],
        weights: ['2'],
      },
      { '2': 1050 }
    );

    // --- 2. Sena PushupBoard Model :7 ---
    await addProduct(
      {
        name: 'Sena PushupBoard Model :7',
        category: 'senaboard',
        image: 'sena10',
        images: ['sena10_2', 'sena10_3'],
        weights: ['2'],
      },
      { '2': 1050 }
    );

    // --- 3. Indian Club Mudgar Model:14 (300/kg, 2–20) ---
    await addProduct(
      {
        name: 'Indian Club Mudgar Model:14',
        category: 'mudgar',
        image: 'mud14',
        weights: ['2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'],
      },
      {
        '2': 600, '3': 900, '4': 1200, '5': 1500,
        '6': 1800, '7': 2100, '8': 2400, '9': 2700, '10': 3000,
        '11': 3300, '12': 3600, '13': 3900, '14': 4200, '15': 4500,
        '16': 4800, '17': 5100, '18': 5400, '19': 5700, '20': 6000,
      }
    );

    // --- 4. Special Grip Mudgar Model:15 (300/kg, 2–20) ---
    await addProduct(
      {
        name: 'Special Grip Mudgar Model:15',
        category: 'mudgar',
        image: 'mud15',
        images: ['mud15_2'],
        weights: ['2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'],
      },
      {
        '2': 600, '3': 900, '4': 1200, '5': 1500,
        '6': 1800, '7': 2100, '8': 2400, '9': 2700, '10': 3000,
        '11': 3300, '12': 3600, '13': 3900, '14': 4200, '15': 4500,
        '16': 4800, '17': 5100, '18': 5400, '19': 5700, '20': 6000,
      }
    );

    // --- 5. Carving Hamuman Gada Model: 14 (850/kg, 2–20) ---
    await addProduct(
      {
        name: 'Carving Hamuman Gada Model: 14',
        category: 'gada',
        image: 'gada14',
        images: ['gada14_2'],
        weights: ['2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'],
      },
      {
        '2': 1700, '3': 2550, '4': 3400, '5': 4250,
        '6': 5100, '7': 5950, '8': 6800, '9': 7650, '10': 8500,
        '11': 9350, '12': 10200, '13': 11050, '14': 11900, '15': 12750,
        '16': 13600, '17': 14450, '18': 15300, '19': 16150, '20': 17000,
      }
    );

    // --- 6. Carving Hamuman Gada Model: 15 (850/kg, 2–20) ---
    await addProduct(
      {
        name: 'Carving Hamuman Gada Model: 15',
        category: 'gada',
        image: 'gada15',
        images: ['gada15_2'],
        weights: ['2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'],
      },
      {
        '2': 1700, '3': 2550, '4': 3400, '5': 4250,
        '6': 5100, '7': 5950, '8': 6800, '9': 7650, '10': 8500,
        '11': 9350, '12': 10200, '13': 11050, '14': 11900, '15': 12750,
        '16': 13600, '17': 14450, '18': 15300, '19': 16150, '20': 17000,
      }
    );

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