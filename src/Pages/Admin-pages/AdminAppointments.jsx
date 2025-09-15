import { useEffect, useState } from "react";
import { Check, X, Clock, Printer } from "lucide-react";
import authApi from "../../Api/RestAPI";

export const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false); // Toggle report view

  const fetchAppointments = async () => {
    try {
      const response = await authApi.get("/admin/appointments");
      setAppointments(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Could not load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await authApi.put(`/admin/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Could not update appointment status.");
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "CONFIRMED":
        return `${base} bg-green-100 text-green-700`;
      case "CANCELLED":
        return `${base} bg-red-100 text-red-700`;
      default:
        return `${base} bg-yellow-100 text-yellow-700`;
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="animate-pulse text-gray-600">Loading appointments...</p>
      </div>
    );

  return (
    <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Manage Appointments
        </h1>
        <button
          onClick={() => setShowReport(!showReport)}
          className="flex items-center gap-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          <Printer size={18} /> {showReport ? "Hide Report" : "View Report"}
        </button>
      </div>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {/* Report Section */}
      {showReport && (
        <div className="border text-black rounded-lg p-4 bg-gray-50 mb-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-3">Appointment Report</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No appointments found.</p>
          ) : (
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Patient</th>
                  <th className="p-2 border">Doctor</th>
                  <th className="p-2 border">Date & Time</th>
                  <th className="p-2 border">Issue</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2 border">{appt.user?.username || "-"}</td>
                    <td className="p-2 border">
                      Dr. {appt.doctor?.doctorName || "-"} (
                      {appt.doctor?.specialization || "-"})
                    </td>
                    <td className="p-2 border">
                      {appt.appointmentDate
                        ? new Date(
                            appt.appointmentDate +
                              " " +
                              (appt.appointmentTime || "")
                          ).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </td>
                    <td className="p-2 border">{appt.issue || "-"}</td>
                    <td className="p-2 border">
                      <span className={getStatusBadge(appt.appointmentStatus)}>
                        {appt.appointmentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {appointments.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto text-black">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm uppercase tracking-wide">
                  <th className="p-3">Patient</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Issue</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3">{appt.user?.username}</td>
                    <td className="p-3">
                      <p className="font-medium text-gray-800">
                        Dr. {appt.doctor?.doctorName}
                      </p>
                      <span className="text-sm text-gray-500">
                        {appt.doctor?.specialization}
                      </span>
                    </td>
                    <td className="p-3">
                      {appt.appointmentDate
                        ? new Date(appt.appointmentDate).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" }
                          )
                        : "N/A"}
                    </td>
                    <td className="p-3">{appt.appointmentTime || "N/A"}</td>
                    <td className="p-3">{appt.issue || "-"}</td>
                    <td className="p-3">
                      <span className={getStatusBadge(appt.appointmentStatus)}>
                        {appt.appointmentStatus}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2 justify-center flex-wrap">
                      <button
                        onClick={() => updateStatus(appt.id, "CONFIRMED")}
                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                        title="Confirm"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => updateStatus(appt.id, "CANCELLED")}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                        title="Cancel"
                      >
                        <X size={18} />
                      </button>
                      <button
                        onClick={() => updateStatus(appt.id, "PENDING")}
                        className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                        title="Pending"
                      >
                        <Clock size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {appointments.map((appt, idx) => (
              <div
                key={idx}
                className="border rounded-xl p-4 shadow-sm bg-gray-50 flex flex-col gap-2"
              >
                <p className="font-medium">
                  Patient: <span className="text-gray-700">{appt.user?.username}</span>
                </p>
                <p>
                  Doctor:{" "}
                  <span className="text-gray-700">
                    Dr. {appt.doctor?.doctorName} ({appt.doctor?.specialization})
                  </span>
                </p>
                <p>
                  Date:{" "}
                  {appt.appointmentDate
                    ? new Date(appt.appointmentDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
                <p>Time: {appt.appointmentTime || "N/A"}</p>
                <p>Issue: {appt.issue || "-"}</p>
                <p>
                  Status:{" "}
                  <span className={getStatusBadge(appt.appointmentStatus)}>
                    {appt.appointmentStatus}
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row justify-between gap-2 mt-3">
                  <button
                    onClick={() => updateStatus(appt.id, "CONFIRMED")}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex-1"
                  >
                    <Check size={16} /> Confirm
                  </button>
                  <button
                    onClick={() => updateStatus(appt.id, "CANCELLED")}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex-1"
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button
                    onClick={() => updateStatus(appt.id, "PENDING")}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex-1"
                  >
                    <Clock size={16} /> Pending
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center mt-6">No appointments found.</p>
      )}
    </div>
  );
};
