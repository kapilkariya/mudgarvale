const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get all orders (admin) - FETCH ALL ORDERS (Original - Keep as is)
// @route   GET /api/admin/orders
// @access  Private (Admin)
const getAllOrders = async (req, res) => {
  try {
    // Fetch ALL orders without pagination
    const orders = await Order.find({})
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    // Format orders to include user details
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      user: order.userId,
      items: order.items,
      totalAmount: order.totalAmount,
      deliveryCharge: order.deliveryCharge,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      freeGift: order.freeGift,
      address: order.address,
      createdAt: order.createdAt,
      paidAmount: order.paidAmount,
      remainingAmount: order.remainingAmount,
    }));

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      total: formattedOrders.length,
      data: formattedOrders,
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

// @desc    Get orders with pagination (NEW - For admin orders page)
// @route   GET /api/admin/orders/paginated
// @access  Private (Admin)
const getOrdersPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({})
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(),
    ]);

    // Format orders to include user details
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      user: order.userId,
      items: order.items,
      totalAmount: order.totalAmount,
      deliveryCharge: order.deliveryCharge,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      freeGift: order.freeGift,
      address: order.address,
      createdAt: order.createdAt,
      paidAmount: order.paidAmount,
      remainingAmount: order.remainingAmount,
    }));

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      total: total,
      page: page,
      limit: limit,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + formattedOrders.length < total,
      data: formattedOrders,
    });
  } catch (error) {
    console.error('Get paginated orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

// @desc    Get orders by date range (Keep as is)
// @route   GET /api/admin/orders/date-range
// @access  Private (Admin)
const getOrdersByDateRange = async (req, res) => {
  try {
    const { from, to } = req.query;

    // Validate dates
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'Both "from" and "to" dates are required',
      });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Set to end of day for 'to' date
    toDate.setHours(23, 59, 59, 999);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD',
      });
    }

    if (fromDate > toDate) {
      return res.status(400).json({
        success: false,
        message: '"From" date must be before "To" date',
      });
    }

    // Fetch orders within date range (excluding cancelled)
    const orders = await Order.find({
      createdAt: { $gte: fromDate, $lte: toDate },
      orderStatus: { $ne: 'cancelled' }
    })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate metrics
    let totalSales = 0;
    let onlineAmount = 0;
    let codAmount = 0;
    let totalOrders = orders.length;
    let onlineOrders = 0;
    let codOrders = 0;

    orders.forEach(order => {
      const amount = order.totalAmount || 0;
      totalSales += amount;

      if (order.paymentMethod === 'online') {
        onlineAmount += amount;
        onlineOrders += 1;
      } else if (order.paymentMethod === 'cod') {
        codAmount += amount;
        codOrders += 1;
      }
    });

    // Format orders for response
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      user: order.userId,
      items: order.items,
      totalAmount: order.totalAmount,
      deliveryCharge: order.deliveryCharge,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      freeGift: order.freeGift,
      address: order.address,
      createdAt: order.createdAt,
      paidAmount: order.paidAmount,
      remainingAmount: order.remainingAmount,
    }));

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalOrders,
          totalSales,
          onlineAmount,
          codAmount,
          onlineOrders,
          codOrders,
        },
        orders: formattedOrders,
        dateRange: {
          from: fromDate,
          to: toDate,
        },
      },
    });
  } catch (error) {
    console.error('Get orders by date range error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders by date range',
      error: error.message,
    });
  }
};

