const express = require('express');
const crypto = require('crypto');
const Order = require('../models/Order');

const router = express.Router();

const isValidSignature = (rawBody, signature) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret || !signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
  const receivedBuffer = Buffer.from(signature, 'utf8');

  return expectedBuffer.length === receivedBuffer.length
    && crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
};

const saveCapturedPayment = async (payment) => {
  const existingOrder = await Order.findOne({ razorpayPaymentId: payment.id });
  if (existingOrder) {
    console.log(`Razorpay webhook ignored duplicate payment: ${payment.id}`);
    return existingOrder;
  }

  const order = await Order.findOne({
    razorpayOrderId: payment.order_id,
    paymentStatus: 'pending',
  });

  if (!order) {
    console.log(`Razorpay webhook: no matching pending order found for captured payment ${payment.order_id}`);
    return null;
  }

  order.razorpayPaymentId = payment.id;
  order.paymentStatus = 'paid';
  order.orderStatus = 'confirmed';
  order.paidAmount = payment.amount / 100;
  order.remainingAmount = Math.max(order.totalAmount - order.paidAmount, 0);
  order.razorpayPaymentEmail = payment.email || '';
  order.razorpayPaymentContact = payment.contact || '';
  order.razorpayPaymentNotes = payment.notes || {};
  order.paymentCapturedAt = payment.created_at ? new Date(payment.created_at * 1000) : new Date();
  await order.save();

  console.log('Razorpay webhook order updated successfully:', {
    orderId: order._id,
    orderNumber: order.orderNumber,
    razorpayPaymentId: payment.id,
  });

  return order;
};

const markPaymentFailed = async (razorpayOrderId) => {
  const order = await Order.findOneAndDelete(
    {
      razorpayOrderId,
      paymentStatus: 'pending',
    }
  );

  if (!order) {
    console.log(`Razorpay webhook: no matching pending order found for failed payment ${razorpayOrderId}`);
    return null;
  }

  console.log('Razorpay webhook removed failed pending order:', {
    orderId: order._id,
    orderNumber: order.orderNumber,
  });

  return order;
};

// Razorpay signs the exact request body, so this parser must remain route-local.
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log('Razorpay webhook received');

  const signature = req.get('x-razorpay-signature');
  const signatureIsValid = isValidSignature(req.body, signature);
  console.log(`Razorpay webhook signature verification: ${signatureIsValid ? 'valid' : 'invalid'}`);

  if (!signatureIsValid) {
    return res.status(400).json({ success: false, message: 'Invalid Razorpay webhook signature' });
  }

  try {
    const payload = JSON.parse(req.body.toString('utf8'));
    const payment = payload.payload?.payment?.entity;

    if (payload.event === 'payment.captured') {
      if (!payment?.id || !payment?.order_id) {
        throw new Error('payment.captured payload is missing payment id or order id');
      }

      await saveCapturedPayment(payment);
    } else if (payload.event === 'payment.failed') {
      if (!payment?.order_id) {
        throw new Error('payment.failed payload is missing Razorpay order id');
      }

      await markPaymentFailed(payment.order_id);
    } else {
      console.log(`Razorpay webhook acknowledged unhandled event: ${payload.event}`);
    }
  } catch (error) {
    // A valid webhook is acknowledged even when internal processing fails, to avoid retries.
    console.error('Razorpay webhook processing error:', error);
  }

  return res.status(200).json({ success: true, message: 'Webhook processed' });
});

module.exports = router;
