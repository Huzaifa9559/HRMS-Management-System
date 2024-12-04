import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use the Auth Context
export const useAuth = () => useContext(AuthContext);

// Helper function to check if the session is still valid
const isSessionValid = () => {
  const expiryTime = localStorage.getItem('expiryTime');
  if (expiryTime && new Date().getTime() > parseInt(expiryTime, 10)) {
    localStorage.clear(); // Clear expired session
    return false;
  }
  return true;
};

// Auth Provider component to wrap around the app
export const AuthProvider = ({ children }) => {
  // Initialize authentication state from local storage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return JSON.parse(localStorage.getItem('isAuthenticated')) && isSessionValid();
  });
  const [userRole, setUserRole] = useState(() => {
    return isSessionValid() ? localStorage.getItem('userRole') : null;
  });

  useEffect(() => {
    if (!isSessionValid()) {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, []);

<<<<<<< HEAD
  // Set a session expiration time (e.g., some minutes)
  const SESSION_DURATION = 7200000; // some minutes in milliseconds
=======
  // Set a session expiration time (e.g., 30 minutes)
  const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
>>>>>>> 836b01c3a2d2da0c3182e38f6c4cbd18edb93b12

  const setSessionTimer = () => {
    const expiryTime = new Date().getTime() + SESSION_DURATION;
    localStorage.setItem('expiryTime', expiryTime);
  };

  // Login as admin function (mock implementation)
  const loginAsAdmin = () => {
    setIsAuthenticated(true);
    setUserRole('admin');
    localStorage.setItem('isAuthenticated', JSON.stringify(true));
    localStorage.setItem('userRole', 'admin');
    setSessionTimer();
  };

  // Login as employee function (mock implementation)
  const loginAsEmployee = () => {
    setIsAuthenticated(true);
    setUserRole('employee');
    localStorage.setItem('isAuthenticated', JSON.stringify(true));
    localStorage.setItem('userRole', 'employee');
    setSessionTimer();
  };

  // Logout function to clear authentication
  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.clear();
  };

  // Automatically log out when the session expires
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSessionValid()) {
        logout();
      }
    }, 1000); // Check every second
    return () => clearInterval(interval);
  }, []);

  // Provide the authentication state and actions to all components
  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, loginAsAdmin, loginAsEmployee, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
