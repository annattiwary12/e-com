import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Facebook, Twitter, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([
    { user: "Rahul", comment: "Amazing fragrance!" },
    { user: "Anant", comment: "Lasts all day, love it!" },
  ]);
  const [newReview, setNewReview] = useState("");
  const [quantity, setQuantity] = useState(1);

   const navigate = useNavigate();
  useEffect(() => {
    if (!id || id === "undefined") {
      setError("Invalid Product ID");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error(`Server Error ${res.status}`);
        const data = await res.json();
        setProduct(data);
        setSelectedImage(`http://localhost:5000${data.image}`);
        if (data.volumes?.length > 0) setSelectedVolume(data.volumes[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addReview = () => {
    if (newReview.trim() === "") return;
    setReviews((prev) => [...prev, { user: "Guest", comment: newReview }]);
    setNewReview("");
  };

  const handleAddToCart = async () => {
  if (!product || !selectedVolume) {
    alert("Please select a volume");
    return;
  }

  const cartItem = {
    id: product._id,
    name: product.name,
    image: selectedImage,
    price: product.price,
    volume: selectedVolume,
    quantity,
  };

  const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItemIndex = storedCart.findIndex(
    (item) => item.id === cartItem.id && item.volume === cartItem.volume
  );

  if (existingItemIndex !== -1) {
    storedCart[existingItemIndex].quantity += quantity;
  } else {
    storedCart.push(cartItem);
  }

  localStorage.setItem("cart", JSON.stringify(storedCart));
  alert("✅ Item added to cart");

  navigate("/cart"); // ✅ Go to Cart page
};


  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    const toast = document.createElement("div");
    toast.innerText = "✅ Link copied!";
    toast.className =
      "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg z-50";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  if (loading)
    return (
      <div className="flex justify-center mt-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 text-2xl mt-10">
        ⚠️ {error}
      </div>
    );

  return (
    <div className="p-8 flex flex-col items-center bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg text-center w-full">
        <img
          src={selectedImage}
          alt={product?.name || "Product"}
          className="h-64 w-64 object-cover rounded-xl shadow-md hover:scale-105 transition"
        />

        <div className="flex gap-2 mt-4 justify-center">
          {product?.images?.length > 0 ? (
            product.images.map((img, index) => {
              const fullPath = `http://localhost:5000/images/${img}`;
              return (
                <img
                  key={index}
                  src={fullPath}
                  alt="Thumbnail"
                  className={`w-16 h-16 rounded-lg cursor-pointer border-2 ${
                    selectedImage === fullPath
                      ? "border-indigo-600"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(fullPath)}
                />
              );
            })
          ) : (
            <p className="text-gray-500">No additional images</p>
          )}
        </div>

        <h1 className="text-4xl font-extrabold mt-6 text-gray-900">
          {product?.name}
        </h1>

        <p className="text-2xl text-indigo-600 font-semibold mt-3">
          ${product?.price}
        </p>

        <p className="mt-4 text-gray-700 text-lg">{product?.description}</p>

        <p className="mt-4 font-semibold">Available Volumes:</p>
        <div className="flex gap-2 mt-2 flex-wrap justify-center">
          {product?.volumes?.length > 0 ? (
            product.volumes.map((vol, index) => (
              <button
                key={index}
                onClick={() => setSelectedVolume(vol)}
                className={`px-3 py-1 border rounded-md transition ${
                  selectedVolume === vol
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {vol} ml
              </button>
            ))
          ) : (
            <span className="text-gray-500">No volume options</span>
          )}
        </div>

        <div className="mt-6">
          <label className="font-medium mr-2">Quantity:</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 p-2 border rounded text-center"
          />
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-6 w-full text-lg font-semibold py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-md"
        >
          🛒 Add to Cart
        </button>
      </div>

      {/* Reviews Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet.</p>
        ) : (
          <ul className="space-y-2">
            {reviews.map((review, index) => (
              <li key={index} className="bg-gray-100 p-3 rounded-lg">
                <strong>{review.user}:</strong> {review.comment}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            className="flex-grow p-2 border rounded-lg"
            placeholder="Write a review..."
          />
          <button
            onClick={addReview}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Post
          </button>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="mt-6 flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
          <Facebook size={18} /> Share
        </button>
        <button className="bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-500 transition">
          <Twitter size={18} /> Tweet
        </button>
        <button
          onClick={copyToClipboard}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition"
        >
          <Share2 size={18} /> Copy Link
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
