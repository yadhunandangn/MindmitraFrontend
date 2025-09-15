import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import authApi from "../../Api/RestAPI";
import { Menu, X } from "lucide-react";

export const AdminDashboard = () => {
  const { username, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Stats
  const [doctors, setDoctors] = useState(0);
  const [appointments, setAppointments] = useState(0);
  const [users, setUsers] = useState(50);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const doctorsRes = await authApi.get("/admin/doctors");
        setDoctors(doctorsRes.data?.length || doctorsRes.data?.data?.length || 0);

        const appointmentsRes = await authApi.get("/admin/appointments");
        setAppointments(
          appointmentsRes.data?.length || appointmentsRes.data?.data?.length || 0
        );

        const usersRes = await authApi.get("/admin/users");
        setUsers(usersRes.data?.length || usersRes.data?.data?.length || 0);
      } catch (err) {
        console.error("Error fetching stats", err.response?.data || err.message);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: "/admin-dashboard", label: "Dashboard" },
    { path: "/admin-dashboard/doctors", label: "Doctor Management" },
    { path: "/admin-dashboard/appointments", label: "Appointments" },
    { path: "/admin-dashboard/users", label: "Patients" },
    { path: "/admin-dashboard/settings", label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 bg-gray-900 text-white flex flex-col h-screen transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo & Close */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
          <img
            src="/Logo-removebg-preview.png"
            alt="MindMitra Logo"
            className="w-28 sm:w-32 h-auto object-contain"
          />
          <button
            aria-label="Close sidebar"
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm sm:text-base overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded transition ${
                  isActive ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Buttons */}
        <div className="m-4 space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 text-sm sm:text-base"
          >
            Go to Website
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 rounded hover:bg-red-600 text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col ml-0 lg:ml-64 overflow-x-hidden">
        {/* Topbar */}
        <header className="bg-white shadow px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle sidebar"
              className="lg:hidden text-gray-700"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-lg sm:text-2xl font-bold">Dashboard</h1>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 truncate max-w-[200px]">
            Welcome, <span className="font-semibold">{username}</span>
          </p>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-auto">
          {location.pathname === "/admin-dashboard" ||
          location.pathname === "/admin-dashboard/" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              <StatCard
                count={doctors}
                label="Total Doctors"
                link="/admin-dashboard/doctors"
                color="bg-blue-500"
              />
              <StatCard
                count={appointments}
                label="Total Appointments"
                link="/admin-dashboard/appointments"
                color="bg-green-500"
              />
              <StatCard
                count={users}
                label="Total Patients"
                link="/admin-dashboard/users"
                color="bg-orange-500"
              />
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
};

/* Small reusable stat card */
const StatCard = ({ count, label, link, color }) => (
  <div className={`${color} text-white p-4 sm:p-6 rounded-lg shadow-lg flex flex-col justify-between`}>
    <div>
      <h2 className="text-lg sm:text-xl font-bold truncate">{count}</h2>
      <p className="text-sm sm:text-base truncate">{label}</p>
    </div>
    <Link
      to={link}
      className="text-xs sm:text-sm underline mt-2 inline-block hover:opacity-90"
    >
      More info →
    </Link>
  </div>
);
