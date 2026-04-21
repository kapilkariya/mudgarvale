import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Add/>
              </ProtectedRoute>
            } 
          />
        </Routes>

        <MudgarFooter />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;