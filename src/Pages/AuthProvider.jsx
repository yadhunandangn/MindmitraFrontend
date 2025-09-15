import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || ""); // ✅ added role

  // ✅ Load existing session on refresh
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (token) {
      setAuthToken(token);
      setUserId(storedUserId);
      setUsername(storedUsername);
      setRole(storedRole);
    }
  }, []);

  // ✅ Login function to save token, userId, username & role
  const login = (token, userId, username, role) => {
    setAuthToken(token);
    setUserId(userId);
    setUsername(username);
    setRole(role);

    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
  };

  // ✅ Logout function to clear session
  const logout = () => {
    setAuthToken(null);
    setUserId(null);
    setUsername("");
    setRole("");

    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ authToken, userId, username, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
