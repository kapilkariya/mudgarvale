import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import MudgarFooter from "./components/Footer";
import BlogsPage from "./pages/BlogListing";
import BlogDetail from "./pages/BlogDetail";
import About from "./pages/Aboutus";
import ContactPage from "./pages/Contact";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Add from "./adminpages/Add";
import AdminLayout from "./adminpages/AdminLayout";
import AdminDashboard from "./adminpages/AdminDashboard";
import AdminProducts from "./adminpages/AdminProducts";
import EditProduct from "./adminpages/EditProduct";
import AdminOrders from "./adminpages/AdminOrders";
import Reviews from "./pages/Reviews";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cancellation from "./pages/Cancellation";
import Shipping from "./pages/Shipping";
import SepPayement from "./pages/SepPayement";
import Thankyou from "./pages/Thankyou";

// Create a wrapper component for page tracking
const AppRoutes = () => {
  const location = useLocation();

  // ✅ Track page views for Google Analytics (NOT as conversion)
  useEffect(() => {
    if (window.gtag) {
      // Send page view to Google Analytics
      window.gtag('event', 'page_view', {
        'page_title': document.title,
        'page_location': window.location.href,
        'page_path': location.pathname
      });
    }

    // Track with Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location]); // Runs every time route changes

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blogs" element={<BlogsPage />} />
      <Route path="/blogs/:slug" element={<BlogDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/review" element={<Reviews />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/cancellation" element={<Cancellation />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/otherpayement" element={<SepPayement />} />
      <Route path="/thankyou" element={<Thankyou />} />
      // In App.js, update the routes section:

      {/* Products and its sub-routes - all using the same Products component */}
      <Route path="/products" element={<Products />} />
      <Route path="/products/mudgar" element={<Products />} />
      <Route path="/products/gada" element={<Products />} />
      <Route path="/products/samtola" element={<Products />} />
      <Route path="/products/senaboard" element={<Products />} />
      <Route path="/products/decor" element={<Products />} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      {/* Admin Routes with Layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/add" element={<Add />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>

      {/* Legacy admin route - redirect to new /admin */}
      <Route path="/admin-dashboard" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ToastContainer />
          <Navbar />

          <AppRoutes />

          <MudgarFooter />
        </Router>
      </CartProvider>

      {/* WhatsApp Floating Button */}
      <div
        onClick={() => window.open(`https://wa.me/9327223973`, '_blank')}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#25D366',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          zIndex: 1000,
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          width="32"
          height="32"
          fill="white"
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.2-17.1-41.3-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.1 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>
      </div>
    </AuthProvider>
  );
}

export default App;