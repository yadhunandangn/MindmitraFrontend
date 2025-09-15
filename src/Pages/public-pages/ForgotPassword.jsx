import { HiOutlineMailOpen } from "react-icons/hi";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../../Api/RestAPI";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email.");
      setMessage("");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.post("/auth/forgot-password", { email });

      if (response.status === 200) {
        // Use generic message to prevent email enumeration
        setMessage("✅ If the email exists, an OTP has been sent.");
        setError("");

        // Navigate after 1.5s
        setTimeout(() => {
          navigate("/reset-password", { state: { email } });
        }, 1500);
      } else {
        setError("Something went wrong. Please try again.");
        setMessage("");
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Forgot Password error:", err);
      }
      setError("Something went wrong. Please try again.");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-black items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/30 mt-20 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Forgot Password
          </h1>
          <p className="text-gray-700 text-sm mt-2">
            Enter your email to receive OTP.
          </p>
        </div>

        {/* Feedback */}
        {message && (
          <p
            className="text-green-600 text-center font-medium mb-4"
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}
        {error && (
          <p
            className="text-red-600 text-center font-medium mb-4"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email Address"
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white/70"
            />
            <HiOutlineMailOpen
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg"
              aria-hidden="true"
            />
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg transition-all"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-blue-700 font-medium hover:underline flex items-center justify-center gap-1"
          >
            <AiOutlineArrowLeft aria-hidden="true" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
