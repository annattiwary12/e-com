import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  const addToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);

    try {
      // Send to backend
      await axios.post(
        "http://localhost:5000/api/cart",
        {
          productId: product._id,
          volume: "500", // Default volume for now
          quantity: 1,
        },
        {
          withCredentials: true, // Send session cookie
        }
      );

      navigate("/cart"); // Redirect to cart
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 p-4">
      <img
        src={`http://localhost:5000${product.image}`}
        alt={product.name}
        className="h-40 w-full object-cover rounded-t-2xl"
        onError={(e) => (e.target.src = "/default-image.jpg")}
      />
      <div className="p-4 text-center">
        <h2 className="text-gray-900 text-lg font-bold">{product.name}</h2>
        <p className="text-gray-700 text-lg font-bold mt-1">${product.price}</p>
      </div>
      <div className="flex flex-col items-center gap-2 pb-4">
        <Link to={`/product/${product._id}`} className="w-full">
          <button className="bg-indigo-600 text-white px-4 py-2 w-full rounded-lg hover:bg-indigo-700 transition-all">
            View Details
          </button>
        </Link>
        <button
          onClick={addToCart}
          disabled={isAdding}
          className={`bg-green-500 text-white px-4 py-2 w-full rounded-lg hover:bg-green-600 transition-all ${
            isAdding ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
