import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe("pk_test_51RJziRFogRMHWstiZbIxKG3nT9bm0YxLJP3FEf7Ago4DOXtRzuOBYQRzXKWuxLfkB046wvVAdV8pDhdbODF5dCme0057A3hAUF"); // Replace with your real key

const CartComponent = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/cart", {
        withCredentials: true,
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, volume, newQuantity) => {
    try {
      if (newQuantity < 1) {
        await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
          data: { volume },
          withCredentials: true,
        });
      } else {
        await axios.put(
          "http://localhost:5000/api/cart",
          { productId, volume, quantity: newQuantity },
          { withCredentials: true }
        );
      }

      const { data } = await axios.get("http://localhost:5000/api/cart", {
        withCredentials: true,
      });

      setCartItems(data.items);

      if (data.items.length === 0) navigate("/Home");
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const removeItem = async (productId, volume) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/cart/${productId}`,
        {
          withCredentials: true,
          data: { volume },
        }
      );
      setCartItems(res.data.cart.items || []);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const handleCheckout = async () => {
    if (!stripe || !elements) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/create-payment-intent",
        {},
        { withCredentials: true }
      );

      const clientSecret = res.data.clientSecret;
      const cardElement = elements.getElement(CardElement);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Customer",
          },
        },
      });

      if (result.error) {
        console.error("Payment failed:", result.error.message);
        alert("Payment failed: " + result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        alert("Payment successful!");
        navigate("/success");
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <div className="p-6 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <ShoppingCart size={30} className="text-indigo-600" /> Shopping Cart
      </h1>

      {loading ? (
        <p className="mt-6 text-gray-500">Loading cart...</p>
      ) : error ? (
        <p className="mt-6 text-red-500">{error}</p>
      ) : cartItems.length === 0 ? (
        <div className="mt-6 text-center animate-pulse">
          <ShoppingCart size={50} className="text-gray-400 mx-auto" />
          <p className="text-gray-600 text-lg mt-2">
            Your cart is currently empty.
          </p>
          <Link
            to="/Home"
            className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 w-full max-w-3xl px-4">
          {cartItems.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <div
                key={`${product._id}-${item.volume}`}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`http://localhost:5000${product.image}`}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="text-gray-600">
                      ${product.price} x {item.quantity}
                    </p>
                    <p className="text-gray-500">Volume: {item.volume} ml</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        className="bg-gray-300 p-1 rounded hover:bg-gray-400 disabled:opacity-50"
                        onClick={() =>
                          updateQuantity(
                            product._id,
                            item.volume,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity === 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-lg font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        className="bg-gray-300 p-1 rounded hover:bg-gray-400"
                        onClick={() =>
                          updateQuantity(
                            product._id,
                            item.volume,
                            item.quantity + 1
                          )
                        }
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        className="ml-4 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                        onClick={() => removeItem(product._id, item.volume)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-lg font-bold">
                  ${(product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            );
          })}

          <div className="mt-6 flex justify-between items-center text-xl font-bold">
            <p>Total:</p>
            <p>${getTotal().toFixed(2)}</p>
          </div>

          {/* Stripe Card Element */}
          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Card Details
            </label>
            <div className="border p-3 rounded-md">
              <CardElement />
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Proceed to Pay
          </button>
        </div>
      )}
    </div>
  );
};

// Wrap the CartComponent with Elements
const Cart = () => (
  <Elements stripe={stripePromise}>
    <CartComponent />
  </Elements>
);

export default Cart;
