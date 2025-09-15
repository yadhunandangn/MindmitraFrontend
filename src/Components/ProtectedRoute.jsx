import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Pages/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { authToken, role } = useContext(AuthContext);
  const location = useLocation();

  if (!authToken) {
    // User is not logged in, redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles || !allowedRoles.includes(role)) {
    // User is logged in but their role is not permitted, redirect to home
    return <Navigate to="/" replace />;
  }

  return children; // User is authenticated and authorized
};
