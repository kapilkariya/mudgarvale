const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private (Admin)
const getAllOrders = async (req, res) => {
  try {
    const requestedPage = Number.parseInt(req.query.page, 10);
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 100)
      : 10;
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
      address: order.address,
      createdAt: order.createdAt,
      paidAmount: order.paidAmount,
      remainingAmount: order.remainingAmount,
    }));

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      total,
      page,
      limit,
      hasMore: skip + formattedOrders.length < total,
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

// @desc    Update editable order and customer details
// @route   PUT /api/admin/orders/:id
// @access  Private (Admin)
const updateOrder = async (req, res) => {
  try {
    const { customer, address, items, subtotal, totalAmount } = req.body;

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
    const numericTotal = Number(totalAmount);
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

    user.name = customer.name.trim();
    user.phone = customer.phone.trim();
    order.items = normalizedItems;
    order.address = {
      name: user.name,
      // Email is intentionally fixed: order editing must not alter account ownership.
      email: user.email,
      phone: user.phone,
      buildingFlatNo: String(address.buildingFlatNo || '').trim(),
      address: address.address.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      pincode: address.pincode.trim(),
    };
    order.totalAmount = numericTotal;
    order.deliveryCharge = numericTotal - numericSubtotal;
    order.remainingAmount = Math.max(0, numericTotal - (order.paidAmount || 0));

    await Promise.all([user.save(), order.save()]);
    await order.populate('userId', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order', error: error.message });
  }
};

// @desc    Update order status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    // Validate status
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

// @desc    Get order statistics
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

    // Calculate total revenue from delivered orders
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
  updateOrder,
  updateOrderStatus,
  getOrderStats,
};
