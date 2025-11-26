import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function SetNewPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Password validation checks
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one capital letter');
      return;
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)) {
      setError('Password must contain at least one symbol');
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    if (!id) {
      setError('Invalid or missing user ID.');
      return;
    }

    try {
      const response = await fetch('/api/employees/auth/set-new-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, password }),
      });

      const data = await response.json();

      if (data.success) {
        navigate('/login');
      } else {
        setError('Failed to set new password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left side */}
        <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center text-white p-4 p-lg-5"
          style={{ backgroundColor: '#0066ff', position: 'relative', overflow: 'hidden' }}>
          {/* Top-left logo */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <svg className="bi" width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="5" width="15" height="15" rx="4" ry="4" fill="white" transform="rotate(20 12 12)" />
              <rect x="25" y="10" width="10" height="10" rx="3" ry="3" fill="lightgreen" transform="rotate(10 25 15)" />
              <rect x="15" y="30" width="15" height="15" rx="4" ry="4" fill="red" transform="rotate(-10 20 36)" />
            </svg>
            <span className="ms-2 fs-4 fw-bold">HRMS</span>
          </div>

          {/* Animated SVG */}
          <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="75" y="100" width="150" height="100" rx="10" stroke="white" strokeWidth="4">
              <animate attributeName="stroke-dasharray" from="0 500" to="500 500" dur="2s" begin="0s" fill="freeze" />
            </rect>
            <circle cx="150" cy="150" r="15" fill="white">
              <animate attributeName="r" values="15;20;15" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <path d="M150 140V160" stroke="white" strokeWidth="4" strokeLinecap="round">
              <animate attributeName="stroke-dasharray" values="0 20;20 20" dur="0.5s" begin="1s" fill="freeze" />
            </path>
            <path d="M140 150H160" stroke="white" strokeWidth="4" strokeLinecap="round">
              <animate attributeName="stroke-dasharray" values="0 20;20 20" dur="0.5s" begin="1.5s" fill="freeze" />
            </path>
          </svg>
        </div>

        {/* Right side */}
        <div className="col-lg-6 d-flex justify-content-center align-items-center">
          <div className="w-100" style={{ maxWidth: '400px' }}>
            <h2 className="text-center mb-4">Set New Password</h2>
            <p className="text-muted text-center mb-4">Set your password for login</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    id="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={togglePasswordVisibility}
                    style={{ border: 'none', background: 'transparent' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <div className="input-group">
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="custom-alert">
                  <span className="exclamation">❗</span>
                  <span className="alert-text">{error}</span>
                </div>
              )}

              <br />
              <button type="submit" className="btn btn-primary w-100">Set Password</button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-alert {
          display: flex;
          align-items: center;
          margin-top: 0px;
        }

        .exclamation {
          font-size: 1.2rem;
          margin-right: 8px;
          color: red;
        }

        .alert-text {
          font-size: 0.9rem;
          color: red;
        }

        .input-group input.form-control {
          flex: 1; /* Ensure both inputs inside input-group take up the same width */
        }

        .input-group .btn {
          margin-left: -40px; /* Keep the button inside the input field */
        }

        .form-control {
          width: 100%; /* Ensure all inputs take full width */
        }
      `}</style>
    </div>
  );
}
