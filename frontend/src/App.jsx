import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ToastContainer />
          <Navbar />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} /> 
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/products" element={<Products/>} />
            <Route path="/product/:id" element={<ProductDetails/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/review" element={<Reviews/>} />
            <Route path="/privacy" element={<Privacy/>} />
            <Route path="/terms" element={<Terms/>} />
            <Route path="/cancellation" element={<Cancellation/>} />
            <Route path="/shipping" element={<Shipping/>} />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <Checkout/>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-orders" 
              element={
                <ProtectedRoute>
                  <Orders/>
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

          <MudgarFooter />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;