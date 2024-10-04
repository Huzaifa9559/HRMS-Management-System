import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CreateAccount from './components/CreateAccount.jsx';
import LoginPage from './components/LoginPage.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ResetPasswordSent from './components/ResetPasswordSent.jsx'; 
import SetNewPassword from './components/SetNewPassword.jsx';
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
        <Route path="*" element={<Navigate to="/forgot-password" replace />} />
      </Routes>
    </Router>
  </React.StrictMode>
);