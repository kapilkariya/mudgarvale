const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const CheckoutSession = require('../models/CheckoutSession');
const { calculateDeliveryCharge, calculateSubtotal } = require('../utils/deliveryCharge');
const { sendOrderConfirmationEmail } = require('../utils/email');
const { computeDiscount } = require('./couponController');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const getProductId = (item) => String(item.productId?._id || item.productId);

const addCategoriesToItems = async (items = []) => {
  const productIds = [...new Set(items.map(getProductId).filter(Boolean))];
  const products = await Product.find({ _id: { $in: productIds } }).select('category isSpecial').lean();
  const categoryByProductId = new Map(products.map((product) => [String(product._id), product.category]));
  const specialByProductId = new Map(products.map((product) => [String(product._id), product.isSpecial || false]));

  return items.map((item) => {
    const productId = getProductId(item);

    return {
      ...item,
      productId,
      category: item.category || categoryByProductId.get(productId) || '',
      isSpecial: specialByProductId.get(productId) || false,
    };
  });
};

const computeDeliveryCharge = (orderItems, address) => {
  const isInternational = !!(address?.country && address.country !== 'India');

  if (!isInternational) {
    return { isInternational: false, deliveryCharge: calculateDeliveryCharge(orderItems) };
  }

  const cartTotalWeight = orderItems.reduce((sum, item) => {
    if (item.category === 'decor') return sum + 4 * item.quantity;
    if (item.category === 'sticks') return sum + 2 * item.quantity;
    const w = parseFloat(item.selectedWeight);
    return sum + (Number.isFinite(w) ? w : 0) * item.quantity;
  }, 0);

  return { isInternational: true, deliveryCharge: Math.round(cartTotalWeight * 1000) };
};

// ✅ Server-side coupon lookup + discount. Returns { couponCode, discountAmount, finalSubtotal }
// silent on failure — no coupon applied if code is missing, invalid, or inactive.
const applyCouponIfValid = async (couponCode, subtotal) => {
  const cleanCode = couponCode ? String(couponCode).trim().toUpperCase() : '';
  if (!cleanCode) {
    return { couponCode: '', discountAmount: 0, finalSubtotal: subtotal };
  }

  const coupon = await Coupon.findOne({ code: cleanCode });
  if (!coupon || !coupon.isActive) {
    return { couponCode: '', discountAmount: 0, finalSubtotal: subtotal };
  }

  const { discountAmount, finalSubtotal } = computeDiscount(coupon, subtotal);
  if (discountAmount <= 0) {
    return { couponCode: '', discountAmount: 0, finalSubtotal: subtotal };
  }

  return { couponCode: coupon.code, discountAmount, finalSubtotal };
};

// @desc    Create Razorpay order (not DB order)
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, address, freeGift, couponCode } = req.body;
    const userId = req.user.id;

    const orderItems = await addCategoriesToItems(items);
    const { isInternational, deliveryCharge } = computeDeliveryCharge(orderItems, address);
    const subtotal = calculateSubtotal(orderItems);

    if (isInternational && paymentMethod === 'cod') {
      return res.status(400).json({ success: false, message: 'Cash on Delivery is not available for international orders.' });
    }

    // ✅ Apply coupon BEFORE freeGift eligibility check so gift eligibility stays
    //    based on the raw subtotal (coupons don't affect gift eligibility).
    const { couponCode: appliedCode, discountAmount, finalSubtotal } = await applyCouponIfValid(couponCode, subtotal);

    let validatedFreeGift = 0;
    if (freeGift === 1 || freeGift === 2) {
      validatedFreeGift = subtotal >= 3000 ? freeGift : 0;
    }

    const finalTotal = finalSubtotal + deliveryCharge;
    const codAdvance = deliveryCharge;

    const amountToPayNow = paymentMethod === 'cod' ? codAdvance : finalTotal;
    const remainingAmount = paymentMethod === 'cod' ? finalTotal - codAdvance : 0;

    let razorpayOrder = null;
    if (paymentMethod === 'online') {
      razorpayOrder = await razorpay.orders.create({
        amount: finalTotal * 100,
        currency: 'INR',
        receipt: `ORDER-${Date.now()}`,
      });
    } else if (paymentMethod === 'cod') {
      razorpayOrder = await razorpay.orders.create({
        amount: codAdvance * 100,
        currency: 'INR',
        receipt: `COD-${Date.now()}`,
      });
    }

    console.log('Razorpay order created:', { razorpayOrderId: razorpayOrder.id, couponCode: appliedCode, discountAmount, finalTotal });

    const pendingOrder = await Order.create({
      userId,
      items: orderItems,
      subtotal,
      discountAmount,
      couponCode: appliedCode,
      totalAmount: finalTotal,
      deliveryCharge,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      address,
      freeGift: validatedFreeGift,
      paidAmount: 0,
      remainingAmount: finalTotal,
      razorpayOrderId: razorpayOrder.id,
    });

    res.status(201).json({
      success: true,
      message: 'Razorpay order created successfully',
      data: {
        razorpayOrder,
        orderData: {
          userId,
          items: orderItems,
          subtotal,
          discountAmount,
          couponCode: appliedCode,
          totalAmount: finalTotal,
          deliveryCharge,
          paymentMethod,
          address,
          freeGift: validatedFreeGift,
          remainingAmount,
        },
      },
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
  }
};

