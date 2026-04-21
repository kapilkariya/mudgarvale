# Mudgarvale Backend

Complete backend for Mudgarvale e-commerce website built with Node.js, Express, MongoDB, and JWT authentication with OTP verification.

## Tech Stack

- **Node.js + Express** - Server framework
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication tokens
- **Nodemailer** - Email/OTP service
- **Cloudinary** - Image storage
- **Multer** - File upload handling

## Project Structure

```
backend/
├── config/
│   ├── cloudinary.js      # Cloudinary image upload config
│   └── database.js         # MongoDB connection
├── controllers/
│   ├── authController.js  # Login/signup with OTP
│   └── productController.js # CRUD operations
├── middleware/
│   ├── auth.js             # JWT verification + admin check
│   └── errorHandler.js     # Global error handling
├── models/
│   ├── OTP.js              # OTP storage schema
│   ├── Product.js          # Product schema
│   └── User.js             # User schema
├── routes/
│   ├── authRoutes.js       # Auth endpoints
│   └── productRoutes.js    # Product endpoints
├── utils/
│   ├── email.js            # Email/OTP sending
│   └── jwt.js              # Token generation
├── .env.example            # Environment variables template
├── package.json
├── README.md
└── server.js               # Main entry point
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# MongoDB (local or MongoDB Atlas)
MONGODB_URI=mongodb://localhost:27017/mudgarvale
# OR for Atlas: mongodb+srv://user:password@cluster.mongodb.net/mudgarvale

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Admin Email - Only this email gets admin privileges
ADMIN_EMAIL=admin@mudgarvale.com

# Nodemailer (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password  # Use App Password, not your Gmail password

# Cloudinary (get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173  # Your frontend URL
```

### 3. Setup Gmail App Password (for OTP emails)

1. Go to Google Account Settings → Security
2. Enable 2-Step Verification
3. Go to "App passwords"
4. Generate app password for "Mail"
5. Use this password in `EMAIL_PASS`

### 4. Setup Cloudinary (for images)

1. Create free account at cloudinary.com
2. Go to Dashboard → copy Cloud Name, API Key, API Secret
3. Add to `.env`

### 5. Run the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/send-signup-otp` | Send OTP for signup | Public |
| POST | `/api/auth/verify-signup` | Verify OTP & create account | Public |
| POST | `/api/auth/send-login-otp` | Send OTP for login | Public |
| POST | `/api/auth/verify-login` | Verify OTP & login | Public |
| GET | `/api/auth/me` | Get current user | Private |
| POST | `/api/auth/logout` | Logout user | Private |

### Products

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products?category=mudgar` | Filter by category | Public |
| GET | `/api/products/category/:category` | Get by category | Public |
| GET | `/api/products/:id` | Get single product | Public |
| POST | `/api/products` | Create product | Admin Only |
| PUT | `/api/products/:id` | Update product | Admin Only |
| DELETE | `/api/products/:id` | Delete product | Admin Only |

## Product Data Structure

```json
{
  "name": "Classic Mudgar",
  "description": "Traditional wooden mudgar...",
  "category": "mudgar",
  "image": "https://cloudinary.com/...",
  "weights": ["5kg", "8kg", "10kg"],
  "pricePerWeight": {
    "5kg": 500,
    "8kg": 750,
    "10kg": 900
  }
}
```

## Category Enum

Valid categories: `mudgar`, `gada`, `samtola`, `senaboard`

## Admin Access

The user with email matching `ADMIN_EMAIL` in `.env` automatically gets:
- `role: "admin"` in database
- Access to protected admin routes

## Important Implementation Notes

### OTP Flow
1. User enters email → `send-login-otp` sends 6-digit code
2. User enters OTP → `verify-login` validates and returns JWT
3. JWT stored in localStorage for subsequent requests

### Image Upload
- Images uploaded to Cloudinary
- Only URLs stored in database
- Auto-resized to max 800x800

### Security
- Passwords hashed with bcrypt
- JWT for session management
- OTPs expire in 10 minutes
- Protected routes use `protect` middleware
- Admin routes use `adminOnly` middleware

## Testing with curl

```bash
# Test server
 curl http://localhost:5000/api/health

# Get all products
 curl http://localhost:5000/api/products

# Get products by category
 curl http://localhost:5000/api/products/category/mudgar
```

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running locally
- Or verify MongoDB Atlas connection string

### Email Not Sending
- Verify Gmail App Password (not regular password)
- Check "Less secure app access" settings
- Try different email provider (Mailtrap for testing)

### Image Upload Fails
- Verify Cloudinary credentials
- Check file size (max Cloudinary free tier is 10MB)

## License

MIT
