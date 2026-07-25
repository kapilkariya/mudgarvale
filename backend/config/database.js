const mongoose = require('mongoose');

// A connection can emit an error after the initial connect has succeeded.
// Without this listener Node treats the EventEmitter "error" event as fatal.
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
