import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailPattern)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    if (!email.endsWith('@nu.edu.pk')) {
      setEmailError('Email must be in the format of @nu.edu.pk');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) {
      return; // If email is not valid, stop the form submission
    }

    setIsSubmitting(true);
    setMessage('');
    //this backend api sends reset link to that particular user
    try {
      const response = await fetch('/api/employees/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        navigate('/reset-password-sent');
      } else {
        setMessage(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left side */}
        <div
          className="col-lg-6 d-flex flex-column justify-content-center align-items-center text-white p-4 p-lg-5"
          style={{
            backgroundColor: '#0066ff',
            position: 'relative',
            overflow: 'hidden',
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

          {/* Forgot Password SVG centered */}
          <div className="forgot-password-svg">
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
            >
              <rect
                x="40"
                y="80"
                width="120"
                height="80"
                rx="10"
                className="lock-body"
              />
              <circle cx="100" cy="120" r="15" className="keyhole" />
              <path
                d="M85 80 V60 Q85 40 100 40 Q115 40 115 60 V80"
                className="lock-shackle"
              />
              <path d="M60 40 L140 160" className="forget-line" />
              <path d="M140 40 L60 160" className="forget-line" />
              <circle cx="45" cy="45" r="5" fill="white" className="sparkle" />
              <circle
                cx="155"
                cy="155"
                r="5"
                fill="white"
                className="sparkle"
              />
            </svg>
          </div>
        </div>

        {/* Right side - Forgot Password Form */}
        <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center bg-light p-5">
          <div className="w-100" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4 text-center">Forgot your password?</h2>
            <p className="text-center text-muted mb-4">
              Enter your email and we'll send you a reset link.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                {emailError && (
                  <div className="custom-alert d-flex align-items-center text-danger mt-1">
                    <span className="exclamation me-2">❗</span>
                    <span className="alert-text">{emailError}</span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            {message && (
              <div
                className={`mt-3 ${message.includes('Password reset email') ? 'text-success' : 'text-danger'}`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .forgot-password-svg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: float 3s ease-in-out infinite;
        }

        .custom-alert {
          display: flex;
          align-items: center;
        }

        .exclamation {
          font-size: 1.2rem;
          color: red;
        }

        .alert-text {
          font-size: 0.9rem;
          color: red;
        }

        @keyframes float {
          0% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-10px);
          }
          100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
        }

        .lock-body,
        .lock-shackle,
        .keyhole,
        .forget-line {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: draw 2s linear forwards;
        }

        .sparkle {
          opacity: 0;
          animation: sparkle 2s linear forwards 1.5s;
        }

        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes sparkle {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
