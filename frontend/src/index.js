import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CreateAccount from './components/CreateAccount.jsx';
import LoginPage from './components/LoginPage.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ResetPasswordSent from './components/ResetPasswordSent.jsx'; // Updated to match the correct component
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
        <Route path="/check-your-email" element={<ResetPasswordSent />} /> {/* Update to match the correct component */}
        <Route path="*" element={<Navigate to="/forgot-password" replace />} />
      </Routes>
    </Router>
  </React.StrictMode>
);