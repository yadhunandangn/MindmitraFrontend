import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import authApi from "../../Api/RestAPI";
import { AuthContext } from "../AuthContext";

export const BookAppointment = () => {
  const { userId, username } = useContext(AuthContext);
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [issue, setIssue] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await authApi.get("/public/doctors");
        setDoctors(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError("⚠️ Could not load doctor information.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!selectedDoctor || !date || !time || !issue || !desc) {
      setError("⚠️ Please fill out all fields before booking.");
      return;
    }

    const today = new Date();
    const chosenDate = new Date(date);

    if (chosenDate < today.setHours(0, 0, 0, 0)) {
      setError("⚠️ Appointment date cannot be in the past.");
      return;
    }

    try {
      setSubmitting(true);
      await authApi.post("/auth/book-appointment", {
        userID: userId,
        docID: selectedDoctor.id,
        userName: username,
        issue,
        desc,
        date,
        time,
      });

      setSuccess("🎉 Appointment booked successfully!");
      setTimeout(() => navigate("/user-dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data || "⚠️ Appointment booking failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-black bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center pt-24 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-8"
      >
        <h1 className="text-3xl font-extrabold text-center text-green-700 mb-6">
          Book Your Appointment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Doctors Grid */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Choose a Doctor
            </label>
            {loading ? (
              <p className="text-gray-500">⏳ Loading doctors...</p>
            ) : doctors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctors.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`p-4 border rounded-xl shadow-md cursor-pointer transition flex flex-col gap-1 ${
                      selectedDoctor?.id === doc.id
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300 hover:shadow-lg"
                    }`}
                  >
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                      {doc.doctorName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {doc.specialization}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm sm:text-base">
                No doctors available
              </p>
            )}
          </div>

          {/* Selected Doctor Preview */}
          {selectedDoctor && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-300 text-center text-green-800 font-medium">
              Booking with Dr. {selectedDoctor.doctorName} (
              {selectedDoctor.specialization})
            </div>
          )}

          {/* Date & Time */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2">
                Appointment Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2">
                Appointment Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Issue */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Primary Concern
            </label>
            <input
              type="text"
              placeholder="e.g., Anxiety, Stress"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              maxLength={50}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {issue.length}/50 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              placeholder="Briefly describe what you're experiencing..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              maxLength={250}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              {desc.length}/250 characters
            </p>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: !submitting ? 1.05 : 1 }}
            whileTap={{ scale: !submitting ? 0.98 : 1 }}
            type="submit"
            disabled={submitting}
            className={`w-full py-3 rounded-xl font-semibold shadow-lg transition ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {submitting ? "Booking..." : "Confirm Appointment"}
          </motion.button>

          {/* Error / Success */}
          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
          {success && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-600 text-center mt-2 font-semibold"
            >
              {success}
            </motion.p>
          )}
        </form>
      </motion.div>
    </div>
  );
};
