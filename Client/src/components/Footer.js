import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white text-center py-4">
      <p>&copy; {new Date().getFullYear()} @Anant Tiwary   Perfume Store. All rights reserved.</p>
      <div className="flex justify-center space-x-4 mt-2">
        <FaFacebook className="text-white text-xl cursor-pointer" />
        <FaInstagram className="text-white text-xl cursor-pointer" />
        <FaTwitter className="text-white text-xl cursor-pointer" />
      </div>
    </footer>
  );
};

export default Footer;
