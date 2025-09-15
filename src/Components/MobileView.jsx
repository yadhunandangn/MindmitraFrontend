import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDashboardLink } from "../utils/roleUtils";
import {
  Home,
  BookOpen,
  MessageCircle,
  Info,
  LogIn,
  LogOut,
  LayoutDashboard,
  X,
} from "lucide-react";

export const MobileMenu = ({ menuOpen, setMenuOpen }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
    setRole(localStorage.getItem("role") || "");
  }, [menuOpen]);

  // Close menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setMenuOpen(false);
    navigate("/login");
  };

  const menuLinks = [
    { label: "Home", to: "/", icon: <Home className="w-5 h-5" /> },
    { label: "Wellness Hub", to: "/wellness", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Chat", to: "/chat", icon: <MessageCircle className="w-5 h-5" /> },
    { label: "About Us", to: "/about", icon: <Info className="w-5 h-5" /> },
  ];

  // ✅ Safe dashboard link
  const dashboardLink = role ? getDashboardLink(role) : null;
  if (isLoggedIn && dashboardLink) {
    menuLinks.push({
      label: "Dashboard",
      to: dashboardLink,
      icon: <LayoutDashboard className="w-5 h-5" />,
    });
  }

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center
                  bg-gradient-to-br from-white/90 to-gray-100/80 backdrop-blur-2xl
                  transform transition-all duration-500 ease-in-out
                  ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}
      onClick={() => setMenuOpen(false)} // close if background clicked
    >
      {/* Prevent background click from closing menu when clicking inside */}
      <div
        className="relative w-full h-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 text-gray-800 hover:text-red-600 transition transform hover:rotate-90"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Menu Links */}
        <ul className="flex flex-col items-center space-y-8">
          {menuLinks.map((link, idx) => (
            <li
              key={idx}
              className="opacity-0 animate-fadeInUp"
              style={{ animationDelay: `${idx * 120}ms`, animationFillMode: "forwards" }}
            >
              <Link
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 text-2xl font-semibold text-gray-800 hover:text-green-600 transition transform hover:scale-110"
              >
                {link.icon}
                {link.label}
              </Link>
            </li>
          ))}

          {/* Login / Logout */}
          {isLoggedIn ? (
            <li
              className="opacity-0 animate-fadeInUp"
              style={{ animationDelay: `${menuLinks.length * 120}ms`, animationFillMode: "forwards" }}
            >
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 rounded-xl font-semibold text-white shadow-md hover:scale-105 transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </li>
          ) : (
            <li
              className="opacity-0 animate-fadeInUp"
              style={{ animationDelay: `${menuLinks.length * 120}ms`, animationFillMode: "forwards" }}
            >
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 rounded-xl font-semibold text-white shadow-md hover:scale-105 transition"
              >
                <LogIn className="w-5 h-5" />
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
