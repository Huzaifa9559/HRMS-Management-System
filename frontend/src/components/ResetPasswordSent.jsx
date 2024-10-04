import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordSent() {
  const navigate = useNavigate();

  const handleReturnToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left side */}
        <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center text-white p-4 p-lg-5" 
            style={{
                backgroundColor: '#0066ff',
                position: 'relative',
                overflow: 'hidden'
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

            {/* Envelope SVG centered with subtle animation */}
            <div className="envelope-svg" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animation: 'pulse 4s ease-in-out infinite' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                <path d="M22 6L12 13 2 6" />
              </svg>
            </div>
        </div>

        {/* Right column */}
        <div className="col-lg-6 d-flex justify-content-center align-items-center p-5">
          <div className="w-100 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <h2 className="text-3xl font-bold mb-2">Please check your email!</h2>
            <p className="text-muted mb-4 text-center">
              An email has been sent to <span><b>xyz@abc.com.</b></span> Please click on the included link to reset your password.
            </p>
            <br /><br />
            <button type="button" className="btn btn-primary w-80" onClick={handleReturnToLogin}>Return to Login</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05) rotate(1deg);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .envelope-svg svg {
          transition: transform 0.3s ease-in-out;
        }

        .envelope-svg svg:hover {
          transform: rotate(3deg);
        }
      `}</style>
    </div>
  );
}
