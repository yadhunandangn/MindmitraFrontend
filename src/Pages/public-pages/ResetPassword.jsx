import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import authApi from "../../Api/RestAPI";

export const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp || !newPassword) {
      setError("⚠️ Please fill all fields.");
      setMessage("");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      if (response.status === 200) {
        setMessage("✅ Password reset successful! Redirecting to login...");
        setError("");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("❌ Failed to reset password. Try again.");
        setMessage("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-black items-center justify-center bg-gradient-to-br from-purple-200 via-pink-200 to-red-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/30 mt-20 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-8"
      >
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">Reset Password</h1>
          <p className="text-gray-700 text-sm mt-2">
            Enter your email, OTP, and new password.
          </p>
        </header>

        {/* Feedback */}
        {message && (
          <p className="text-green-600 text-center font-medium mb-4" role="alert">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 text-center font-medium mb-4" role="alert">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            aria-label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none transition bg-white/70"
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="OTP"
            aria-label="One-Time Password"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none transition bg-white/70"
          />
          <input
            type="password"
            placeholder="New Password"
            aria-label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full px-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none transition bg-white/70"
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg transition-all"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-purple-700 font-medium hover:underline flex items-center justify-center gap-1"
          >
            <AiOutlineArrowLeft aria-hidden="true" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
