const cron = require('node-cron');
const Order = require('../models/Order');

// --- Existing: expire stale pending orders every minute ---
const expirePendingOrders = async () => {
  try {
    const expiryCutoff = new Date(Date.now() - (10 * 60 * 1000));
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

// --- New: flip confirmed orders from the last 2 days to processing, daily at 00:00 IST ---
const IST_OFFSET_MIN = 330; // +5:30

const flipLastTwoDaysConfirmedOrders = async () => {
  try {
    const now = new Date();

    // Midnight today in IST (as UTC Date)
    const istMidnightToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
        IST_OFFSET_MIN * 60 * 1000
    );

    // Midnight 2 days ago in IST
    const istMidnightTwoDaysAgo = new Date(
      istMidnightToday.getTime() - 2 * 24 * 60 * 60 * 1000
    );

    const result = await Order.updateMany(
      {
        orderStatus: 'confirmed',
        createdAt: {
          $gte: istMidnightTwoDaysAgo,  // 2 days ago or later
          $lt: istMidnightToday,        // but before today
        },
      },
      { $set: { orderStatus: 'processing' } }
    );

    if (result.modifiedCount > 0) {
      console.log(
        `[flipConfirmedOrders] flipped ${result.modifiedCount} order(s) to processing`
      );
    }
  } catch (error) {
    console.error('Flip confirmed orders job error:', error);
  }
};

const startExpirePendingOrdersJob = () => {
  // Existing: every minute
  cron.schedule('* * * * *', expirePendingOrders);

  // New: daily at 00:00 IST
  cron.schedule(
    '30 0 * * *',
    flipLastTwoDaysConfirmedOrders,
    { timezone: 'Asia/Kolkata' }
  );

  console.log('Expire pending orders job scheduled every minute for orders older than 5 minutes');
  console.log('Flip last 2 days confirmed → processing job scheduled daily at 00:00 IST');
};

module.exports = startExpirePendingOrdersJob;