import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateAccount from './components/CreateAccount.jsx';
import LoginPage from './components/Login-page.jsx';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Define routes for different pages */}
        <Route path="/login" element={<LoginPage />} /> {/*Route for Login page */}
        <Route path="/create-account" element={<CreateAccount />} /> {/* Route for CreateAccount page */}
        {/* You can add more routes here */}
      </Routes>
    </Router>
  </React.StrictMode>
);
