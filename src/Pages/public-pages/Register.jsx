import { useState } from "react";
import { motion } from "framer-motion";
import { CiUser } from "react-icons/ci";
import { HiOutlineMailOpen } from "react-icons/hi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import authApi from "../../Api/RestAPI";
import { useNavigate, Link } from "react-router-dom";

export const Reg = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", msg: "" });

  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!email) {
      setFeedback({ type: "error", msg: "Please enter your email." });
      return;
    }
    try {
      setLoading(true);
      const response = await authApi.post("/auth/send-otp", { email });
      setFeedback({ type: "success", msg: response.data || "OTP sent!" });
      setOtpSent(true);
    } catch (error) {
      setFeedback({
        type: "error",
        msg: error.response?.data || "Failed to send OTP. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setFeedback({ type: "error", msg: "Please enter the OTP." });
      return;
    }
    try {
      setLoading(true);
      const response = await authApi.post("/auth/verify-otp", { email, otp });
      if (response.data === "OTP verified successfully") {
        setFeedback({ type: "success", msg: "✅ Email verified successfully!" });
        setOtpVerified(true);
      } else {
        setFeedback({ type: "error", msg: response.data || "Invalid OTP" });
      }
    } catch (error) {
      setFeedback({
        type: "error",
        msg: error.response?.data || "OTP verification failed",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Register
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !fullName || !password || !email) {
      setFeedback({
        type: "error",
        msg: "Please complete all fields after verifying your email.",
      });
      return;
    }

    try {
      setLoading(true);
      await authApi.post(`/auth/create-profile`, {
        username,
        fullName,
        email,
        password,
      });
      setFeedback({ type: "success", msg: "🎉 Registration successful!" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setFeedback({
        type: "error",
        msg: error.response?.data || "Registration failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-black flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8"
      >
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Create Your Account 🚀
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Register to join{" "}
          <span className="text-blue-600 font-semibold">MindMitra</span>
        </p>

        {/* Feedback */}
        {feedback.msg && (
          <p
            className={`text-center mb-4 font-medium ${
              feedback.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {feedback.msg}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative flex"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={otpSent}
            />
            <HiOutlineMailOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
            {!otpSent && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 rounded-xl transition shadow-md disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            )}
          </motion.div>

          {/* OTP */}
          {otpSent && !otpVerified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex space-x-2"
            >
              <input
                type="text"
                placeholder="Enter OTP"
                className="flex-1 pl-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition text-gray-800"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-xl transition shadow-md disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </motion.div>
          )}

          {/* Registration fields */}
          {otpVerified && (
            <>
              {/* Full Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <CiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
              </motion.div>

              {/* Username */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <CiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                {showPassword ? (
                  <AiFillEyeInvisible
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <AiFillEye
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </motion.div>

              {/* Register Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg transition mt-2 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
              </motion.button>
            </>
          )}
        </form>

        {/* Already have account */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
