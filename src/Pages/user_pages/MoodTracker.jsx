import { useState, useEffect, useContext } from "react";
import authApi from "../../Api/RestAPI";
import { AuthContext } from "../AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineDelete } from "react-icons/ai";

export const MoodTracker = () => {
  const { username } = useContext(AuthContext);

  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [moodHistory, setMoodHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const moods = [
    { value: "Happy", emoji: "😊", color: "bg-yellow-100" },
    { value: "Sad", emoji: "😢", color: "bg-blue-100" },
    { value: "Angry", emoji: "😡", color: "bg-red-100" },
    { value: "Stressed", emoji: "😰", color: "bg-purple-100" },
    { value: "Relaxed", emoji: "😌", color: "bg-green-100" },
  ];

  // Fetch user's past moods
  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await authApi.get(`/auth/mood-tracker/${username}`);
        setMoodHistory(Array.isArray(response.data) ? response.data : []);
      } catch {
        setError("Could not load mood history.");
      }
    };
    fetchMoods();
  }, [username]);

  // Save mood
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!selectedMood) {
      setError("Please select your mood.");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.post("/auth/mood-tracker", {
        username,
        mood: selectedMood,
        note,
      });

      // Optimistic update
      setMoodHistory((prev) => [
        { mood: selectedMood, note, timestamp: new Date().toISOString() },
        ...prev,
      ]);

      setMessage(response.data?.message || "✅ Mood saved!");
      setNote("");
      setSelectedMood("");
    } catch {
      setError("Failed to save mood.");
    } finally {
      setLoading(false);
    }
  };

  // Delete mood
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    setDeletingId(id);
    try {
      await authApi.delete(`/auth/mood-tracker/${username}/${id}`);
      setMoodHistory((prev) => prev.filter((m) => m.id !== id));
      setMessage("🗑️ Mood entry deleted.");
    } catch {
      setError("Failed to delete mood.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b text-black from-green-50 to-green-100 flex items-center justify-center pt-20 sm:pt-28 px-3 sm:px-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 sm:p-8"
      >
        <h1 className="text-3xl font-extrabold text-center text-green-700 mb-6">
          Mood Tracker
        </h1>

        {/* Mood Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {moods.map((m) => (
              <motion.button
                key={m.value}
                type="button"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setSelectedMood(m.value)}
                disabled={loading}
                className={`flex items-center justify-center px-4 sm:px-5 py-2 sm:py-3 rounded-xl border text-lg sm:text-xl font-medium shadow-sm transition
                  ${
                    selectedMood === m.value
                      ? "bg-green-600 text-white shadow-md scale-105"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                {m.emoji}
                <span className="ml-2 hidden sm:inline font-semibold">
                  {m.value}
                </span>
              </motion.button>
            ))}
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe why you feel this way (optional)..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm sm:text-base shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
            rows="3"
            disabled={loading}
          ></textarea>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold shadow-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Saving..." : "Save Mood"}
          </motion.button>

          {message && (
            <p className="text-green-600 text-center mt-3">{message}</p>
          )}
          {error && <p className="text-red-600 text-center mt-3">{error}</p>}
        </form>

        {/* Mood History */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
            Your Mood History
          </h2>

          <AnimatePresence>
            {moodHistory.length > 0 ? (
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3 max-h-80 overflow-y-auto pr-1"
              >
                {moodHistory.map((mood, idx) => (
                  <motion.li
                    key={mood.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-4 rounded-xl shadow-sm flex justify-between items-center ${
                      moods.find((m) => m.value === mood.mood)?.color ||
                      "bg-gray-50"
                    }`}
                  >
                    <div>
                      <span className="font-medium text-gray-800">
                        {moods.find((m) => m.value === mood.mood)?.emoji ||
                          "📝"}{" "}
                        {mood.mood}
                      </span>
                      {mood.note && (
                        <p className="text-gray-700 text-sm mt-1">{mood.note}</p>
                      )}
                      <span className="text-xs text-gray-500 block mt-1">
                        {new Date(mood.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(mood.id)}
                      disabled={deletingId === mood.id}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                    >
                      <AiOutlineDelete />
                      {deletingId === mood.id ? "Deleting..." : "Delete"}
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 text-center mt-6 p-6 rounded-xl bg-gray-100 shadow-inner"
              >
                🌱 No moods logged yet.
                <p className="mt-2">Start tracking to understand your patterns!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
