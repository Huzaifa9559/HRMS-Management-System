import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ title }) {
  const navigate = useNavigate();
  const handleLogoutClick = () => {
    // Clear cache and cookies
    localStorage.clear(); // Clear local storage
    sessionStorage.clear(); // Clear session storage
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    }); // Clear cookies

    navigate('/login');
  };
  return (
    <div
      className="d-flex align-items-center justify-content-between p-3 mb-4 w-100"
      style={{
        backgroundColor: '#fff',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: '0',
        zIndex: '1',
        margin: '0',
      }}
    >
      <h1 className="h4 mb-0">{title}</h1>
      <button
        className="btn btn-outline-danger"
        onClick={() => handleLogoutClick()}
        style={{ fontSize: '0.875rem' }}
      >
        Log Out
      </button>
    </div>
  );
}
