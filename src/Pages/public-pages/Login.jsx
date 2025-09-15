import { RiLockPasswordFill } from "react-icons/ri";
import { HiOutlineMailOpen } from "react-icons/hi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import authApi from "../../Api/RestAPI";
import { AuthContext } from "../AuthContext";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginType, setLoginType] = useState("user");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    const savedRemember = localStorage.getItem("rememberMe") === "true";
    if (savedRemember && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("⚠️ Please fill in all fields");
      return;
    }

    try {
      const endpoint =
        loginType === "doctor" ? "/auth/doctor-login" : "/auth/login";

      const response = await authApi.post(endpoint, { email, password });

      if (response.status === 200) {
        const { token, username, userID, role } = response.data;

        // Save session
        login(token, userID, username, role);
        localStorage.setItem("authToken", token);
        localStorage.setItem("role", role);

        if (rememberMe) {
          localStorage.setItem("userEmail", email);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("userEmail");
          localStorage.setItem("rememberMe", "false");
        }

        // Navigate based on role
        if (role === "ADMIN") {
          navigate("/admin-dashboard");
        } else if (role === "DOCTOR" || loginType === "doctor") {
          navigate("/hcp-dashboard");
        } else {
          navigate("/");
        }
      } else {
        alert("❌ Invalid email or password.");
      }
    } catch (error) {
      // Log for debugging only (hidden from recruiters/users)
      console.error("Login error:", error);

      // Generic safe message
      alert("❌ Login failed. Please check your credentials and try again.");
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Welcome Back 👋
          </h1>
          <p className="text-gray-700 text-sm mt-2">
            Please login to continue to{" "}
            <span className="text-blue-700 font-semibold">MindMitra</span>
          </p>
        </div>

        {/* Login Type Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-200 p-1 rounded-xl flex">
            <button
              type="button"
              onClick={() => setLoginType("user")}
              aria-label="Login as User"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                loginType === "user"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700"
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setLoginType("doctor")}
              aria-label="Login as Doctor"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                loginType === "doctor"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-700"
              }`}
            >
              Doctor
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <input
              type="email"
              placeholder="Email Address"
              aria-label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white/70"
              required
            />
            <HiOutlineMailOpen
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg"
            />
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white/70"
              required
            />
            <RiLockPasswordFill
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg"
            />
            {showPassword ? (
              <AiFillEyeInvisible
                aria-label="Hide password"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <AiFillEye
                aria-label="Show password"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </motion.div>

          {/* Remember Me + Forgot */}
          <div className="flex items-center justify-between text-sm text-gray-700">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-500 border-gray-300 rounded"
              />
              <span>Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg transition-all"
          >
            {loginType === "doctor" ? "Login as Doctor" : "Login"}
          </motion.button>
        </form>

        {/* Footer */}
        {loginType === "user" && (
          <p className="text-center text-gray-700 text-sm mt-6">
            New here?{" "}
            <Link
              to="/register"
              className="text-blue-700 font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};
