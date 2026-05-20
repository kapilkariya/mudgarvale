const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { calculateDeliveryCharge, calculateSubtotal } = require('../utils/deliveryCharge');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const getProductId = (item) => String(item.productId?._id || item.productId);

const addCategoriesToItems = async (items = []) => {
  const productIds = [...new Set(items.map(getProductId).filter(Boolean))];
  const products = await Product.find({ _id: { $in: productIds } }).select('category').lean();
  const categoryByProductId = new Map(products.map((product) => [String(product._id), product.category]));

  return items.map((item) => {
    const productId = getProductId(item);

    return {
      ...item,
      productId,
      category: item.category || categoryByProductId.get(productId) || '',
    };
  });
};

// @desc    Create Razorpay order (not DB order)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, address } = req.body;
    const userId = req.user.id;

    const orderItems = await addCategoriesToItems(items);
    const deliveryCharge = calculateDeliveryCharge(orderItems);
    const subtotal = calculateSubtotal(orderItems);
    
    const codAdvance = deliveryCharge;

    // DEBUG: Log received values
    console.log('Razorpay Order Creation Debug:', {
      receivedTotalAmount: totalAmount,
      calculatedDeliveryCharge: deliveryCharge,
      calculatedSubtotal: subtotal,
      paymentMethod,
      codAdvance,
    });

    const finalTotal = subtotal + deliveryCharge;
    
    // Calculate amounts based on payment method
    const amountToPayNow = paymentMethod === 'cod' ? codAdvance : finalTotal;
    const remainingAmount = paymentMethod === 'cod' ? finalTotal - codAdvance : 0;

    // Create Razorpay order for payment
    let razorpayOrder = null;
    
    if (paymentMethod === 'online') {
      // Online: Full amount via Razorpay
      razorpayOrder = await razorpay.orders.create({
        amount: finalTotal * 100, // Razorpay expects amount in paise
        currency: 'INR',
        receipt: `ORDER-${Date.now()}`,
      });
    } else if (paymentMethod === 'cod') {
      // COD: Only advance amount via Razorpay
      razorpayOrder = await razorpay.orders.create({
        amount: codAdvance * 100, // Only COD advance in paise
        currency: 'INR',
        receipt: `COD-${Date.now()}`,
      });
    }

    console.log('Razorpay order created:', {
      razorpayOrderId: razorpayOrder.id,
      amountToPayNow,
      remainingAmount,
    });

    // Return only Razorpay order data - DO NOT create DB order yet
    res.status(201).json({
      success: true,
      message: 'Razorpay order created successfully',
      data: {
        razorpayOrder,
        orderData: {
          userId,
          items: orderItems,
          totalAmount: finalTotal,
          deliveryCharge,
          paymentMethod,
          address,
          remainingAmount,
        },
      },
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay order',
    });
  }
};

// @desc    Verify Razorpay payment and create DB order
// @route   POST /api/orders/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderData } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature - payment verification failed',
      });
    }

    // Signature is valid - now create the order in database
    const { items, paymentMethod, address } = orderData;
    const userId = req.user.id;
    const orderItems = await addCategoriesToItems(items);
    const deliveryCharge = calculateDeliveryCharge(orderItems);
    const subtotal = calculateSubtotal(orderItems);
    const totalAmount = subtotal + deliveryCharge;
    
    const codAdvance = deliveryCharge;
    const remainingAmount = paymentMethod === 'cod' ? totalAmount - codAdvance : 0;

    // Determine payment status based on payment method
    let paymentStatus, paidAmount;
    if (paymentMethod === 'cod') {
      paymentStatus = 'partial_paid';
      paidAmount = codAdvance;
    } else {
      paymentStatus = 'paid';
      paidAmount = totalAmount;
    }

    // Create order in database
    const order = await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      deliveryCharge,
      paymentMethod,
      paymentStatus,
      orderStatus: 'confirmed',
      address,
      paidAmount,
      remainingAmount,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    console.log('Order created after payment verification:', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      paymentStatus,
      paidAmount,
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified and order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment or create order',
    });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Format orders to ensure all fields are present
    const formattedOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        name: item.name || 'Unknown Product',
        image: item.image || '/placeholder-product.png',
        selectedWeight: item.selectedWeight || '',
        price: item.price || 0,
        quantity: item.quantity || 1,
      })),
      address: {
        name: order.address?.name || '',
        email: order.address?.email || '',
        phone: order.address?.phone || '',
        address: order.address?.address || '',
        city: order.address?.city || '',
        state: order.address?.state || '',
        pincode: order.address?.pincode || '',
      },
    }));

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      data: formattedOrders,
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate('items.productId', 'name image category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
};
