import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Navbar } from "./Components/Navbar";
import { MobileMenu } from "./Components/MobileView";
import { ProtectedRoute } from "./Components/ProtectedRoute";

// Public Pages
import { Chat } from "./Pages/private-page/Chat";
import { Login } from "./Pages/public-pages/Login";
import { Reg } from "./Pages/public-pages/Register";
import { Home } from "./Pages/public-pages/Home";
import { AboutUs } from "./Pages/public-pages/aboutus";
import { WellnessHub } from "./Pages/public-pages/WellnessHub";
import { ForgotPassword } from "./Pages/public-pages/ForgotPassword";
import { ResetPassword } from "./Pages/public-pages/ResetPassword";

// User Pages
import { Doctors } from "./Pages/Admin-pages/doctors";
import { BookAppointment } from "./Pages/user_pages/book-appointment";
import { MoodTracker } from "./Pages/user_pages/MoodTracker";
import { Journals } from "./Pages/user_pages/journals";
import { MyAppointments } from "./Pages/user_pages/MyAppointments";

// Admin Pages
import { AdminAppointments } from "./Pages/Admin-pages/AdminAppointments";
import { AdminSettings } from "./Pages/Admin-pages/AdminSettings";
import { AdminBlogs } from "./Pages/Admin-pages/AdminBlogs";
import { UserDetails } from "./Pages/Admin-pages/UserDetails";

// Dashboards
import { HcpDashboard } from "./Pages/HCP-pages/hcp-dashboard";
import { UserDashboard } from "./Pages/user_pages/user-dashboard";
import { AdminDashboard } from "./Pages/Admin-pages/admin-dashboard";

// HCP Subpages
import { HcpPatients } from "./Pages/HCP-pages/HcpPatients";
import { HcpAppointments } from "./Pages/HCP-pages/HcpAppointments";
import { HcpReports } from "./Pages/HCP-pages/HcpReports";
import { HcpSettings } from "./Pages/HCP-pages/HcpSettings";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <Navbar setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main>
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Reg />} />
          <Route path="/wellness" element={<WellnessHub />} />{" "}
          {/* ✅ replaced Blog */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/chat" element={<Chat />} />
          <Route
            path="/blog"
            element={<Navigate to="/wellness" replace />}
          />{" "}
          {/* ✅ redirect old blog */}
          {/* 👤 User Dashboard */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          {/* 🧑‍⚕️ HCP Dashboard */}
          <Route
            path="/hcp-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["DOCTOR"]}>
                <HcpDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<div>📊 Dashboard Overview</div>} />
            <Route path="patients" element={<HcpPatients />} />
            <Route path="appointments" element={<HcpAppointments />} />
            <Route path="reports" element={<HcpReports />} />
            <Route path="settings" element={<HcpSettings />} />
          </Route>
          {/* 📅 User Pages */}
          <Route
            path="/book-appointment"
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mood-tracker"
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <MoodTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/journals"
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <Journals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <MyAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <WellnessHub /> {/* ✅ replaced Blog */}
              </ProtectedRoute>
            }
          />
          {/* 🛠️ Admin Dashboard */}
          <Route
            path="/admin-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<div>📊 Dashboard Overview</div>} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="users" element={<UserDetails />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </main>
    </Router>
  );
}

export default App;
