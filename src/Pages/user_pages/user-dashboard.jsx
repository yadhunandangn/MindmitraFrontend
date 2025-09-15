import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import authApi from "../../Api/RestAPI";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const UserDashboard = () => {
  const { username } = useContext(AuthContext);
  const [moodEntries, setMoodEntries] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moodRes = await authApi.get(`/auth/mood-tracker/${username}`);
        setMoodEntries(moodRes.data || []);

        const apptRes = await authApi.get(`/auth/get-appointments/${username}`);
        let apptData = Array.isArray(apptRes.data) ? apptRes.data : [];

        // Filter out past appointments
        const today = new Date();
        apptData = apptData.filter(appt => new Date(appt.date) >= today);

        // Sort by date ascending
        apptData.sort((a, b) => new Date(a.date) - new Date(b.date));
        setAppointments(apptData);

        const journalRes = await authApi.get(`/auth/journals/${username}`);
        setJournals(journalRes.data || []);
      } catch (err) {
        console.error(
          "Error fetching user dashboard data",
          err.response?.data || err.message
        );
      }
    };

    fetchData();
  }, [username]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
      <header className="bg-white mt-25 shadow px-6 py-4 sticky top-0 z-20 rounded-b-xl">
        <h1 className="text-xl sm:text-2xl font-bold text-green-700">
          User Dashboard
        </h1>
      </header>

      <main className="p-6 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Chat Card */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">Chat With Your Mitra</h2>
            <p className="text-gray-600 mb-4">
              Start a conversation and get guidance from your AI friend.
            </p>
            <Link
              to="/chat"
              className="px-4 py-2 inline-block bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Go to Chat
            </Link>
          </motion.div>

          {/* Book Appointment */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">Book Appointment</h2>
            <p className="text-gray-600 mb-4">
              Schedule a session with a therapist or counselor.
            </p>
            <Link
              to="/book-appointment"
              className="px-4 py-2 inline-block bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Book Now
            </Link>
          </motion.div>

          {/* Wellness Hub */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">Wellness Hub</h2>
            <p className="text-gray-600 mb-4">
              Access self-help tools, daily affirmations, and upcoming features.
            </p>
            <Link
              to="/wellness"
              className="px-4 py-2 inline-block bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              Explore Wellness
            </Link>
          </motion.div>

          {/* Mood Tracker */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">Mood Tracker</h2>
            <p className="text-gray-600 mb-2">Track how you’ve been feeling.</p>
            <p className="text-sm text-gray-500 mb-4">
              You have {moodEntries.length} recent mood entries.
            </p>
            <Link
              to="/mood-tracker"
              className="px-4 py-2 inline-block bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
            >
              Track Mood
            </Link>
          </motion.div>

          {/* Journals */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">Journals</h2>
            <p className="text-gray-600 mb-2">Reflect and write down your thoughts.</p>
            <p className="text-sm text-gray-500 mb-4">
              You’ve saved {journals.length} journal entries.
            </p>
            <Link
              to="/journals"
              className="px-4 py-2 inline-block bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              View Journals
            </Link>
          </motion.div>

          {/* Upcoming Appointments */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">Upcoming Appointments</h2>
            <p className="text-gray-600 mb-2">Stay updated with your next sessions.</p>
            <p className="text-sm text-gray-500 mb-4">
              {appointments.length > 0
                ? `Next: ${appointments[0]?.date || "TBD"}`
                : "No upcoming appointments"}
            </p>
            <Link
              to="/appointments"
              className="px-4 py-2 inline-block bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
            >
              View Appointments
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
