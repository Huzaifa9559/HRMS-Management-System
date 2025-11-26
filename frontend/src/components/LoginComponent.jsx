import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SelectLogin() {
  const navigate = useNavigate();

  const handleEmployeeLogin = () => {
    navigate('/login/employee'); // Navigate to the employee login page
  };

  const handleAdminLogin = () => {
    navigate('/login/admin'); // Navigate to the admin login page
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100 align-items-center">
        {/* Left side */}
        <div
          className="col-lg-6 d-flex justify-content-center align-items-center text-white p-4 p-lg-5"
          style={{
            backgroundColor: '#0066ff',
            position: 'relative',
            overflow: 'hidden',
            height: '100%',
          }}
        >
          {/* Top-left logo */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg
              className="bi"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="5"
                y="5"
                width="15"
                height="15"
                rx="4"
                ry="4"
                fill="white"
                transform="rotate(20 12 12)"
              />
              <rect
                x="25"
                y="10"
                width="10"
                height="10"
                rx="3"
                ry="3"
                fill="lightgreen"
                transform="rotate(10 25 15)"
              />
              <rect
                x="15"
                y="30"
                width="15"
                height="15"
                rx="4"
                ry="4"
                fill="red"
                transform="rotate(-10 20 36)"
              />
            </svg>
            <span className="ms-2 fs-4 fw-bold">HRMS</span>
          </div>

          {/* Illustration */}
          <div className="text-center login-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="200"
              viewBox="0 0 200 200"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="login-svg"
            >
              <rect
                x="40"
                y="40"
                width="120"
                height="120"
                rx="10"
                className="door"
              />
              <path d="M100 80 L100 120" className="door-line" />
              <circle cx="90" cy="100" r="20" className="user-head" />
              <path
                d="M90 120 Q90 140 110 140 L130 140"
                className="user-body"
              />
              <path d="M70 100 L50 100" className="arm-left" />
              <path d="M110 100 L130 100" className="arm-right" />
            </svg>
          </div>
        </div>

        {/* Right side */}
        <div className="col-lg-6 d-flex justify-content-center align-items-center">
          <div className="w-100 p-5">
            <h2 className="mb-4 text-center">Welcome to HRMS</h2>
            <p className="text-center mb-4">Please select your login type:</p>

            <div className="d-grid gap-4">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleEmployeeLogin}
              >
                Log in as Employee
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={handleAdminLogin}
              >
                Log in as Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-container {
          transition: transform 0.3s ease;
        }

        .login-svg:hover .user-body {
          transform: translateX(20px);
        }

        .login-svg:hover .arm-right {
          transform: rotate(-30deg);
          transform-origin: 110px 100px;
        }

        .user-body,
        .arm-right {
          transition: transform 0.3s ease;
        }

        .door,
        .door-line {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: draw 2s linear forwards;
        }

        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
