import { useState, useEffect } from "react";
import authApi from "../../Api/RestAPI";

export const AdminSettings = () => {
  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminUsername, setNewAdminUsername] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const adminId = localStorage.getItem("adminId");

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await authApi.get("/admin/all");
      setAdmins(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("Could not load admins.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await authApi.put("/admin/update-profile", { email });
      setAdmins((prev) =>
        prev.map((a) => (a.username === response.data.username ? response.data : a))
      );
      setMessage("Profile updated successfully.");
      setEmail("");
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data || "Failed to update profile.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await authApi.put("/admin/change-password", { id: adminId, password });
      setMessage("Password changed successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data || "Failed to change password.");
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await authApi.post("/admin/add", {
        email: newAdminEmail,
        password: newAdminPassword,
        username: newAdminUsername || newAdminEmail.split("@")[0],
      });
      setAdmins((prev) => [...prev, response.data]);
      setMessage("New admin added successfully.");
      setNewAdminEmail("");
      setNewAdminPassword("");
      setNewAdminUsername("");
    } catch (err) {
      setError(err.response?.data || "Failed to add admin.");
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      await authApi.delete(`/admin/delete/${id}`);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      setMessage("Admin deleted successfully.");
    } catch (err) {
      setError("Failed to delete admin.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 flex flex-col gap-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-800">
          Admin Settings
        </h1>

        {/* Update Profile */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Update Profile</h2>
          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Update Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md transition"
            >
              Update Profile
            </button>
          </form>
        </section>

        {/* Change Password */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Change Password</h2>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow-md transition"
            >
              Change Password
            </button>
          </form>
        </section>

        {/* Add New Admin */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Add New Admin</h2>
          <form onSubmit={handleAddAdmin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Admin Email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Admin Name"
              value={newAdminUsername}
              onChange={(e) => setNewAdminUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="Admin Password"
              value={newAdminPassword}
              onChange={(e) => setNewAdminPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold shadow-md transition"
            >
              Add Admin
            </button>
          </form>
        </section>

        {/* List of Admins */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Manage Admins</h2>
          {loading ? (
            <p className="text-gray-500">Loading admins...</p>
          ) : admins.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {admins.map((admin) => (
                <li
                  key={admin.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-xl shadow-sm bg-gray-50 gap-2 sm:gap-0"
                >
                  <span className="break-words">{admin.email}</span>
                  <button
                    onClick={() => handleDeleteAdmin(admin.id)}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg w-full sm:w-auto"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No admins found.</p>
          )}
        </section>

        {/* Messages */}
        {message && (
          <p className="text-green-600 text-center mt-4 font-semibold">✅ {message}</p>
        )}
        {error && (
          <p className="text-red-600 text-center mt-4 font-semibold">❌ {error}</p>
        )}
      </div>
    </div>
  );
};
