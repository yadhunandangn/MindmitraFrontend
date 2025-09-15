import { useEffect, useState } from "react";
import authApi from "../../Api/RestAPI";

export const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authApi.get("/admin/users");
        setUsers(res.data || []);
      } catch (err) {
        console.error("Error fetching users:", err.response?.data || err.message);
        setError(err.response?.data?.message || err.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-32">
        <p className="animate-pulse text-gray-600">Loading users...</p>
      </div>
    );

  if (error)
    return <p className="text-red-500 text-center my-4">Error: {error}</p>;

  return (
    <div className="bg-white text-black rounded-xl shadow p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">User Details</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-left">ID</th>
              <th className="px-4 py-2 border-b text-left">Name</th>
              <th className="px-4 py-2 border-b text-left">Email</th>
              <th className="px-4 py-2 border-b text-left">Total Appointments</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id || user.username} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 border-b">{user.id}</td>
                <td className="px-4 py-2 border-b">{user.name || user.username}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">{user.totalAppointments || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {users.map((user) => (
          <div
            key={user.id || user.username}
            className="border rounded-xl shadow-sm p-4 bg-gray-50 flex flex-col gap-2"
          >
            <p>
              <span className="font-semibold">ID:</span> {user.id}
            </p>
            <p>
              <span className="font-semibold">Name:</span> {user.name || user.username}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Total Appointments:</span> {user.totalAppointments || 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
