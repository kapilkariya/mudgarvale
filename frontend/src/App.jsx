import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import MudgarFooter from "./components/Footer";
import BlogsPage from "./pages/BlogListing";
import BlogDetail from "./pages/BlogDetail";
import About from "./pages/Aboutus";
import ContactPage from "./pages/Contact";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} /> //dynamic route
        <Route path="/about-us" element={<About />} />
        <Route path="/contact" element={<ContactPage />} />


      </Routes>

      <MudgarFooter />
    </Router>
  );
}

export default App;