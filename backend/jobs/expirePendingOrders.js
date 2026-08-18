const cron = require('node-cron');
const Order = require('../models/Order');

const expirePendingOrders = async () => {
  try {
    const expiryCutoff = new Date(Date.now() - (1 * 60 * 1000));
    const result = await Order.deleteMany(
      {
        paymentStatus: 'pending',
        createdAt: { $lt: expiryCutoff },
      }
    );

    console.log(`Removed ${result.deletedCount} stale pending order(s)`);
  } catch (error) {
    console.error('Expire pending orders job error:', error);
  }
};

const startExpirePendingOrdersJob = () => {
  cron.schedule('* * * * *', expirePendingOrders);
  console.log('Expire pending orders job scheduled every minute for orders older than 5 minutes');
};

module.exports = startExpirePendingOrdersJob;
