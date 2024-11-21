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
import EDashboard from './components/employee/EmployeeDashboard/EDashboard.jsx';
import Leave from './components/employee/EmployeeDashboard/Leave.jsx';
import Attendance from './components/employee/EmployeeDashboard/Attendance.jsx';
import Account from './components/employee/EmployeeDashboard/Account.jsx'
import WorkSchedule from './components/employee/EmployeeDashboard/WorkSchedule.jsx';
import Payslip from './components/employee/EmployeeDashboard/Payslip.jsx';
import MyDocuments from './components/employee/EmployeeDashboard/MyDocuments.jsx';
import Announcements from './components/employee/EmployeeDashboard/Announcements.jsx';

import ADashboard from './components/admin/MainDashboard/ADashboard.jsx';
import EmployeeList from './components/admin/MainDashboard/EmployeeList.jsx';
import Departments from './components/admin/MainDashboard/Departments.jsx';
import ViewDepartments from './components/admin/MainDashboard/ViewDepartment.jsx';
import AAttendance from './components/admin/MainDashboard/AAttendance.jsx';
import ViewAttendance from './components/admin/MainDashboard/ViewAttendance.jsx';
import VEmpAttendance from './components/admin/MainDashboard/VEmpAttendance.jsx';
import CreateAnnouncements from './components/admin/MainDashboard/CreateAnnouncements.jsx';
import AAnnouncements from './components/admin/MainDashboard/AAnnouncements.jsx';
import './index.css';
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

          {/*Admin Protected Route*/}
          {/*<Route path="/admin_main_dashboard" element={<PrivateRoute element={<Dashboard />} requiredRole="admin" />} />*/}
          <Route path="/admin/dashboard/*" element={<ADashboard />} />
          <Route path="/admin/organization/employee-list/*" element={<EmployeeList />} />
          <Route path="/admin/organization/departments*" element={<Departments />} />
          <Route path="/admin/organization/view-departments*" element={<ViewDepartments />} />
          <Route path="/admin/attendance*" element={<AAttendance />} />
          <Route path="/admin/view-attendance*" element={<ViewAttendance />} />
          <Route path="/admin/view-employee-attendance*" element={<VEmpAttendance />} />
          <Route path="/admin/create-announcements*" element={<CreateAnnouncements />} />
          <Route path="/admin/announcements*" element={<AAnnouncements />} />

          {/* Employee Protected Routes */}
          {/*<Route path="/employee_main_dashboard" element={<PrivateRoute element={<EDashboard />} requiredRole="employee" />} />*/}
          {/*<Route path="/employee_leave_dashboard" element={<PrivateRoute element={<LeaveManagementD />} requiredRole="employee" />} />*/}
          <Route path="/employee/dashboard" element={<EDashboard />} />
          <Route path="/employee/documents/payslip" element={<Payslip />} />
          <Route path="/employee/documents/mydocuments" element={<MyDocuments />} />
          <Route path="/employee/account" element={<Account />} />
          <Route path="/employee/announcements" element={<Announcements />} />
          <Route path="/employee/leave" element={<Leave />} />
          <Route path="/employee/attendance" element={<Attendance />} />
          <Route path="/employee/workschedule" element={<WorkSchedule />} />


          {/* If no path matches, redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
