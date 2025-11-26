import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

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
import Account from './components/employee/Account.jsx';
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
import CreateAnnouncements from './components/admin/CreateAnnouncements.jsx';
import CreateNewDoc from './components/admin/CreateNewDoc.jsx';
import ALeave from './components/admin/ALeave.jsx';
import VEmpAttendance from './components/admin/VEmpAttendance.jsx';
import VEmpLeave from './components/admin/VEmpLeave.jsx';
import ADocuments from './components/admin/ADocuments.jsx';
import AAnnouncements from './components/admin/AAnnouncements.jsx';
import Login from './components/admin/Login.jsx';
import EditEmpAccount from './components/admin/EditEmpAccount.jsx';
import AWorkSchedule from './components/admin/AWorkSchedule.jsx';
import AddNewEmployee from './components/admin/AddNewEmployee.jsx';
import AllPayslips from './components/admin/APayslips.jsx';
import AAnnouncementView from './components/admin/AAnnouncementView.jsx';
import AAccount from './components/admin/AAccount.jsx';

import LoginComponent from './components/LoginComponent.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
axios.defaults.baseURL =
  process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login/employee" element={<LoginPage />} />
          <Route path="/reset-password-sent" element={<ResetPasswordSent />} />
          <Route path="/set-new-password" element={<SetNewPassword />} />
          <Route path="/login/admin" element={<Login />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute element={<ADashboard />} requiredRole="admin" />
            }
          />
          <Route
            path="/admin/organization/employee-list"
            element={
              <PrivateRoute element={<EmployeeList />} requiredRole="admin" />
            }
          />
          <Route
            path="/admin/organization/departments"
            element={
              <PrivateRoute element={<Departments />} requiredRole="admin" />
            }
          />
          <Route
            path="/admin/organization/view-departments/:id"
            element={
              <PrivateRoute
                element={<ViewDepartments />}
                requiredRole="admin"
              />
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <PrivateRoute element={<AAttendance />} requiredRole="admin" />
            }
          />
          <Route
            path="/admin/view-attendance"
            element={
              <PrivateRoute element={<ViewAttendance />} requiredRole="admin" />
            }
          />
          <Route
            path="/admin/view-employee-attendance"
            element={
              <PrivateRoute element={<VEmpAttendance />} requiredRole="admin" />
            }
          />
          <Route
            path="/admin/create-announcements"
            element={
              <PrivateRoute
                element={<CreateAnnouncements />}
                requiredRole="admin"
              />
            }
          />
          <Route
            path="/admin/announcements"
            element={
              <PrivateRoute element={<AAnnouncements />} requiredRole="admin" />
            }
          />
          <Route
            path="/admin/documents/upload-document"
            element={
              <PrivateRoute element={<CreateNewDoc />} requiredRole="admin" />
            }
          />
          <Route
            path="/admin/documents/all-received"
            element={
              <PrivateRoute element={<ADocuments />} requiredRole="admin" />
            }
          />
          <Route
            path="/admin/leave"
            element={<PrivateRoute element={<ALeave />} requiredRole="admin" />}
          />
          <Route
            path="/admin/view-employee-leave/:leaveID/:employeeId"
            element={
              <PrivateRoute element={<VEmpLeave />} requiredRole="admin" />
            }
          />
          <Route
            path="/admin/edit-employee-account/:employeeId"
            element={
              <PrivateRoute element={<EditEmpAccount />} requiredRole="admin" />
            }
          />
          <Route
            path="/admin/workschedule"
            element={
              <PrivateRoute element={<AWorkSchedule />} requiredRole="admin" />
            }
          />
          <Route
            path="/admin/add-new-employee"
            element={
              <PrivateRoute element={<AddNewEmployee />} requiredRole="admin" />
            }
          />
          <Route
            path="/admin/all-payslips"
            element={
              <PrivateRoute element={<AllPayslips />} requiredRole="admin" />
            }
          />
          <Route
            path="/admin/announcements/view/:id"
            element={
              <PrivateRoute
                element={<AAnnouncementView />}
                requiredRole="admin"
              />
            }
          />
          <Route
            path="admin/employee/account/:id"
            element={
              <PrivateRoute element={<AAccount />} requiredRole="admin" />
            }
          />

          {/* Employee Protected Routes */}

          <Route
            path="/employee/dashboard"
            element={
              <PrivateRoute element={<EDashboard />} requiredRole="employee" />
            }
          />
          <Route
            path="/employee/documents/payslip"
            element={
              <PrivateRoute element={<Payslip />} requiredRole="employee" />
            }
          />
          <Route
            path="/employee/documents/mydocuments"
            element={
              <PrivateRoute element={<MyDocuments />} requiredRole="employee" />
            }
          />
          <Route
            path="/employee/account"
            element={
              <PrivateRoute element={<Account />} requiredRole="employee" />
            }
          />
          <Route
            path="/employee/announcements"
            element={
              <PrivateRoute
                element={<Announcements />}
                requiredRole="employee"
              />
            }
          />
          <Route
            path="/employee/leave"
            element={
              <PrivateRoute element={<Leave />} requiredRole="employee" />
            }
          />
          <Route
            path="/employee/attendance"
            element={
              <PrivateRoute element={<Attendance />} requiredRole="employee" />
            }
          />
          <Route
            path="/employee/workschedule"
            element={
              <PrivateRoute
                element={<WorkSchedule />}
                requiredRole="employee"
              />
            }
          />
          <Route
            path="/employee/announcements/view/:id"
            element={
              <PrivateRoute
                element={<AnnouncementView />}
                requiredRole="employee"
              />
            }
          />

          {/* If no path matches, redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
