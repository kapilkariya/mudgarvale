const cron = require('node-cron');
const Order = require('../models/Order');

const expirePendingOrders = async () => {
  try {
    const expiryCutoff = new Date(Date.now() - (30 * 60 * 1000));
    const result = await Order.updateMany(
      {
        paymentStatus: 'pending',
        createdAt: { $lt: expiryCutoff },
      },
      {
        paymentStatus: 'expired',
        orderStatus: 'cancelled',
      }
    );

    console.log(`Expired ${result.modifiedCount} stale pending order(s)`);
  } catch (error) {
    console.error('Expire pending orders job error:', error);
  }
};

const startExpirePendingOrdersJob = () => {
  cron.schedule('*/15 * * * *', expirePendingOrders);
  console.log('Expire pending orders job scheduled to run every 15 minutes');
};

module.exports = startExpirePendingOrdersJob;
