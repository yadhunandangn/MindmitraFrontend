import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import authApi from "../../Api/RestAPI";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const HcpDashboard = () => {
  const { username, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State for counts
  const [patients, setPatients] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [reports, setReports] = useState(0);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const patientsRes = await authApi.get("/hcp/patients");
        setPatients(patientsRes.data?.length ?? 0);

        const appointmentsRes = await authApi.get("/hcp/appointments/", {
          params: { doctorUsername: username },
        });
        setAppointments(appointmentsRes.data ?? []);
        setAppointmentsCount(appointmentsRes.data?.length ?? 0);


        const reportsRes = await authApi.get("/hcp/reports");
        setReports(reportsRes.data?.length ?? 0);
      } catch (err) {
        console.error("Error fetching stats", err.response?.data || err.message);
        setError("Failed to fetch dashboard stats.");
      }
    };


    fetchStats();
  }, [username]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const linkClasses = (path) =>
    `block px-4 py-2 rounded transition ${
      location.pathname.startsWith(path)
        ? "bg-gray-700 font-semibold"
        : "hover:bg-gray-700"
    }`;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-gray-900 text-white flex-col min-h-screen">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-center">
          <img
            src="/Logo-removebg-preview.png"
            alt="MindMitra Logo"
            className="w-40 h-auto object-contain"
          />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link to="/hcp-dashboard" className={linkClasses("/hcp-dashboard")}>
            Dashboard
          </Link>
          <Link
            to="/hcp-dashboard/patients"
            className={linkClasses("/hcp-dashboard/patients")}
          >
            Patients
          </Link>
          <Link
            to="/hcp-dashboard/appointments"
            className={linkClasses("/hcp-dashboard/appointments")}
          >
            Appointments
          </Link>
          <Link
            to="/hcp-dashboard/reports"
            className={linkClasses("/hcp-dashboard/reports")}
          >
            Reports
          </Link>
          <Link
            to="/hcp-dashboard/settings"
            className={linkClasses("/hcp-dashboard/settings")}
          >
            Settings
          </Link>
        </nav>

        <div className="m-4 space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Go to Website
          </button>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="relative w-64 bg-gray-900 text-white flex flex-col z-50 min-h-screen">
              <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <img
                  src="/Logo-removebg-preview.png"
                  alt="MindMitra Logo"
                  className="w-32 h-auto object-contain"
                />
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-white"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <Link
                  to="/hcp-dashboard"
                  className={linkClasses("/hcp-dashboard")}
                  onClick={() => setSidebarOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/hcp-dashboard/patients"
                  className={linkClasses("/hcp-dashboard/patients")}
                  onClick={() => setSidebarOpen(false)}
                >
                  Patients
                </Link>
                <Link
                  to="/hcp-dashboard/appointments"
                  className={linkClasses("/hcp-dashboard/appointments")}
                  onClick={() => setSidebarOpen(false)}
                >
                  Appointments
                </Link>
                <Link
                  to="/hcp-dashboard/reports"
                  className={linkClasses("/hcp-dashboard/reports")}
                  onClick={() => setSidebarOpen(false)}
                >
                  Reports
                </Link>
                <Link
                  to="/hcp-dashboard/settings"
                  className={linkClasses("/hcp-dashboard/settings")}
                  onClick={() => setSidebarOpen(false)}
                >
                  Settings
                </Link>
              </nav>
              <div className="m-4 space-y-3">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    navigate("/");
                  }}
                  className="w-full px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
                >
                  Go to Website
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-red-500 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow px-4 sm:px-6 py-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-700"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg sm:text-2xl font-bold">HCP Dashboard</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Welcome,  <span className="font-semibold"> Dr.{username}</span>
          </p>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 text-center mb-4 font-semibold"
            >
              ❌ {error}
            </motion.div>
          )}

          {location.pathname === "/hcp-dashboard" ||
          location.pathname === "/hcp-dashboard/" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-blue-500 text-white p-6 rounded-lg shadow-lg"
              >
                <h2 className="text-2xl font-bold">{patients}</h2>
                <p>Total Patients</p>
                <Link
                  to="/hcp-dashboard/patients"
                  className="text-sm underline mt-2 inline-block"
                >
                  More info →
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-green-500 text-white p-6 rounded-lg shadow-lg"
              >
                <h2 className="text-2xl font-bold">{appointmentsCount}</h2>
                <p>Total Appointments</p>
                <Link
                  to="/hcp-dashboard/appointments"
                  className="text-sm underline mt-2 inline-block"
                >
                  More info →
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="bg-purple-500 text-white p-6 rounded-lg shadow-lg"
              >
                <h2 className="text-2xl font-bold">{reports}</h2>
                <p>Reports Generated</p>
                <Link
                  to="/hcp-dashboard/reports"
                  className="text-sm underline mt-2 inline-block"
                >
                  More info →
                </Link>
              </motion.div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
};
