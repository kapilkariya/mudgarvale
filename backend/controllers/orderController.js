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
    const deliveryCharge = parseInt(process.env.DELIVERY_CHARGE) || 400;
    const codAdvance = parseInt(process.env.COD_ADVANCE_AMOUNT) || 400;

    // DEBUG: Log received values
    console.log('Order Creation Debug:', {
      receivedTotalAmount: totalAmount,
      deliveryCharge,
      paymentMethod,
      codAdvance,
    });

    // totalAmount from frontend already includes deliveryCharge
    // So we use it directly as the final total
    const finalTotal = totalAmount;
    
    // Calculate amounts based on payment method
    const amountToPayNow = paymentMethod === 'cod' ? codAdvance : finalTotal;
    const remainingAmount = paymentMethod === 'cod' ? finalTotal - codAdvance : 0;

    // Determine initial payment status
    const initialPaymentStatus = paymentMethod === 'cod' ? 'pending' : 'pending';

    // Create order in database
    const order = await Order.create({
      userId,
      items,
      totalAmount: finalTotal,
      deliveryCharge,
      paymentMethod,
      paymentStatus: initialPaymentStatus,
      orderStatus: 'pending',
      address,
      paidAmount: 0, // Will update after payment verification
      remainingAmount,
    });

    console.log('Order created:', {
      orderId: order._id,
      totalAmount: finalTotal,
      paymentMethod,
      amountToPayNow,
      remainingAmount,
    });

    // Create Razorpay order for payment
    let razorpayOrder = null;
    
    if (paymentMethod === 'online') {
      // Online: Full amount via Razorpay
      razorpayOrder = await razorpay.orders.create({
        amount: finalTotal * 100, // Razorpay expects amount in paise
        currency: 'INR',
        receipt: order.orderNumber,
      });

      // Update order with Razorpay order ID
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();
    } else if (paymentMethod === 'cod') {
      // COD: Only advance amount via Razorpay
      razorpayOrder = await razorpay.orders.create({
        amount: codAdvance * 100, // Only COD advance in paise
        currency: 'INR',
        receipt: `COD-${order.orderNumber}`,
      });

      // Update order with Razorpay order ID for COD advance
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
      // Handle payment verification based on payment method
      if (order.paymentMethod === 'cod') {
        // COD: Only advance was paid (codAdvance is stored in deliveryCharge or we need to get from env)
        const codAdvance = parseInt(process.env.COD_ADVANCE_AMOUNT) || 400;
        order.paymentStatus = 'partial_paid';
        order.paidAmount = codAdvance;
        // remainingAmount stays as is (to be paid on delivery)
      } else {
        // Online: Full amount paid
        order.paymentStatus = 'paid';
        order.paidAmount = order.totalAmount;
        order.remainingAmount = 0;
      }
      
      order.razorpayPaymentId = razorpay_payment_id;
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
