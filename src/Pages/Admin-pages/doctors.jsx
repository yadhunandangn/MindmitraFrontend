import { useEffect, useState } from "react";
import authApi from "../../Api/RestAPI";

export const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [formData, setFormData] = useState({
    doctorName: "",
    specialization: "",
    email: "",
    password: "",
    aboutDoc: "",
    photo: null,
  });

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const res = await authApi.get("/admin/doctors");
      setDoctors(res.data || []);
    } catch (err) {
      console.error("Error fetching doctors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "photo" ? files[0] : value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editDoctor) {
        await authApi.put(`/admin/doctors/${editDoctor.id}`, {
          doctorName: formData.doctorName,
          specialization: formData.specialization,
          email: formData.email,
          password: formData.password,
          aboutDoc: formData.aboutDoc,
        });
      } else {
        const formDataObj = new FormData();
        const doctorData = {
          doctorName: formData.doctorName,
          specialization: formData.specialization,
          email: formData.email,
          password: formData.password,
          aboutDoc: formData.aboutDoc,
        };
        formDataObj.append(
          "data",
          new Blob([JSON.stringify(doctorData)], { type: "application/json" })
        );
        if (formData.photo) formDataObj.append("photo", formData.photo);
        await authApi.post("/admin/doctors", formDataObj);
      }

      fetchDoctors();
      setShowModal(false);
      setEditDoctor(null);
      setFormData({
        doctorName: "",
        specialization: "",
        email: "",
        password: "",
        aboutDoc: "",
        photo: null,
      });
    } catch (err) {
      console.error("Error saving doctor", err);
    }
  };

  // Delete doctor
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await authApi.delete(`/admin/doctors/${id}`);
        fetchDoctors();
      } catch (err) {
        console.error("Error deleting doctor", err);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Doctor Management</h1>
        <button
          onClick={() => {
            setEditDoctor(null);
            setFormData({
              doctorName: "",
              specialization: "",
              email: "",
              password: "",
              aboutDoc: "",
              photo: null,
            });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 text-sm sm:text-base"
        >
          + Add Doctor
        </button>
      </div>

      {/* Table / Cards */}
      {loading ? (
        <p className="text-gray-600">Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p className="text-gray-600">No doctors found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full border-collapse text-sm sm:text-base">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Specialization</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">About</th>
                  <th className="p-3 text-left">Photo</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {doctors.map((doc) => (
                  <tr key={doc.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{doc.id}</td>
                    <td className="p-3">{doc.doctorName}</td>
                    <td className="p-3">{doc.specialization}</td>
                    <td className="p-3">{doc.email}</td>
                    <td className="p-3">{doc.aboutDoc}</td>
                    <td className="p-3">
                      {doc.photo ? (
                        <img
                          src={`data:image/jpeg;base64,${doc.photo}`}
                          alt="Doctor"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">No Photo</span>
                      )}
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => {
                          setEditDoctor(doc);
                          setFormData({
                            doctorName: doc.doctorName,
                            specialization: doc.specialization,
                            email: doc.email,
                            password: "",
                            aboutDoc: doc.aboutDoc,
                            photo: null,
                          });
                          setShowModal(true);
                        }}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 md:hidden">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-lg shadow p-4 space-y-2"
              >
                <div className="flex items-center gap-3">
                  {doc.photo ? (
                    <img
                      src={`data:image/jpeg;base64,${doc.photo}`}
                      alt="Doctor"
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                      No Photo
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-800">{doc.doctorName}</p>
                    <p className="text-sm text-gray-500">{doc.specialization}</p>
                    <p className="text-xs text-gray-400">{doc.email}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{doc.aboutDoc}</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditDoctor(doc);
                      setFormData({
                        doctorName: doc.doctorName,
                        specialization: doc.specialization,
                        email: doc.email,
                        password: "",
                        aboutDoc: doc.aboutDoc,
                        photo: null,
                      });
                      setShowModal(true);
                    }}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">
              {editDoctor ? "Edit Doctor" : "Add Doctor"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="doctorName"
                placeholder="Doctor Name"
                value={formData.doctorName}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 text-gray-800 text-sm sm:text-base"
                required
              />
              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 text-gray-800 text-sm sm:text-base"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 text-gray-800 text-sm sm:text-base"
                required
              />
              {!editDoctor && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-gray-50 text-gray-800 text-sm sm:text-base"
                  required
                />
              )}
              <textarea
                name="aboutDoc"
                placeholder="About Doctor"
                value={formData.aboutDoc}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 text-gray-800 text-sm sm:text-base"
                rows="3"
              />
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 text-gray-800 text-sm sm:text-base"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
                >
                  {editDoctor ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
