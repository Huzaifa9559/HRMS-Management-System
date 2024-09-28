import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // Typewriter effect for heading and paragraph
  const [typedTextHeading, setTypedTextHeading] = useState('');
  const [typedTextParagraph, setTypedTextParagraph] = useState('');
  const headingText = 'W elcome to HRMS!';
  const paragraphText = `A  new era of HR management, where efficiency meets simplicity. Empowering you to effortlessly manage everything from employee details and attendance to documents and salary slips—all in one place. With a focus on driving productivity and fostering growth, we handle the administrative work so you can focus on what truly matters: building a thriving and dynamic workforce.`;

  // Typing for Heading
  useEffect(() => {
      let headingIndex = 0;
      const typeHeading = () => {
          if (headingIndex <= headingText.length) {
              setTypedTextHeading((prev) => prev + headingText.charAt(headingIndex));
              headingIndex++;
          } else {
              clearInterval(headingInterval);
              typeParagraph();  // Start paragraph typing after heading finishes
          }
      };

      const headingInterval = setInterval(typeHeading, 170); // Slower typing speed for heading

      let paragraphIndex = 0;
      const typeParagraph = () => {
          const paragraphInterval = setInterval(() => {
              if (paragraphIndex <= paragraphText.length) {
                  setTypedTextParagraph((prev) => prev + paragraphText.charAt(paragraphIndex));
                  paragraphIndex++;
              } else {
                  clearInterval(paragraphInterval);
              }
          }, 10);  // Faster typing speed for paragraph
      };

      return () => {
          clearInterval(headingInterval);
      };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.data.success) {
        // Handle successful login (e.g., store token, redirect)
        console.log('Login successful');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left side */}
        <div className="col-lg-6 d-flex flex-column justify-content-center align-items-start text-white p-4 p-lg-5" 
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
      
            <div className="text-start text-lg-start">
                {/* Display the typing effect text */}
                <h1 className="display-5 fw-bold mb-4">{typedTextHeading}</h1> 
                <p className="lead" style={{ fontSize: '0.9rem' }}>
                  {typedTextParagraph}
                </p>
            </div>
        </div>

        {/* Right side */}
        <div className="col-md-6 d-flex align-items-center">
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
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
              {error && <div className="alert alert-danger">{error}</div>}

              <br />
              <button type="submit" className="btn btn-primary w-100">Log In</button>
            </form>
            
            <div className="mt-3 d-flex justify-content-end">
                <a href="#" className="text-decoration-none">Forgot Password?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
