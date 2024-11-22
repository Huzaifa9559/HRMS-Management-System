// src/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// PrivateRoute component to protect routes based on user authentication and role
const PrivateRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth();

  // Check if the user is authenticated and has the correct role
  if (!isAuthenticated) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (userRole !== requiredRole) {
    // If the user role doesn't match, redirect to a no-access or unauthorized page (optional)
    return <Navigate to="/no-access" replace />;
  }

  // If authenticated and role matches, render the protected component
  return element;
};

export default PrivateRoute;
