import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from './SideMenu';
import Header from './Header';
import Loader from '../Loader';
import { FaEye, FaTrashAlt } from 'react-icons/fa';

export default function AnnouncementsDashboard() {
    const [activeButton, setActiveButton] = useState(null); // To track which button is clicked
    const navigate = useNavigate(); // Initialize navigate for redirection
    const [loading, setLoading] = useState(true); // Loading state
    const [announcements, setAnnouncements] = useState([
        { id: 1, title: 'For Sending Picture', department: 'All', date: '01-08-2021' },
        { id: 2, title: 'For Sending Picture', department: 'All', date: '01-08-2021' },
        { id: 3, title: 'For Sending Picture', department: 'All', date: '01-08-2021' },
        { id: 4, title: 'For Sending Picture', department: 'All', date: '01-08-2021' },
        { id: 5, title: 'For Sending Picture', department: 'All', date: '01-08-2021' },
        { id: 6, title: 'For Sending Picture', department: 'All', date: '01-08-2021' },
    ]);

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

    const handleDelete = (id) => {
        // Filter out the announcement with the matching id
        const updatedAnnouncements = announcements.filter((announcement) => announcement.id !== id);
        setAnnouncements(updatedAnnouncements);
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="d-flex" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', overflow: 'hidden' }}>
            <SideMenu />
            <div className="flex-grow-1 d-flex flex-column p-3" style={{ overflowY: 'auto' }}>
                <Header title="Announcements" />
                <main style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        {/* Buttons at the Top */}
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
                        <div>
                            <select style={dropdownStyle}>
                                <option>Departments</option>
                                {/* Add more options as needed */}
                            </select>
                        </div>
                    </div>
                    {/* Table Section */}
                    <div style={tableContainerStyle}>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={tableHeaderStyle}>Title</th>
                                    <th style={tableHeaderStyle}>Departments</th>
                                    <th style={tableHeaderStyle}>Creation Date</th>
                                    <th style={tableHeaderStyle}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {announcements.map((announcement) => (
                                    <tr
                                        key={announcement.id}
                                        style={hoverRowStyle}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eef2f7')}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                                    >
                                        <td style={tableCellStyle}>{announcement.title}</td>
                                        <td style={tableCellStyle}>{announcement.department}</td>
                                        <td style={tableCellStyle}>{announcement.date}</td>
                                        <td style={tableCellStyle}>
                                            <button style={actionButtonStyle}><FaEye /></button>
                                            <button
                                                style={{ ...actionButtonStyle, color: 'red' }}
                                                onClick={() => handleDelete(announcement.id)}
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}

// Styles
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

const dropdownStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
};

const tableContainerStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    overflowX: 'auto', // Ensure responsiveness for small screens
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
};

const tableHeaderStyle = {
    backgroundColor: '#f3f3f3',
    color: '#333',
    textAlign: 'left',
    padding: '10px',
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd',
};

const tableCellStyle = {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
};

const hoverRowStyle = {
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
};

const actionButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'green',
    marginRight: '10px',
};
