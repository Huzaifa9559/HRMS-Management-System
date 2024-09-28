import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'boxicons';

export default function ResetPasswordSent() {
  const navigate = useNavigate();

  const handleReturnToLogin = () => {
    navigate('/login');
  };

  // Typewriter effect for heading and paragraph
  const [typedTextHeading, setTypedTextHeading] = useState('');
  const [typedTextParagraph, setTypedTextParagraph] = useState('');
  const headingText = 'W elcome to HRMS!';
  const paragraphText = `A  new era of HR management, where efficiency meets simplicity. Empowering you to effortlessly manage everything from employee details and attendance to documents and salary slips—all in one place. With a focus on driving productivity and fostering growth, we handle the administrative work so you can focus on what truly matters: building a thriving and dynamic workforce.`;

  // Typing for Heading
  useEffect(() => {
    let headingIndex = 0;
    const typeHeading = () => {
      if (headingIndex < headingText.length) {
        setTypedTextHeading((prev) => prev + headingText.charAt(headingIndex));
        headingIndex++;
      } else {
        clearInterval(headingInterval);
        typeParagraph(); // Start paragraph typing after heading finishes
      }
    };

    const headingInterval = setInterval(typeHeading, 170); // Slower typing speed for heading

    let paragraphIndex = 0;
    const typeParagraph = () => {
      const paragraphInterval = setInterval(() => {
        if (paragraphIndex < paragraphText.length) {
          setTypedTextParagraph((prev) => prev + paragraphText.charAt(paragraphIndex));
          paragraphIndex++;
        } else {
          clearInterval(paragraphInterval);
        }
      }, 10); // Faster typing speed for paragraph
    };

    return () => {
      clearInterval(headingInterval);
    };
  }, []);

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

            {/* Text content with typewriter effect */}
            <div className="text-start text-lg-start">
                <h1 className="display-5 fw-bold mb-4">{typedTextHeading}</h1> 
                <p className="lead" style={{ fontSize: '0.9rem' }}>
                  {typedTextParagraph}
                </p>
            </div>
        </div>

        {/* Right column */}
        <div className="col-lg-6 d-flex justify-content-center align-items-center p-5">
          <div className="w-100 text-center">
          <box-icon name='envelope' color='#0066ff' size='2rem'></box-icon>
            <h2 className="text-3xl font-bold mb-2">Please check your email!</h2>
            <p className="text-muted mb-4 text-center">
              An email has been sent to <span><b>xyz@abc.com.</b></span> Please click on the included link to reset your password.
            </p>
            <br /><br />
            <button type="submit" className="btn btn-primary w-80" onClick={handleReturnToLogin} >Return to Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}
