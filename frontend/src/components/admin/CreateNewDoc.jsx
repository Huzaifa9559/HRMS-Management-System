import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // For sending the POST request
import SideMenu from './SideMenu';
import Header from './Header';
import Loader from '../Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateNewDoc() {
    const [loading, setLoading] = useState(true); // Loading state
    const [employeeId, setEmployeeId] = useState(''); // To store employee ID
    const [title, setTitle] = useState(''); // To store document title
    const [file, setFile] = useState(null); // To store the uploaded file
    const [documentType, setDocumentType] = useState('payslip'); // To store selected document type (Payslip or Other)
    const [payslipMonth, setPayslipMonth] = useState(''); // To store selected payslip month
    const [payslipYear, setPayslipYear] = useState(''); // To store selected payslip year

    // List of months and years for payslip
    const months = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(15), (val, index) => currentYear - index);; // Example years from 2020 to 2029

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
        return () => clearTimeout(timer);
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Save selected file
    };

    const handleRemoveFile = () => {
        setFile(null); // Remove the file from state
        document.getElementById('fileUpload').value = ''; // Clear the file input field
    };

 const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!employeeId || !documentType || !file || (documentType === 'other' && !title)) {
        toast.error("All fields are required!");
        return;
    }

    const formData = new FormData();
    formData.append('employeeId', employeeId);
    formData.append('title', title);
    formData.append('file', file);

    if (documentType === 'payslip') {
        if (!payslipMonth || !payslipYear) {
            toast.error("Please select both payslip month and year.");
            return;
        }
        formData.append('payslipMonth', payslipMonth);
        formData.append('payslipYear', payslipYear);

        try {
            // API call to upload payslip
            await axios.post('/api/admin/payslips/uploadPayslip', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Payslip uploaded successfully!");

            // Reset fields after successful upload
            resetFormFields();
        } catch (error) {
            console.error("Error uploading payslip:", error);
            toast.error("Error uploading payslip. Please try again.");
        }
    } else {
        try {
            // API call to upload other document
            await axios.post('/api/admin/my-documents/uploadDocument', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Document uploaded successfully!");

            // Reset fields after successful upload
            resetFormFields();
        } catch (error) {
            console.error("Error uploading document:", error);
            toast.error("Error uploading document. Please try again.");
        }
    }
};

// Function to reset form fields
const resetFormFields = () => {
    setEmployeeId(null);
    setTitle(null);
    setFile(null);
    setDocumentType(null);
    setPayslipMonth(null);
    setPayslipYear(null);
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
                <Header title="Documents" />
                <main
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        padding: '20px',
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
                            Upload Document for Employee
                        </h4>
                        <form onSubmit={handleSubmit}>
                            <div style={formGroupStyle}>
                                <label htmlFor="employeeId" style={labelStyle}>
                                    Employee ID <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="employeeId"
                                    style={inputStyle}
                                    value={employeeId}
                                    onChange={(e) => setEmployeeId(e.target.value)}
                                    placeholder="Enter employee ID"
                                />
                            </div>

                            <div style={formGroupStyle}>
                                <label htmlFor="documentType" style={labelStyle}>
                                    Document Type <span style={{ color: 'red' }}>*</span>
                                </label>
                                <select
                                    id="documentType"
                                    style={inputStyle}
                                    value={documentType}
                                    onChange={(e) => setDocumentType(e.target.value)}
                                >
                                    <option value="payslip">Payslip</option>
                                    <option value="other">Other Document</option>
                                </select>
                            </div>

                            {/* Show month and year dropdown for Payslip */}
                            {documentType === 'payslip' && (
                                <>
                                    <div style={formGroupStyle}>
                                        <label htmlFor="payslipMonth" style={labelStyle}>
                                            Payslip Month <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <select
                                            id="payslipMonth"
                                            style={inputStyle}
                                            value={payslipMonth}
                                            onChange={(e) => setPayslipMonth(e.target.value)}
                                        >
                                            <option value="">Select Month</option>
                                            {months.map((month, index) => (
                                                <option key={index} value={month}>
                                                    {month}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={formGroupStyle}>
                                        <label htmlFor="payslipYear" style={labelStyle}>
                                            Payslip Year <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <select
                                            id="payslipYear"
                                            style={inputStyle}
                                            value={payslipYear}
                                            onChange={(e) => setPayslipYear(e.target.value)}
                                        >
                                            <option value="">Select Year</option>
                                            {years.map((year, index) => (
                                                <option key={index} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Show title for Other Document */}
                            {documentType === 'other' && (
                                <div style={formGroupStyle}>
                                    <label htmlFor="title" style={labelStyle}>
                                        Document Title <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        style={inputStyle}
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Write title here..."
                                    />
                                </div>
                            )}

                            <div style={formGroupStyle}>
                                <label htmlFor="fileUpload" style={labelStyle}>
                                    Upload Document <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="file"
                                    id="fileUpload"
                                    style={fileUploadStyle}
                                    onChange={handleFileChange}
                                />
                            </div>

                            {/* Display file info with option to remove */}
                            {file && (
                                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                    <p>File: {file.name}</p>
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        style={{
                                            ...sendButtonStyle,
                                            backgroundColor: '#dc3545',
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}

                            <button
                                type="submit"
                                style={{
                                    ...sendButtonStyle,
                                    marginTop: '10px',
                                }}
                            >
                                Upload
                            </button>
                        </form>
                    </div>
                </main>
            </div>
             <ToastContainer />
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
    padding: '40px 20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '1200px',
    alignSelf: 'center',
    textAlign: 'left',
    overflow: 'hidden',
    minHeight: '550px',
    display: 'flex',
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
