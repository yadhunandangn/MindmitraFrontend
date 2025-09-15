import { useState } from "react";
import authApi from "../../Api/RestAPI";

export const HcpSettings = () => {
  const [email, setEmail] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await authApi.put("/hcp/update-profile", {
        email,
        specialization,
        phone,
      });
      setMessage(response.data || "Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data || "Failed to update profile.");
    }
  };

  // Handle password update
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await authApi.put("/hcp/change-password", {
        password,
      });
      setMessage(response.data || "Password changed successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data || "Failed to change password.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black overflow-y-auto p-6">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          ⚙️ HCP Settings
        </h1>

        {/* Update Profile */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Update Profile</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <input
              type="email"
              placeholder="Update Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              required
            />
            <input
              type="text"
              placeholder="Specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md transition"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div>
          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow-md transition"
            >
              Change Password
            </button>
          </form>
        </div>

        {/* Feedback Messages */}
        {message && <p className="text-green-600 text-center mt-4">{message}</p>}
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};
