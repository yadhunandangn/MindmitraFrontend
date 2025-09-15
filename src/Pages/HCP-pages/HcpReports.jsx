import { useState, useEffect } from "react";
import authApi from "../../Api/RestAPI";

export const HcpReports = () => {
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [patientId, setPatientId] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [editingReport, setEditingReport] = useState(null);

  // Fetch reports & patients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsRes, patientsRes] = await Promise.all([
          authApi.get("/hcp/reports"),
          authApi.get("/hcp/patients"),
        ]);
        setReports(Array.isArray(reportsRes.data) ? reportsRes.data : []);
        setPatients(Array.isArray(patientsRes.data) ? patientsRes.data : []);
      } catch (err) {
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Save or update report
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReport) {
        const response = await authApi.put(`/hcp/reports/${editingReport.id}`, {
          user: { id: patientId },
          title,
          notes,
        });
        setReports((prev) =>
          prev.map((r) => (r.id === editingReport.id ? response.data : r))
        );
      } else {
        const response = await authApi.post("/hcp/reports", {
          user: { id: patientId },
          title,
          notes,
        });
        setReports((prev) => [...prev, response.data]);
      }
      setPatientId("");
      setTitle("");
      setNotes("");
      setEditingReport(null);
    } catch (err) {
      setError("Failed to save report.");
    }
  };

  // Delete report
  const handleDelete = async (id) => {
    try {
      await authApi.delete(`/hcp/reports/${id}`);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError("Failed to delete report.");
    }
  };

  // Edit report
  const handleEdit = (report) => {
    setEditingReport(report);
    setPatientId(report.user?.id || "");
    setTitle(report.title);
    setNotes(report.notes);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black p-6 overflow-y-auto">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">📑 Reports</h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {loading && <p className="text-gray-600 text-center">Loading reports...</p>}

        {/* Report Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 mb-8 bg-gray-50 p-4 rounded-xl shadow-sm"
        >
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            required
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Report Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            required
          />

          <textarea
            placeholder="Notes / Observations"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            rows="4"
            required
          ></textarea>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md transition"
          >
            {editingReport ? "Update Report" : "Add Report"}
          </button>
        </form>

        {/* Reports List */}
        {reports.length > 0 ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 border rounded-xl shadow-sm bg-gray-50"
              >
                <h2 className="text-lg font-bold">{report.title}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  Patient: {report.user?.fullName || "Unknown"}
                </p>
                <p className="text-gray-700">{report.notes}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(report)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-gray-500 text-center">No reports available.</p>
          )
        )}
      </div>
    </div>
  );
};
