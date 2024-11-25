import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; // Import axios for making API requests
import SideMenu from './SideMenu'; 
import Header from './Header'; 
import Loader from '../Loader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateAnnouncements() {
    const [activeButton, setActiveButton] = useState(null); // To track which button is clicked
    const [loading, setLoading] = useState(true); // Loading state
    const [departments, setDepartments] = useState([]); // State to store department data
    const [selectedDepartment, setSelectedDepartment] = useState(""); // State for selected department
    const [title, setTitle] = useState(""); // State for the title
    const [description, setDescription] = useState(""); // State for the description
    const navigate = useNavigate(); // Initialize navigate for redirection

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
        return () => clearTimeout(timer);
    }, []);

    // Fetch departments from the API
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('/api/admin/department'); // Replace with your actual API URL
                setDepartments(response.data.data); // Set department data from the API response
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        fetchDepartments();
    }, []);

    const handleButtonClick = (button) => {
        setActiveButton(button); // Set the clicked button as active
        if (button === 'create') {
            navigate('/admin/create-announcements'); // Redirect to create-announcements route
        } else if (button === 'previous') {
            navigate('/admin/announcements'); // Redirect to announcements route
        }
    };

    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value); // Update selected department
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value); // Update title
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value); // Update description
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Validation: Check if all required fields are filled
        if (!selectedDepartment || !title || !description) {
            alert('All fields are required!');
            return; // If any field is empty, alert the user and stop form submission
        }

        // Prepare the form data to be sent in the request
        const formData = {
            departmentID: selectedDepartment,
            title,
            description,
        };

        try {
            // Send the form data via a POST request to the backend API
            const response = await axios.post('/api/admin/announcements/create', formData); // Replace with your actual API endpoint
                toast.success('Announcement created successfully!');

                // Clear the form fields after successful submission
                setSelectedDepartment(""); // Reset department dropdown
                setTitle(""); // Reset title field
                setDescription(""); // Reset description field
        } catch (error) {
            console.error('Error creating announcement:', error);
            alert('Failed to create announcement. Please try again.');
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
                        <form onSubmit={handleSubmit}>
                            <div style={formGroupStyle}>
                                <label htmlFor="departments" style={labelStyle}>
                                    Departments
                                </label>
                                <select
                                    id="departments"
                                    style={inputStyle}
                                    value={selectedDepartment}
                                    onChange={handleDepartmentChange}
                                >
                                    <option value="">All Departments</option>
                                    {departments.map((department) => (
                                        <option key={department.departmentID} value={department.departmentID}>
                                            {department.department_name}
                                        </option>
                                    ))}
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
                                    value={title}
                                    onChange={handleTitleChange}
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
                                    value={description}
                                    onChange={handleDescriptionChange}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                style={sendButtonStyle}
                            >
                                Create Announcement
                            </button>
                        </form>
                    </div>
                </main>
            </div>
            <ToastContainer />
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
