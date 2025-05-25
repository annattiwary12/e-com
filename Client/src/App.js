import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import AllProducts from "./pages/AllProducts";
import Cart from "./pages/Cart";
import ProductCard from "./components/ProductCard";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/RestPassword";
import SignupForm from "./pages/SignupForm";
import StripeCheckout from "./pages/CheckoutForm";
import SuccessForm from "./pages/SuccessForm";

const App = () => {
  // State for cart items
  const [cartItems,setCartItems] = useState([]);

  // State for dark mode
  const [darkMode,setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // State for authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check user authentication on load

useEffect(() => {
  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user", {
  
        credentials: "include",

      });
 
      if (!response.ok) {
        setIsAuthenticated(false);
        return;
      }

      const data = await response.json();
      setIsAuthenticated(!!data?.username);
    } catch (error) {
      console.error("Error checking authentication:", error);
      setIsAuthenticated(false);
    }
  };

  checkAuth();
  
  

}, []);

  // Effect to update dark mode styles and save preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Toggle function for dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Add product to cart
  const addToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  return (
    <Router>
      <div
        className={`flex flex-col min-h-screen ${
          darkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Navbar with dark mode toggle */}
        <Navbar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          isAuthenticated={isAuthenticated}
        />

        <main className="flex-grow p-6">
          <Routes>
            <Route path = "/"element =<Login setIsAuthenticated={setIsAuthenticated} /> />
            <Route path="/Home" element={<Home addToCart={addToCart} />} />
            <Route
              path="/product/:id"
              element={<ProductDetails addToCart={addToCart} />}
            />
            <Route
              path="/cart"
              element={
                <Cart
                  cartItems={cartItems}
                  removeFromCart={removeFromCart}
                />
              }
            />
            <Route
              path="/products"
              element={<AllProducts addToCart={addToCart} />}
            />
            <Route path="/product-card" element={<ProductCard />} />
            <Route
              path="/Login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/Signup" element={<SignupForm />} />
            <Route path="/checkout" element={<StripeCheckout />} />
            <Route path="/success" element={<SuccessForm />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
