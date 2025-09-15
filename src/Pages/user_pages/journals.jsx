import { useState, useEffect, useContext } from "react";
import authApi from "../../Api/RestAPI";
import { AuthContext } from "../AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineDelete } from "react-icons/ai";

export const Journals = () => {
  const { username } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [journalHistory, setJournalHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch user's journals
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await authApi.get(`/auth/journals/${username}`);
        setJournalHistory(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to fetch journals:", err);
        setError("Could not load journals.");
      }
    };
    fetchJournals();
  }, [username]);

  // Save journal
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!title || !content) {
      setError("Please fill out both fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.post("/auth/journals", {
        username,
        title,
        content,
      });

      setMessage(response.data?.message || "✅ Journal saved!");
      setTitle("");
      setContent("");

      // Optimistic update
      setJournalHistory((prev) => [
        { title, content, timestamp: new Date().toISOString() },
        ...prev,
      ]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save journal.");
    } finally {
      setLoading(false);
    }
  };

  // Delete journal
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this journal?")) return;

    setDeletingId(id);
    try {
      await authApi.delete(`/auth/journals/${username}/${id}`);
      setJournalHistory((prev) => prev.filter((j) => j.id !== id));
      setMessage("🗑️ Journal deleted successfully.");
    } catch (err) {
      setError("Failed to delete journal.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen text-black bg-gradient-to-b from-indigo-50 to-indigo-100 flex items-center justify-center pt-28 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          Personal Journals
        </h1>

        {/* Journal Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your journal a title"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write down your thoughts..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            rows="5"
          ></textarea>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold shadow-lg transition ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {loading ? "Saving..." : "Save Journal"}
          </motion.button>
        </form>

        {/* Alerts */}
        {message && (
          <p className="text-green-600 text-center mt-4 font-medium">{message}</p>
        )}
        {error && (
          <p className="text-red-600 text-center mt-4 font-medium">{error}</p>
        )}

        {/* Journal History */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
            Your Journal Entries
          </h2>

          <AnimatePresence>
            {journalHistory.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 gap-5 max-h-[500px] overflow-y-auto pr-1"
              >
                {journalHistory.map((journal, idx) => (
                  <motion.div
                    key={journal.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="p-5 rounded-xl bg-gray-50 shadow-sm border hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-lg text-indigo-700">
                        {journal.title}
                      </h3>
                      <p className="text-gray-700 mt-2">{journal.content}</p>
                      <span className="text-sm text-gray-500 block mt-2">
                        {new Date(journal.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(journal.id)}
                      disabled={deletingId === journal.id}
                      className="mt-4 flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium self-end"
                    >
                      <AiOutlineDelete />
                      {deletingId === journal.id ? "Deleting..." : "Delete"}
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 text-center mt-8 p-6 rounded-xl bg-gray-100 shadow-inner"
              >
                🌱 No journals yet.
                <p className="mt-2">Start writing your first entry today!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
