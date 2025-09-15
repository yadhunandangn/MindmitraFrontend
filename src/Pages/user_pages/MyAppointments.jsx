import { useEffect, useState, useContext } from "react";
import authApi from "../../Api/RestAPI";
import { AuthContext } from "../AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export const MyAppointments = () => {
  const { username } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await authApi.get(`/auth/get-appointments/${username}`);
        let data = Array.isArray(response.data) ? response.data : [];

        // Filter out past appointments
        const today = new Date();
        data = data.filter(appt => new Date(appt.date) >= today);

        // Sort by date ascending (next appointment on top)
        data.sort((a, b) => new Date(a.date) - new Date(b.date));

        setAppointments(data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("⚠️ You are not authorized to view appointments.");
        } else if (err.response?.status === 404) {
          setError("❌ Appointments not found.");
        } else {
          setError("Could not load appointments. Please try again later.");
        }
      }
    };

    fetchAppointments();
  }, [username]);

  const getStatusBadge = (status) => {
    let color = "bg-yellow-100 text-yellow-700";
    if (status === "APPROVED") color = "bg-green-100 text-green-700";
    if (status === "REJECTED") color = "bg-red-100 text-red-700";
    return (
      <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${color}`}>
        {status || "PENDING"}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 flex items-center justify-center pt-24 sm:pt-28 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 sm:p-8"
      >
        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          My Appointments
        </h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <AnimatePresence>
          {appointments.length > 0 ? (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 sm:grid-cols-2"
            >
              {appointments.map((appt, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-5 rounded-xl bg-gray-50 shadow-sm border hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="font-bold text-lg text-indigo-700">
                        Dr. {appt.doctorName || "Unknown"}
                      </h2>
                      {getStatusBadge(appt.status)}
                    </div>
                    <p className="text-gray-700">
                      <strong>Date:</strong>{" "}
                      {new Date(appt.date).toLocaleDateString()}{" "}
                      <strong>Time:</strong>{" "}
                      {typeof appt.time === "string"
                        ? appt.time
                        : new Date(appt.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                    </p>
                    <p className="text-gray-700 mt-1">
                      <strong>Issue:</strong> {appt.issue || "N/A"}
                    </p>
                    <p className="text-gray-700 mt-1">
                      <strong>Description:</strong> {appt.desc || "N/A"}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-center mt-6"
            >
              📅 No upcoming appointments. Book one today!
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
