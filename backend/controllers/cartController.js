const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getProductId = (item) => String(item.productId?._id || item.productId);

const addCategoriesToItems = async (items = []) => {
  const productIds = [...new Set(items.map(getProductId).filter(Boolean))];
  const products = await Product.find({ _id: { $in: productIds } }).select('category').lean();
  const categoryByProductId = new Map(products.map((product) => [String(product._id), product.category]));

  return items.map((item) => {
    const plainItem = item.toObject ? item.toObject() : item;
    const productId = getProductId(plainItem);

    return {
      ...plainItem,
      productId,
      category: plainItem.category || categoryByProductId.get(productId) || '',
    };
  });
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      // Create empty cart if doesn't exist
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    const cartObject = cart.toObject();
    cartObject.items = await addCategoriesToItems(cart.items);

    res.status(200).json({
      success: true,
      data: cartObject,
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, name, image, selectedWeight, price, quantity, category } = req.body;
    const userId = req.user.id;
    const product = category ? null : await Product.findById(productId).select('category').lean();
    const itemCategory = category || product?.category || '';

    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.selectedWeight === selectedWeight
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity || 1;
      cart.items[existingItemIndex].category = cart.items[existingItemIndex].category || itemCategory;
    } else {
      // Add new item
      cart.items.push({
        productId,
        name,
        image,
        selectedWeight,
        price,
        quantity: quantity || 1,
        category: itemCategory,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: {
        ...cart.toObject(),
        items: await addCategoriesToItems(cart.items),
      },
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const userId = req.user.id;
    const itemId = req.params.itemId;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Quantity updated',
      data: cart,
    });
  } catch (error) {
    console.error('Update quantity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update quantity',
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.itemId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    // Remove item by filtering
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart,
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: cart || { userId, items: [] },
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
    });
  }
};

// @desc    Sync cart (replace entire cart - used for login sync)
// @route   POST /api/cart/sync
// @access  Private
const syncCart = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = await Cart.create({ userId, items: await addCategoriesToItems(items || []) });
    } else {
      cart.items = await addCategoriesToItems(items || []);
      await cart.save();
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error('Sync cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync cart',
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  syncCart,
};
