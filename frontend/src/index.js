import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import CreateAccount from './components/employee/Login_Signup/CreateAccount.jsx';
import LoginPage from './components/employee/Login_Signup/LoginPage.jsx';
import ForgotPassword from './components/employee/Login_Signup/ForgotPassword.jsx';
import ResetPasswordSent from './components/employee/Login_Signup/ResetPasswordSent.jsx';
import SetNewPassword from './components/employee/Login_Signup/SetNewPassword.jsx';
import Dashboard from './components/admin/MainDashboard/Dashboard.jsx';
import EDashboard from './components/employee/EmployeeDashboard/EDashboard.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password-sent" element={<ResetPasswordSent />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />

        {/* Main dashboard route */}

        {/*make these routes for dashboards protected */}
        {/*separate the employee routes from admin */}

        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/employee_main_dashboard/*" element={<EDashboard />} />
        {/* If no path is matched, redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
