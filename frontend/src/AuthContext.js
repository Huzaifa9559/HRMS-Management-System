// src/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use the Auth Context
export const useAuth = () => useContext(AuthContext);

// Auth Provider component to wrap around the app
export const AuthProvider = ({ children }) => {
  // State to manage authentication status and user role
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // Either 'admin' or 'employee'

  // Login as admin function (mock implementation)
  const loginAsAdmin = () => {
    setIsAuthenticated(true);
    setUserRole('admin');
  };

  // Login as employee function (mock implementation)
  const loginAsEmployee = () => {
    setIsAuthenticated(true);
    setUserRole('employee');
  };

  // Logout function to clear authentication
  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  // Provide the authentication state and actions to all components
  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, loginAsAdmin, loginAsEmployee, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
