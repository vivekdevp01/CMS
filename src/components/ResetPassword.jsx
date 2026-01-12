import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAuth, confirmPasswordReset } from "firebase/auth";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const oobCode = params.get("oobCode");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Resetting password...");

    try {
      const auth = getAuth();
      await confirmPasswordReset(auth, oobCode, password);

      toast.success("Password reset successful 🎉", { id: toastId });

      // 👇 Switch UI instead of immediate navigation
      setSuccess(true);

      // 👇 Smooth redirect
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      console.error(err);
      toast.error("Invalid or expired reset link", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 transition-all">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* SUCCESS STATE */}
        {success ? (
          <div className="p-8 text-center animate-fadeIn">
            <CheckCircle className="mx-auto text-green-500" size={56} />
            <h2 className="text-2xl font-bold mt-4">Password Reset!</h2>
            <p className="text-gray-600 mt-2">
              Your password has been updated successfully.
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Redirecting to login...
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
              <div className="flex justify-center mb-2">
                <div className="bg-white/20 p-3 rounded-full">
                  <Lock className="text-white" size={28} />
                </div>
              </div>
              <h1 className="text-xl font-bold text-white">
                Reset Your Password
              </h1>
              <p className="text-blue-100 text-sm mt-1">
                Create a new secure password
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleReset} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  New Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-blue-500"
                  placeholder="Re-enter password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold text-white ${
                  loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
