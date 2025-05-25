import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const SuccessForm = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md w-full">
        <CheckCircle className="mx-auto text-green-500 w-16 h-16" />
        <h2 className="text-3xl font-bold text-green-600 mt-4">Payment Successful</h2>
        <p className="text-gray-600 mt-2">
          Thank you! Your payment has been processed successfully.
        </p>
        <button
          onClick={handleBackHome}
          className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessForm;
