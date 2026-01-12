import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../backend/services/authService";
import { Eye, EyeOff, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import ForgotPasswordModal from "./ForgotPasswordModal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    const toastId = toast.loading("Logging in...");

    try {
      await loginUser(email, password);
      toast.success("Login successful!", { id: toastId });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Invalid email or password", { id: toastId });
    }
  };

  return (
    <>
      {/* ✅ Forgot Password Modal */}
      {showResetModal && (
        <ForgotPasswordModal onClose={() => setShowResetModal(false)} />
      )}
      <div className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden font-sans">
        {/* Logo Section - Top Left */}
        <div className="absolute top-6 left-6 z-20">
          <img
            src="/assets/Mentor-Water-Pvt-Ltd-Logo-.png.webp"
            alt="Company Logo"
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* Decorative Background Shapes */}
        <div className="absolute -left-24 -bottom-24 w-[400px] h-[400px] bg-gradient-to-tr from-[#6d99db] to-[#73c9de] rounded-[60px] rotate-[35deg] opacity-80 hidden lg:block"></div>
        <div className="absolute -right-24 -top-24 w-[400px] h-[400px] bg-gradient-to-bl from-[#6d99db] to-[#73c9de] rounded-[60px] rotate-[35deg] opacity-80 hidden lg:block"></div>

        {/* Login Card */}
        <div className="z-10 w-full max-w-md px-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8 leading-tight">
            Complaint Management System
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-500 font-medium ml-1">
                Username
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-gray-700 transition-all"
                placeholder="Enter Username"
                required
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-500 font-medium ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-gray-700 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="text-right mt-1">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-3">
              <button
                type="submit"
                className="w-full bg-[#007bff] text-white py-3 rounded-full font-bold text-lg hover:bg-blue-600 transition-all shadow-md active:scale-[0.98]"
              >
                Login
              </button>

              {/* NEW COMPLAINT BUTTON (Public Route) */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase font-bold tracking-wider">
                  or
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/complaint-form")}
                className="w-full bg-white border-2 border-emerald-500 text-emerald-600 py-3 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <PlusCircle size={16} />
                Register New Complaint
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
