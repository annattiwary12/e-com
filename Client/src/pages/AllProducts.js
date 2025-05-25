import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard"; // Ensure the path is correct

const API_URL = "http://localhost:5000/api/products"; // Update with your correct API URL

// Function to fetch products from the API
const fetchProducts = async (page, limit) => {
  try {
    const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
    return response.data; // Ensure your backend returns this structure: { products: [], totalPages: 1 }
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], totalPages: 1 }; // Default fallback in case of error
  }
};

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 4; // Number of products per page

  // Fetch products whenever the current page changes
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { products, totalPages } = await fetchProducts(currentPage, limit);
        setProducts(products);
        setTotalPages(totalPages);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [currentPage]); // Fetch products when currentPage changes

  // Handle page changes when Prev or Next is clicked
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">All Products</h2>

      {/* Loading state */}
      {isLoading && <p className="text-center text-gray-500 text-lg">Loading...</p>}

      {/* Error state */}
      {error && <p className="text-center text-red-500 text-lg">{error}</p>}

      {/* Product Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 text-xl">
              No products found.
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-4">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {/* Page Info */}
          <span className="font-semibold text-lg">
            Page {currentPage} of {totalPages}
          </span>

          {/* Next Button */}
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

export default AllProducts;
