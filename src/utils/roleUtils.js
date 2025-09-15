// src/Utils/roleUtils.js

/**
 * Returns the dashboard path based on user role.
 * @param {string} role - user role string
 * @returns {string|null} - dashboard route or null if no dashboard
 */
export const getDashboardLink = (role) => {
  switch (role) {
    case "ADMIN":
      return "/admin-dashboard";
    case "DOCTOR":
      return "/hcp-dashboard";
    case "USER":
    case "PATIENT":
      return "/user-dashboard";
    default:
      return null; // no dashboard for unknown roles
  }
};
