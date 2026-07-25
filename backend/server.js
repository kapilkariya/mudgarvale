if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes   = require('./routes/orderRoutes');
const addressRoutes = require('./routes/addressRoutes');
const cartRoutes    = require('./routes/cartRoutes');
const contactRoutes = require('./routes/contactRoutes');
const configRoutes  = require('./routes/configRoutes');
const adminRoutes   = require('./routes/adminRoutes');
const feedRoutes = require('./routes/feedRoutes');


const app = express();

connectDB()
  .then(() => console.log("✅ DB connected"))
  .catch(err => console.log("❌ DB error:", err));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://mudgarvale-rzyy.vercel.app',
  'https://www.mudgarvale.com',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked: ${origin}`); // quiet log, not a thrown Error
      callback(null, false);
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', feedRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.use('/api/auth',      authRoutes);
app.use('/api/products',  productRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/cart',      cartRoutes);
app.use('/api/contact',   contactRoutes);
app.use('/api/config',    configRoutes);
app.use('/api/admin',     adminRoutes);


// Serve React frontend (must be after API routes)

app.use(express.static(path.join(__dirname, '../frontend/dist'), {
  maxAge: '7d',
  setHeaders: (res, filePath) => {
    // Never cache index.html — it must always reflect the latest deploy
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.use(errorHandler);

// ✅ Always listen — Hostinger requires app.listen() in production
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
