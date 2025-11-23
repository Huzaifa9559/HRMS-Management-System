// src/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// PrivateRoute component to protect routes based on user authentication and role
const PrivateRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth(); // Use AuthContext

  
  // Debugging
  console.log('isAuthenticated:', isAuthenticated);
  console.log('userRole:', userRole);

  // Check if the user is authenticated and has the required role
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== requiredRole) {
    return <Navigate to="/no-access" replace />;
  }

  return element; // If authenticated and role matches, render the component
};

export default PrivateRoute;
