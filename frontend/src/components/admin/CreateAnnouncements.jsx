import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import SideMenu from './SideMenu'; 
import Header from './Header'; 
import Loader from '../Loader';

export default function CreateAnnouncements() {
    const [activeButton, setActiveButton] = useState(null); // To track which button is clicked
    const navigate = useNavigate(); // Initialize navigate for redirection
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer);
    }, []);

    const handleButtonClick = (button) => {
        setActiveButton(button); // Set the clicked button as active
        if (button === 'create') {
            navigate('/admin/create-announcements'); // Redirect to create-announcements route
        } else if (button === 'previous') {
            navigate('/admin/announcements'); // Redirect to announcements route
        }
    };

    if (loading) {
        return <Loader />;
      }
      
    return (
        <div
            className="d-flex"
            style={{
                backgroundColor: '#f9f9f9',
                minHeight: '100vh',
                overflow: 'hidden',
            }}
        >
            <SideMenu />
            <div className="flex-grow-1 d-flex flex-column p-3">
                <Header title="Announcements" />
                <main
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        height: '100%',
                        padding: '0 20px',
                        overflow: 'hidden',
                    }}
                >
                    {/* Buttons at the Top Left */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: '10px',
                            width: '100%',
                            marginBottom: '10px',
                            maxWidth: '1200px',
                        }}
                    >
                        <button
                            style={
                                activeButton === 'create'
                                    ? clickedButtonStyle
                                    : defaultButtonStyle
                            }
                            onClick={() => handleButtonClick('create')}
                        >
                            Create
                        </button>
                        <button
                            style={
                                activeButton === 'previous'
                                    ? clickedButtonStyle
                                    : defaultButtonStyle
                            }
                            onClick={() => handleButtonClick('previous')}
                        >
                            Previous
                        </button>
                    </div>

                    {/* Form Container */}
                    <div style={formContainerStyle}>
                        <h4
                            style={{
                                marginBottom: '20px',
                                fontSize: '1.25rem',
                                color: '#333',
                                textAlign: 'left',
                            }}
                        >
                            Create New Announcements
                        </h4>
                        <form>
                            <div style={formGroupStyle}>
                                <label htmlFor="departments" style={labelStyle}>
                                    Departments
                                </label>
                                <select id="departments" style={inputStyle}>
                                    <option>All Departments</option>
                                    {/* Add more options as needed */}
                                </select>
                            </div>
                            <div style={formGroupStyle}>
                                <label htmlFor="title" style={labelStyle}>
                                    Title <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    style={inputStyle}
                                    placeholder="Write title here..."
                                />
                            </div>
                            <div style={formGroupStyle}>
                                <label htmlFor="description" style={labelStyle}>
                                    Description <span style={{ color: 'red' }}>*</span>
                                </label>
                                <textarea
                                    id="description"
                                    style={{
                                        ...inputStyle,
                                        height: '80px',
                                    }}
                                    placeholder="Write description here..."
                                ></textarea>
                            </div>
                            <div style={formGroupStyle}>
                                <label htmlFor="fileUpload" style={labelStyle}>
                                    Upload
                                </label>
                                <div style={fileUploadStyle}>
                                    <span>Browse to upload</span>
                                    <input
                                        type="file"
                                        id="fileUpload"
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                style={{
                                    ...sendButtonStyle, // Updated to always have blue background and white text
                                    marginTop: '10px',
                                }}
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

// Button Styles
const defaultButtonStyle = {
    padding: '8px 15px',
    backgroundColor: 'transparent',
    color: '#007bff',
    border: '2px solid #007bff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'all 0.3s ease',
};

const clickedButtonStyle = {
    padding: '8px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: '2px solid #007bff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'all 0.3s ease',
};

// Send Button Style (always blue with white text)
const sendButtonStyle = {
    padding: '8px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'all 0.3s ease',
};

// Form Styles
const formContainerStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '1200px',
    alignSelf: 'center',
    textAlign: 'left',
    overflow: 'hidden',
};

const formGroupStyle = {
    marginBottom: '15px',
};

const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    fontSize: '14px',
    boxSizing: 'border-box',
};

const fileUploadStyle = {
    display: 'inline-block',
    padding: '10px 20px',
    border: '1px dashed #ced4da',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'center',
};
