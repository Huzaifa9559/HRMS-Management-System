import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';

import CreateAccount from './components/employee/Login_Signup/CreateAccount.jsx';
import LoginPage from './components/employee/Login_Signup/LoginPage.jsx';
import ForgotPassword from './components/employee/Login_Signup/ForgotPassword.jsx';
import ResetPasswordSent from './components/employee/Login_Signup/ResetPasswordSent.jsx';
import SetNewPassword from './components/employee/Login_Signup/SetNewPassword.jsx';
import Dashboard from './components/admin/MainDashboard/Dashboard.jsx';
import EDashboard from './components/employee/EmployeeDashboard/EDashboard.jsx';
import LeaveManagementD from './components/employee/EmployeeDashboard/LeaveManagementD.jsx';
import Attendance from './components/employee/EmployeeDashboard/Attendance.jsx';
import Account from './components/employee/EmployeeDashboard/Account.jsx'
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import WorkSchedule from './components/employee/EmployeeDashboard/WorkSchedule.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password-sent" element={<ResetPasswordSent />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />

          {/*Admin Protected Route*/}
          {/*<Route path="/admin_main_dashboard" element={<PrivateRoute element={<Dashboard />} requiredRole="admin" />} />*/}
          <Route path="/admin/dashboard/*" element={<Dashboard />} />

          {/* Employee Protected Routes */}
          {/*<Route path="/employee_main_dashboard" element={<PrivateRoute element={<EDashboard />} requiredRole="employee" />} />*/}
          {/*<Route path="/employee_leave_dashboard" element={<PrivateRoute element={<LeaveManagementD />} requiredRole="employee" />} />*/}
          <Route path="/employee/dashboard" element={<EDashboard />} />
          <Route path="/employee/account" element={<Account />} />
          <Route path="/employee/leave" element={<LeaveManagementD />} />
          <Route path="/employee/attendance" element={<Attendance />} />
          <Route path="/employee/workschedule" element={<WorkSchedule />} />


          {/* If no path matches, redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
