import React, { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { resetPassword } from "../backend/services/authService";

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      toast.success("Password reset link sent to your email 📧");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-2">Reset Password</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter your registered email address. We’ll send you a reset link.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-blue-400/50"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
