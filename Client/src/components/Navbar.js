import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaShoppingCart, FaBars, FaSun, FaMoon } from "react-icons/fa";

const Navbar = ({ cartCount = 0, darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={`bg-gray-900 text-white p-4 flex items-center justify-between relative ${darkMode ? "dark" : ""}`}>
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold">Perfume Store</Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 items-center">
        <NavLink to ="/Login" className={({ isActive }) => isActive ? "text-yellow-400" : ""}>Login</NavLink>
        <NavLink to="/Home" className={({ isActive }) => isActive ? "text-yellow-400" : ""}>Home</NavLink>
        <NavLink to="/cart" className={({ isActive }) => isActive ? "text-yellow-400" : ""}>
          Cart <FaShoppingCart className="inline ml-1" />
          {cartCount > 0 && <span className="ml-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs">{cartCount}</span>}
        </NavLink>
        <button 
          onClick={toggleDarkMode} 
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-900" />}
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden" aria-label="Toggle Menu">
        <FaBars size={24} />
      </button>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div ref={menuRef} className="absolute top-full left-0 w-full bg-gray-800 flex flex-col items-center space-y-4 p-4 md:hidden transition-transform transform translate-y-0 opacity-100">
          <NavLink to="/" className="text-white" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
          <NavLink to="/cart" className="text-white" onClick={() => setIsMenuOpen(false)}>
            Cart <FaShoppingCart className="inline" />
            {cartCount > 0 && <span className="ml-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs">{cartCount}</span>}
          </NavLink>
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-900" />}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;