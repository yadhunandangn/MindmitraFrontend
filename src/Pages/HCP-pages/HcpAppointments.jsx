import { useEffect, useState, useContext } from "react";
import authApi from "../../Api/RestAPI";
import { AuthContext } from "../AuthContext";

export const HcpAppointments = () => {
  const { username: doctorUsername } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await authApi.get("/hcp/appointments/", {
          params: { doctorUsername },
        });
        let data = Array.isArray(response.data) ? response.data : [];


        data.sort((a, b) => new Date(b.date) -  new Date(a.date) );

        setAppointments(data);
      } catch (err) {
        console.error("Failed to load appointments:", err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorUsername]);

  const updateStatus = async (id, status) => {
    try {
      await authApi.put(`/hcp/appointments/${id}/status`, { status });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update status.");
    }
  };

  const statusBadge = (status) => {
    const base = "px-2 py-1 rounded-lg text-sm font-medium";
    switch (status) {
      case "PENDING":
        return `${base} bg-yellow-100 text-yellow-700`;
      case "APPROVED":
        return `${base} bg-green-100 text-green-700`;
      case "COMPLETED":
        return `${base} bg-blue-100 text-blue-700`;
      default:
        return `${base} bg-red-100 text-red-700`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black p-4 sm:p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
          🗓️ All Appointments
        </h1>

        {loading && (
          <p className="text-gray-600 text-center">Loading appointments...</p>
        )}
        {error && <p className="text-red-600 text-center">{error}</p>}

        {appointments.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Patient</th>
                    <th className="px-4 py-3 text-left">Issue</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Time</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{appt.userName}</td>
                      <td className="px-4 py-3">{appt.issue}</td>
                      <td className="px-4 py-3">{appt.date}</td>
                      <td className="px-4 py-3">{appt.time}</td>
                      <td className="px-4 py-3 font-semibold">
                        <span className={statusBadge(appt.status)}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center space-x-2">
                        {appt.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => updateStatus(appt.id, "APPROVED")}
                              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(appt.id, "REJECTED")}
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {appt.status === "APPROVED" && (
                          <button
                            onClick={() => updateStatus(appt.id, "COMPLETED")}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                          >
                            Mark Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="border rounded-xl shadow-sm p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-gray-800">
                      {appt.userName}
                    </h2>
                    <span className={statusBadge(appt.status)}>
                      {appt.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Issue:</span> {appt.issue}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span> {appt.date}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Time:</span> {appt.time}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {appt.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => updateStatus(appt.id, "APPROVED")}
                          className="flex-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(appt.id, "REJECTED")}
                          className="flex-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {appt.status === "APPROVED" && (
                      <button
                        onClick={() => updateStatus(appt.id, "COMPLETED")}
                        className="w-full px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          !loading && (
            <p className="text-gray-500 text-center">
              No appointments scheduled.
            </p>
          )
        )}
      </div>
    </div>
  );
};
