import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Login() {
  const navigate = useNavigate();
  const { loginAsEmployee } = useAuth(); // Destructure loginAsEmployee from useAuth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [passwordAlert, setPasswordAlert] = useState('');
  const [emailAlert, setEmailAlert] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  useEffect(() => {
    // Check if there's a saved email in localStorage
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail); // Set the email state to the saved email
      setRememberMe(true); // Set rememberMe to true
    }
  }, []); // Run once on component mount

  const handleLogin = async (e) => {
    e.preventDefault();
    setPasswordAlert('');
    setEmailAlert('');
    setError('');

    // Email validation check
    if (!email.endsWith('@nu.edu.pk')) {
      setEmailAlert('Email must be in the format of @nu.edu.pk');
      return;
    }

    // Password validation checks
    if (password.length < 8) {
      setPasswordAlert('Password must be at least 8 characters long');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setPasswordAlert('Password must contain at least one capital letter');
      return;
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)) {
      setPasswordAlert('Password must contain at least one symbol');
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/.test(password)) {
      setPasswordAlert('Password must be alphanumeric and contain at least one lowercase letter, one uppercase letter, one number, and one symbol');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email); // Save email to localStorage
    } else {
      localStorage.removeItem('rememberedEmail'); // Remove email from localStorage if not remembered
    }

    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendURL}/api/employees/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      const token=data.data;
      if (data.message === 'Login successful') {
        loginAsEmployee();
        //const token = getCookie('authToken');  // You can extract the token from cookies here
        localStorage.setItem('authToken', token); 
        // Call loginAsEmployee from AuthContext to update authentication state
        navigate('/employee/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }

  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100 align-items-center">
        {/* Left side */}
        <div className="col-lg-6 d-flex justify-content-center align-items-center text-white p-4 p-lg-5"
          style={{
            backgroundColor: '#0066ff',
            position: 'relative',
            overflow: 'hidden',
            height: '100%',
          }}>

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

          {/* Login concept SVG with hover animation */}
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
              <rect x="40" y="40" width="120" height="120" rx="10" className="door" />
              <path d="M100 80 L100 120" className="door-line" />
              <circle cx="90" cy="100" r="20" className="user-head" />
              <path d="M90 120 Q90 140 110 140 L130 140" className="user-body" />
              <path d="M70 100 L50 100" className="arm-left" />
              <path d="M110 100 L130 100" className="arm-right" />
            </svg>
          </div>
        </div>

        {/* Right side */}
        <div className="col-lg-6 d-flex justify-content-center align-items-center">
          <div className="w-100 p-5">
            <h2 className="mb-4 text-center">Login to HRMS</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {emailAlert && (
                  <div className="custom-alert">
                    <span className="exclamation">❗</span>
                    <span className="alert-text">{emailAlert}</span>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="form-control"
                    id="password"
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
                {passwordAlert && (
                  <div className="custom-alert">
                    <span className="exclamation">❗</span>
                    <span className="alert-text">{passwordAlert}</span>
                  </div>
                )}
              </div>

              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
              </div>

              {error && (
                <div className="custom-alert">
                  <span className="exclamation">❗</span>
                  <span className="alert-text">{error}</span>
                </div>
              )}

              <button type="submit" className="btn btn-primary w-100">Log In</button>
            </form>

            <div className="mt-3 d-flex justify-content-end">
              <a href="/forgot-password" className="text-decoration-none">Forgot Password?</a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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

        .user-body, .arm-right {
          transition: transform 0.3s ease;
        }

        .door, .door-line {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: draw 2s linear forwards;
        }

        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        .custom-alert {
          display: flex;
          align-items: center;
          color: red;
          margin-top: 5px;
        }

        .exclamation {
          font-size: 1.2rem;
          margin-right: 5px;
        }

        .alert-text {
          font-size: 0.9rem;
        }

        .input-group input.form-control {
          flex: 1; /* Make the input take up all available space */
        }

        .input-group .btn {
          margin-left: -40px; /* Keep the button inside the input group */
        }
      `}</style>
    </div>
  );
}