// @desc    Verify Razorpay payment and create DB order
// @route   POST /api/orders/verify-payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderData } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature - payment verification failed' });
    }

    const existingOrder = await Order.findOne({ razorpayPaymentId: razorpay_payment_id });
    if (existingOrder) {
      return res.status(200).json({ success: true, message: 'Payment was already verified and the order is confirmed', data: existingOrder });
    }

    const { items, paymentMethod, address, freeGift, couponCode } = orderData;
    const userId = req.user.id;
    const orderItems = await addCategoriesToItems(items);
    const { deliveryCharge } = computeDeliveryCharge(orderItems, address);
    const subtotal = calculateSubtotal(orderItems);

    // ✅ Recompute discount on the server — never trust the frontend
    const { couponCode: appliedCode, discountAmount, finalSubtotal } = await applyCouponIfValid(couponCode, subtotal);
    const totalAmount = finalSubtotal + deliveryCharge;

    const validatedFreeGift = (freeGift === 1 || freeGift === 2) && subtotal >= 3000 ? freeGift : 0;

    const codAdvance = deliveryCharge;
    const remainingAmount = paymentMethod === 'cod' ? totalAmount - codAdvance : 0;

    let paymentStatus, paidAmount;
    if (paymentMethod === 'cod') {
      paymentStatus = 'partial_paid';
      paidAmount = codAdvance;
    } else {
      paymentStatus = 'paid';
      paidAmount = totalAmount;
    }

    let order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (order) {
      order.razorpayPaymentId = razorpay_payment_id;
      order.paymentStatus = paymentStatus;
      order.orderStatus = 'confirmed';
      order.paidAmount = paidAmount;
      order.remainingAmount = remainingAmount;
      // ✅ Ensure coupon + discount are on the order
      order.subtotal = subtotal;
      order.couponCode = appliedCode;
      order.discountAmount = discountAmount;
      order.totalAmount = totalAmount;
      await order.save();

      try {
        const deleted = await CheckoutSession.deleteOne({ userId: req.user.id });
        if (deleted.deletedCount > 0) console.log(`CheckoutSession cleared for user ${req.user.id}`);
      } catch (sessionErr) {
        console.error('Failed to clear CheckoutSession:', sessionErr);
      }
    } else {
      order = await Order.create({
        userId,
        items: orderItems,
        subtotal,
        couponCode: appliedCode,
        discountAmount,
        totalAmount,
        deliveryCharge,
        paymentMethod,
        paymentStatus,
        orderStatus: 'confirmed',
        address,
        freeGift: validatedFreeGift,
        paidAmount,
        remainingAmount,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      });

      try {
        const deleted = await CheckoutSession.deleteOne({ userId: req.user.id });
        if (deleted.deletedCount > 0) console.log(`CheckoutSession cleared for user ${req.user.id}`);
      } catch (sessionErr) {
        console.error('Failed to clear CheckoutSession:', sessionErr);
      }
    }

    // ✅ Email confirmation (unchanged)
    try {
      const confirmationEmail = req.user.email;
      if (!confirmationEmail) throw new Error('No recipient email is available for this order');

      const emailResult = await sendOrderConfirmationEmail(
        confirmationEmail,
        order.address?.name || req.user.name,
        order.orderNumber
      );
      order.confirmationEmailSentAt = new Date();
      await order.save();
      console.log(`Order confirmation email sent for ${order.orderNumber} to ${confirmationEmail} (message: ${emailResult.messageId})`);
    } catch (emailError) {
      console.error(`Order confirmation email failed for ${order.orderNumber}:`, emailError);
    }

    res.status(200).json({ success: true, message: 'Payment verified and order created successfully', data: order });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment or create order' });
  }
};

// @desc    Remove a pending Razorpay checkout order
const cancelPendingOrder = async (req, res) => {
  try {
    const { razorpayOrderId, orderId } = req.body;
    if (!razorpayOrderId && !orderId) {
      return res.status(400).json({ success: false, message: 'Razorpay order id or order id is required' });
    }

    const query = { userId: req.user.id, paymentStatus: 'pending' };
    if (razorpayOrderId) query.razorpayOrderId = razorpayOrderId;
    else {
      if (!mongoose.isValidObjectId(orderId)) {
        return res.status(400).json({ success: false, message: 'Invalid order id' });
      }
      query._id = orderId;
    }

    const order = await Order.findOneAndDelete(query);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pending order not found or already processed' });
    }

    res.status(200).json({ success: true, message: 'Pending order removed successfully', data: order });
  } catch (error) {
    console.error('Cancel pending order error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel pending order' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
    const formattedOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        name: item.name || 'Unknown Product',
        image: item.image,
        selectedWeight: item.selectedWeight || '',
        price: item.price || 0,
        quantity: item.quantity || 1,
      })),
      address: {
        name: order.address?.name || '',
        email: order.address?.email || '',
        phone: order.address?.phone || '',
        buildingFlatNo: order.address?.buildingFlatNo || '',
        address: order.address?.address || '',
        city: order.address?.city || '',
        state: order.address?.state || '',
        pincode: order.address?.pincode || '',
        country: order.address?.country || 'India',
      },
    }));
    res.status(200).json({ success: true, count: formattedOrders.length, data: formattedOrders });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id }).populate('items.productId', 'name image category');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  cancelPendingOrder,
  getMyOrders,
  getOrderById,
};