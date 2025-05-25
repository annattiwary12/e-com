import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const limit = 4; // Number of products per page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products?page=${currentPage}&limit=${limit}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data); // For debugging

        setProducts(data.products || []); // Set products
        setTotalPages(data.totalPages || 1); // Set total pages for pagination
      } catch (error) {
        setError(`Error: ${error.message}`);
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]); // Fetch data when the currentPage changes

  // Pagination button handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6">
      {/* Call to Action Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center p-8 rounded-lg shadow-lg transition-all duration-500 hover:scale-105 mt-4">
        <h1 className="text-4xl font-bold animate-pulse">
          Discover Our Exclusive Perfume Collection
        </h1>
        <p className="mt-2 text-lg">Luxury fragrances crafted for you</p>
        <button
          aria-label="Shop Now"
          className="mt-4 bg-white text-indigo-600 font-bold px-6 py-2 rounded-lg transition-all transform hover:scale-105 hover:bg-gray-200 hover:shadow-md"
        >
          Shop Now
        </button>
      </div>

      {/* Section Title */}
      <h2 className="text-3xl font-bold text-center text-gray-800 mt-6">
        Featured Perfumes
      </h2>
      <p className="text-center text-gray-500 mt-2">
        Explore our exclusive collection
      </p>

      {/* Handle Loading & Error States */}
      {loading ? (
        <div className="flex justify-center mt-6">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500 text-lg mt-6">⚠️ {error}</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-6">
          No products available.
        </p>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-semibold text-lg">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
