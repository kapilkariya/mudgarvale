if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

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

const app = express();

/* ---------------- DB connection (ONLY ONCE) ---------------- */
connectDB()
  .then(() => console.log("✅ DB connected"))
  .catch(err => console.log("❌ DB error:", err));

/* ---------------- CORS ---------------- */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://mudgarvale-rzyy.vercel.app/',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS error: ${origin}`));
    }
  },
  credentials: true,
}));

/* ---------------- Middleware ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------------- Routes ---------------- */
app.get('/', (req, res) => {
  res.json({ message: 'Mudgarvale API running 🚀' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/api/auth',      authRoutes);
app.use('/api/products',  productRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/cart',      cartRoutes);
app.use('/api/contact',   contactRoutes);
app.use('/api/config',    configRoutes);
app.use('/api/admin',     adminRoutes);

/* ---------------- Error Handler ---------------- */
app.use(errorHandler);

/* ❌ NO app.listen HERE */

module.exports = app;