import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51RJziRFogRMHWstiZbIxKG3nT9bm0YxLJP3FEf7Ago4DOXtRzuOBYQRzXKWuxLfkB046wvVAdV8pDhdbODF5dCme0057A3hAUF");

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

const handleSubmit = async (event) => {
  event.preventDefault();
  setProcessing(true);

  try {
    const response = await fetch("http://localhost:5000/api/payment/create-payment-intent", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.message || "Failed to create payment intent");
      setProcessing(false);
      return;
    }

    const { clientSecret } = await response.json();

    const cardElement = elements.getElement(CardElement);

    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (paymentResult.error) {
      setError(paymentResult.error.message);
      setProcessing(false);
    } else if (paymentResult.paymentIntent.status === "succeeded") {
      setSuccess(true);
      setError(null);
      setProcessing(false);
      alert("Payment successful! Thank you for your purchase.");
    }
  } catch (err) {
    setError("Network error or server down");
    setProcessing(false);
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || processing}>
        {processing ? "Processing..." : "Pay Now"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>Payment successful!</div>}
    </form>
  );
}

export default function StripeCheckout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
