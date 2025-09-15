import { useEffect, useState } from "react";
import authApi from "../../Api/RestAPI";

export const HcpPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsRes = await authApi.get("/hcp/patients");
        setPatients(patientsRes.data ?? []);
      } catch (err) {
        setError("Failed to load patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);


  const filteredPatients = patients.filter((p) =>
    p.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 text-black p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          👩‍⚕️ My Patients
        </h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {loading && (
          <p className="text-gray-600 text-center">Loading patients...</p>
        )}
        {error && <p className="text-red-600 text-center">{error}</p>}

        {/* Patients Table */}
        {filteredPatients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">User ID</th>
                  <th className="px-4 py-3 text-left">Username</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Issue</th>
                  <th className="px-4 py-3 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{patient.id}</td>
                    <td className="px-4 py-3">{patient.username}</td>
                    <td className="px-4 py-3">{patient.email}</td>
                    <td className="px-4 py-3">{patient.issue}</td>
                    <td className="px-4 py-3 whitespace-pre-line">
                      {patient.description || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && (
            <p className="text-gray-500 text-center">No patients assigned.</p>
          )
        )}
      </div>
    </div>
  );
};
