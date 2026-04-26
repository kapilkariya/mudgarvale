if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

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

/* ---------------- DB connection (FIXED) ---------------- */

connectDB()
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.error("❌ DB Error:", err));

/* ---------------- CORS ---------------- */

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

const isHostingerDomain = (origin) => {
  return origin && origin.includes('hostingersite');
};

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || isHostingerDomain(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // allow all in production (Hostinger safe)
    }
  },
  credentials: true,
}));

/* ---------------- Middleware ---------------- */

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

/* ---------------- API routes ---------------- */

app.use('/api/auth',      authRoutes);
app.use('/api/products',  productRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/cart',      cartRoutes);
app.use('/api/contact',   contactRoutes);
app.use('/api/config',    configRoutes);
app.use('/api/admin',     adminRoutes);

app.get('/api/health', (req, res) =>
  res.json({ status: 'OK', message: 'Server is running' })
);

/* ---------------- Serve React build (FIXED PATH) ---------------- */

if (process.env.NODE_ENV === 'production') {

  // IMPORTANT: dist must be inside backend folder
  const distPath  = path.join(__dirname, 'dist');
  const indexPath = path.join(distPath, 'index.html');

  console.log('📂 Checking dist folder:', distPath);

  if (fs.existsSync(indexPath)) {

    console.log('✅ Frontend build found');

    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(indexPath);
    });

  } else {

    console.error('❌ dist/index.html NOT found');

    app.get('*', (req, res) => {
      res.status(500).send("Frontend not built properly");
    });

  }

}

/* ---------------- Error handler ---------------- */

app.use(errorHandler);

/* ---------------- Start server ---------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

module.exports = app;