import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import SideMenu from './SideMenu'; 
import Header from './Header'; 
import Loader from '../Loader';

export default function CreateNewDoc() {
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer);
    }, []);


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
                <Header title="Documents" />
                <main
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center', // Vertically centered
                    alignItems: 'center',
                    height: '100%', // Take up the full available height
                    padding: '20px', // Adjusted padding for spacing
                    overflow: 'hidden',
                }}
            >


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
                            Create New Document
                        </h4>
                        <form>
                            <div style={formGroupStyle}>
                                <label htmlFor="title" style={labelStyle}>
                                    Document Title <span style={{ color: 'red' }}>*</span>
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
                                    Document Description <span style={{ color: 'red' }}>*</span>
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
                                    Upload Documents
                                </label>
                                <label htmlFor="fileUpload" style={fileUploadStyle}>
                                    <span>Browse to upload</span>
                                </label>
                                <input
                                    type="file"
                                    id="fileUpload"
                                    style={{ display: 'none' }}
                                />
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
    padding: '40px 20px', // Increased padding for more space inside
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '1200px',
    alignSelf: 'center',
    textAlign: 'left',
    overflow: 'hidden',
    minHeight: '550px', // Increased minimum height
    display: 'flex', // Added flexbox for centering content
    flexDirection: 'column',
    justifyContent: 'center',
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
