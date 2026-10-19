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

// --- Flip confirmed orders from yesterday to processing, every hour ---
const IST_OFFSET_MIN = 330; // +5:30

const flipLastTwoDaysConfirmedOrders = async () => {
  try {
    // Ensure the query is index-backed so MongoDB only touches yesterday's range.
    // (Does NOT change query/behavior — only makes it seek + stop.)
    await Order.collection.createIndex({ orderStatus: 1, createdAt: 1 });

    const now = new Date();

    // Midnight today in IST (as UTC Date)
    const istMidnightToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
        IST_OFFSET_MIN * 60 * 1000
    );

    // Midnight yesterday in IST
    const istMidnightYesterday = new Date(
      istMidnightToday.getTime() - 1 * 24 * 60 * 60 * 1000
    );

    const result = await Order.updateMany(
      {
        orderStatus: 'confirmed',
        createdAt: {
          $gte: istMidnightYesterday, // yesterday 00:00 IST
          $lt: istMidnightToday,      // before today 00:00 IST
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

  // Every hour, on the hour, IST
  cron.schedule(
    '* * * * *',
    flipLastTwoDaysConfirmedOrders,
    { timezone: 'Asia/Kolkata' }
  );

  console.log('Expire pending orders job scheduled every minute for orders older than 5 minutes');
  console.log('Flip yesterday\'s confirmed → processing job scheduled every hour (IST)');
};

module.exports = startExpirePendingOrdersJob;