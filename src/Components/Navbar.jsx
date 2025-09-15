import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Pages/AuthContext";
import { getDashboardLink } from "../utils/roleUtils";
import {
  Home,
  MessageCircle,
  Sparkles,
  Info,
  LogIn,
  LogOut,
  LayoutDashboard,
} from "lucide-react"; // icons

export const Navbar = () => {
  const authContext = useContext(AuthContext) || {};
  const { authToken, role, logout } = authContext;

  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    if (logout) logout();
    navigate("/login");
  };

  const dashboardLink = role ? getDashboardLink(role) : null;

  // ✅ Flag instead of early return to prevent hook mismatch
  const hideNavbar =
    location.pathname.startsWith("/admin-dashboard") ||
    location.pathname.startsWith("/hcp-dashboard");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (hideNavbar) {
    return <></>; // safe render for hidden navbar
  }

  const navLinks = [
    { name: "Home", path: "/", icon: <Home className="w-4 h-4" /> },
    { name: "Wellness Hub", path: "/wellness", icon: <Sparkles className="w-4 h-4" /> },
    { name: "Chat", path: "/chat", icon: <MessageCircle className="w-4 h-4" /> },
    { name: "About Us", path: "/about", icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-white/70 border-b shadow-md"
          : "backdrop-blur-lg bg-white/40 border-b"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/Logo-removebg-preview.png"
            alt="MindMitra"
            className="w-36 sm:w-44 md:w-52 h-auto object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-2 text-lg font-medium relative group transition ${
                location.pathname === link.path ? "text-green-700" : "text-gray-800"
              }`}
            >
              {link.icon}
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}

          {authToken ? (
            <div className="flex items-center space-x-4">
              {dashboardLink && (
                <Link
                  to={dashboardLink}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 px-5 py-2 rounded-xl font-semibold text-white shadow-md hover:scale-105 transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 px-5 py-2 rounded-xl font-semibold text-white shadow-md hover:scale-105 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2 rounded-xl font-semibold text-white shadow-md hover:scale-105 transition"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div
          className="md:hidden flex items-center cursor-pointer text-black"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="text-3xl">{menuOpen ? "✖" : "☰"}</span>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg animate-slideDown">
          <ul className="flex flex-col space-y-4 px-6 py-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 text-lg font-medium text-gray-800 hover:text-green-600 transition"
                >
                  {link.icon}
                  {link.name}
                </Link>
              </li>
            ))}

            {authToken ? (
              <>
                {dashboardLink && (
                  <li>
                    <Link
                      to={dashboardLink}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 w-full bg-green-500 px-5 py-2 rounded-lg font-semibold text-white hover:bg-green-600 transition"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full bg-red-500 px-5 py-2 rounded-lg font-semibold text-white hover:bg-red-600 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 w-full bg-blue-500 px-5 py-2 rounded-lg font-semibold text-white hover:bg-blue-600 transition"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};
