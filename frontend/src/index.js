import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { AuthProvider } from './auth/AuthContext.js';
import PrivateRoute from './auth/PrivateRoute.js';

import CreateAccount from './components/employee/Login_Signup/CreateAccount.jsx';
import LoginPage from './components/employee/Login_Signup/LoginPage.jsx';
import ForgotPassword from './components/employee/Login_Signup/ForgotPassword.jsx';
import ResetPasswordSent from './components/employee/Login_Signup/ResetPasswordSent.jsx';
import SetNewPassword from './components/employee/Login_Signup/SetNewPassword.jsx';
import EDashboard from './components/employee/EDashboard.jsx';
import Leave from './components/employee/Leave.jsx';
import Attendance from './components/employee/Attendance.jsx';
import Account from './components/employee/Account.jsx'
import WorkSchedule from './components/employee/WorkSchedule.jsx';
import Payslip from './components/employee/Payslip.jsx';
import MyDocuments from './components/employee/MyDocuments.jsx';
import Announcements from './components/employee/Announcements.jsx';
import AnnouncementView from './components/employee/AnnouncementView.jsx';


import ADashboard from './components/admin/ADashboard.jsx';
import EmployeeList from './components/admin/EmployeeList.jsx';
import Departments from './components/admin/Departments.jsx';
import ViewDepartments from './components/admin/ViewDepartment.jsx';
import AAttendance from './components/admin/AAttendance.jsx';
import ViewAttendance from './components/admin/ViewAttendance.jsx';
import VEmpAttendance from './components/admin/VEmpAttendance.jsx';
import CreateAnnouncements from './components/admin/CreateAnnouncements.jsx';
import ALeave from './components/admin/ALeave.jsx';
import VEmpAttendance from './components/admin/VEmpAttendance.jsx';
import VEmpLeave from './components/admin/VEmpLeave.jsx';
import ADocuments from './components/admin/ADocuments.jsx';
import AAnnouncements from './components/admin/AAnnouncements.jsx';
import Login from './components/admin/Login.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

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
          <Route path="/admin/login" element={<Login />} />

          {/*Admin Protected Route*/}
          {/*<Route path="/admin_main_dashboard" element={<PrivateRoute element={<Dashboard />} requiredRole="admin" />} />*/}
          <Route path="/admin/dashboard" element={<ADashboard />} />
          <Route path="/admin/organization/employee-list" element={<EmployeeList />} />
          <Route path="/admin/organization/departments" element={<Departments />} />
          <Route path="/admin/organization/view-departments" element={<ViewDepartments />} />
          <Route path="/admin/attendance" element={<AAttendance />} />
          <Route path="/admin/view-attendance" element={<ViewAttendance />} />
          <Route path="/admin/view-employee-attendance" element={<VEmpAttendance />} />
          <Route path="/admin/create-announcements" element={<CreateAnnouncements />} />
          <Route path="/admin/announcements" element={<AAnnouncements />} />
          <Route path="/admin/documents/upload-document" element={<CreateNewDoc />} />
          <Route path="/admin/documents/all-received" element={<ADocuments />} />
          <Route path="/admin/leave" element={<ALeave />} />
          <Route path="/admin/view-employee-leave" element={<VEmpLeave />} />

          {/* Employee Protected Routes */}
          <Route path="/employee/dashboard" element={<PrivateRoute element={<EDashboard />} requiredRole="employee" />} />
          <Route path="/employee/documents/payslip" element={<PrivateRoute element={<Payslip />} requiredRole="employee" />} />
          <Route path="/employee/documents/mydocuments" element={<PrivateRoute element={<MyDocuments />} requiredRole="employee" />} />
          <Route path="/employee/account" element={<PrivateRoute element={<Account />} requiredRole="employee" />} />
          <Route path="/employee/announcements" element={<PrivateRoute element={<Announcements />} requiredRole="employee" />} />
          <Route path="/employee/leave" element={<PrivateRoute element={<Leave />} requiredRole="employee" />} />
          <Route path="/employee/attendance" element={<PrivateRoute element={<Attendance />} requiredRole="employee" />} />
          <Route path="/employee/workschedule" element={<PrivateRoute element={<WorkSchedule />} requiredRole="employee" />} />
          <Route path="/employee/announcements/view/:id" element={<PrivateRoute element={<AnnouncementView />} requiredRole="employee" />} />


          {/* If no path matches, redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
