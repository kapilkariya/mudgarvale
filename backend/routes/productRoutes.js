const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} = require('../controllers/productController');

// Public routes
router.get('/', getProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

// Protected admin routes
router.post('/', protect, adminOnly, upload.single('image'), createProduct);
router.put('/:id', protect, adminOnly, upload.single('image'), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
