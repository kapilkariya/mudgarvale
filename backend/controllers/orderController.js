const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, address } = req.body;
    const userId = req.user.id;

    // Get delivery charge from env
    const deliveryCharge = parseInt(process.env.DELIVERY_CHARGE) || 100;
    const codAdvance = parseInt(process.env.COD_ADVANCE_AMOUNT) || 400;

    // Calculate amounts
    const finalTotal = totalAmount + deliveryCharge;
    const paidAmount = paymentMethod === 'cod' ? codAdvance : finalTotal;
    const remainingAmount = paymentMethod === 'cod' ? finalTotal - codAdvance : 0;

    // Create order in database
    const order = await Order.create({
      userId,
      items,
      totalAmount: finalTotal,
      deliveryCharge,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'pending',
      address,
      paidAmount: 0, // Will update after payment
      remainingAmount,
    });

    // If online payment, create Razorpay order
    let razorpayOrder = null;
    if (paymentMethod === 'online') {
      razorpayOrder = await razorpay.orders.create({
        amount: finalTotal * 100, // Razorpay expects amount in paise
        currency: 'INR',
        receipt: order.orderNumber,
      });

      // Update order with Razorpay order ID
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order,
        razorpayOrder,
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update order payment status
      order.paymentStatus = 'paid';
      order.razorpayPaymentId = razorpay_payment_id;
      order.paidAmount = order.totalAmount;
      order.remainingAmount = 0;
      order.orderStatus = 'confirmed';
      await order.save();

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: order,
      });
    } else {
      order.paymentStatus = 'failed';
      await order.save();

      res.status(400).json({
        success: false,
        message: 'Invalid signature',
      });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
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