// @desc    Update editable order and customer details
// @route   PUT /api/admin/orders/:id
// @access  Private (Admin)
// @desc    Update editable order and customer details
// @route   PUT /api/admin/orders/:id
// @access  Private (Admin)
const updateOrder = async (req, res) => {
  try {
    const { customer, address, items, subtotal, totalAmount, markPartialPaid } = req.body;

    if (!customer?.name?.trim() || !customer?.phone?.trim()) {
      return res.status(400).json({ success: false, message: 'A customer name and phone number are required' });
    }

    const requiredAddressFields = ['address', 'city', 'state', 'pincode'];
    if (!address || requiredAddressFields.some((field) => !String(address[field] || '').trim())) {
      return res.status(400).json({ success: false, message: 'Complete shipping address details are required' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'An order must contain at least one product' });
    }

    const normalizedItems = items.map((item) => ({
      ...item,
      selectedWeight: String(item.selectedWeight ?? '').trim(),
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));
    const invalidItem = normalizedItems.some((item) =>
      !item.selectedWeight || !Number.isFinite(Number(item.selectedWeight)) || Number(item.selectedWeight) < 0 ||
      !Number.isInteger(item.quantity) || item.quantity < 1 ||
      !Number.isFinite(item.price) || item.price < 0
    );
    if (invalidItem) {
      return res.status(400).json({ success: false, message: 'Each product needs a valid weight, positive quantity, and non-negative unit price' });
    }

    const numericSubtotal = Number(subtotal);
    let numericTotal = Number(totalAmount);
    if (!Number.isFinite(numericSubtotal) || numericSubtotal < 0 || !Number.isFinite(numericTotal) || numericTotal < numericSubtotal) {
      return res.status(400).json({ success: false, message: 'Subtotal and total price must be valid, with total not below subtotal' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const user = await User.findById(order.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // ✅ Delivery charge rule:
    // If the order contains any gada or samtola AND current delivery charge is 200,
    // upgrade it to 400, add +200 to total amount, and force payment method to COD.
    const currentDeliveryCharge = Number(order.deliveryCharge) || 0;
    const hasGadaOrSamtola = normalizedItems.some(
      (item) => item.category === 'gada' || item.category === 'samtola'
    );
    const shouldUpgradeDelivery = hasGadaOrSamtola && currentDeliveryCharge === 200;
    const newDeliveryCharge = shouldUpgradeDelivery ? 400 : currentDeliveryCharge;

    if (shouldUpgradeDelivery) {
      numericTotal += 200;
    }

    user.name = customer.name.trim();
    user.phone = customer.phone.trim();
    order.items = normalizedItems;
    order.address = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      phone2: String(customer.phone2 || address.phone2 || '').trim(),
      buildingFlatNo: String(address.buildingFlatNo || '').trim(),
      address: address.address.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      pincode: address.pincode.trim(),
    };
    order.totalAmount = numericTotal;
    order.deliveryCharge = newDeliveryCharge;

    // ✅ Force payment method to COD when the delivery upgrade kicks in
    if (shouldUpgradeDelivery) {
      order.paymentMethod = 'cod';
    }

    // ✅ If admin added new products to the order, flip payment status to partial_paid
    if (markPartialPaid === true) {
      order.paymentStatus = 'partial_paid';
    }

    order.remainingAmount = Math.max(0, numericTotal - (order.paidAmount || 0));

    await Promise.all([user.save(), order.save()]);
    await order.populate('userId', 'name email phone');

    res.status(200).json({
      success: true,
      message: shouldUpgradeDelivery
        ? 'Order updated. Delivery charge upgraded to ₹400 (gada/samtola added). Payment method set to COD.'
        : 'Order updated successfully',
      data: order,
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order', error: error.message });
  }
};

// @desc    Update order status (Keep as is)
// @route   PATCH /api/admin/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status',
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    ).populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};

// @desc    Bulk update order status for a date range
// @route   PATCH /api/admin/orders/bulk-status
// @access  Private (Admin)
// NOTE: Skips orders with paymentStatus 'pending' and orders already 'cancelled'
const bulkUpdateOrderStatus = async (req, res) => {
  try {
    const { from, to, orderStatus } = req.body;

    const allowedBulkStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowedBulkStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bulk status. Allowed: confirmed, processing, shipped, delivered, cancelled.',
      });
    }

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'Both "from" and "to" dates are required',
      });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD',
      });
    }

    if (fromDate > toDate) {
      return res.status(400).json({
        success: false,
        message: '"From" date must be before "To" date',
      });
    }

    const result = await Order.updateMany(
      {
        createdAt: { $gte: fromDate, $lte: toDate },
        paymentStatus: { $ne: 'pending' },
        orderStatus: { $nin: ['cancelled', 'pending'] },
      },
      { $set: { orderStatus } }
    );

    res.status(200).json({
      success: true,
      message: `Updated ${result.modifiedCount} order(s) to "${orderStatus}" (${result.matchedCount} matched). Pending-payment and cancelled orders were skipped.`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Bulk update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk update order status',
      error: error.message,
    });
  }
};

// @desc    Preview how many orders would be affected by bulk status update
// @route   GET /api/admin/orders/bulk-status/preview
// @access  Private (Admin)
const previewBulkUpdateOrderStatus = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'Both "from" and "to" dates are required',
      });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }

    const matchFilter = {
      createdAt: { $gte: fromDate, $lte: toDate },
      paymentStatus: { $ne: 'pending' },
      orderStatus: { $nin: ['cancelled', 'pending'] },
    };

    const affectedCount = await Order.countDocuments(matchFilter);

    const totalInRange = await Order.countDocuments({
      createdAt: { $gte: fromDate, $lte: toDate },
    });
    const skippedCount = totalInRange - affectedCount;

    res.status(200).json({
      success: true,
      data: {
        affectedCount,
        skippedCount,
        totalInRange,
      },
    });
  } catch (error) {
    console.error('Preview bulk update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to preview bulk update',
      error: error.message,
    });
  }
};

// @desc    Get order statistics (Keep as is)
// @route   GET /api/admin/orders/stats
// @access  Private (Admin)
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });

    const revenue = await Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: revenue.length > 0 ? revenue[0].total : 0,
      },
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
      error: error.message,
    });
  }
};

module.exports = {
  getAllOrders,
  getOrdersPaginated,
  getOrdersByDateRange,
  updateOrder,
  updateOrderStatus,
  bulkUpdateOrderStatus,
  previewBulkUpdateOrderStatus,
  getOrderStats,
};