import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaCalendarAlt, FaUserCheck, FaCogs, FaFileAlt } from 'react-icons/fa'; // Example icons

export default function SideMenu() {
    return (
        <div
            className="vh-100 d-flex flex-column p-3"
            style={{
                backgroundColor: '#007bff', // Primary blue background
                borderRight: '1px solid #e0e0e0',
                width: '250px',
            }}
        >
            {/* Top-left logo */}
            <div className="d-flex align-items-center mb-4">
                <svg className="bi" width="40" height="40" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="5" width="15" height="15" rx="4" ry="4" fill="white" transform="rotate(20 12 12)" />
                    <rect x="25" y="10" width="10" height="10" rx="3" ry="3" fill="lightgreen" transform="rotate(10 25 15)" />
                    <rect x="15" y="30" width="15" height="15" rx="4" ry="4" fill="red" transform="rotate(-10 20 36)" />
                </svg>
                <span className="ms-2 fs-5 fw-bold text-white">HRMS</span>
            </div>

            {/* Navigation Links with Hover Effect */}
            <nav className="nav flex-column">
                <NavLink
                    to="/dashboard"
                    className="nav-link d-flex align-items-center text-white mb-2"
                    activeClassName="active"
                    style={{
                        padding: '10px 15px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        transition: 'background-color 0.3s, box-shadow 0.3s', // Smooth transition for hover effect
                    }}
                    activeStyle={{
                        backgroundColor: '#0056b3',
                        color: '#ffffff',
                    }}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.1)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                >
                    <FaTachometerAlt className="me-2" /> Dashboard
                </NavLink>

                <NavLink
                    to="/organization"
                    className="nav-link d-flex align-items-center text-white mb-2"
                    activeClassName="active"
                    style={{
                        padding: '10px 15px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        transition: 'background-color 0.3s, box-shadow 0.3s',
                    }}
                    activeStyle={{
                        backgroundColor: '#0056b3',
                        color: '#ffffff',
                    }}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.1)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                >
                    <FaUsers className="me-2" /> Organization
                </NavLink>

                <NavLink
                    to="/attendance"
                    className="nav-link d-flex align-items-center text-white mb-2"
                    activeClassName="active"
                    style={{
                        padding: '10px 15px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        transition: 'background-color 0.3s, box-shadow 0.3s',
                    }}
                    activeStyle={{
                        backgroundColor: '#0056b3',
                        color: '#ffffff',
                    }}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.1)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                >
                    <FaCalendarAlt className="me-2" /> Attendance
                </NavLink>

                <NavLink
                    to="/leave"
                    className="nav-link d-flex align-items-center text-white mb-2"
                    activeClassName="active"
                    style={{
                        padding: '10px 15px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        transition: 'background-color 0.3s, box-shadow 0.3s',
                    }}
                    activeStyle={{
                        backgroundColor: '#0056b3',
                        color: '#ffffff',
                    }}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.1)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                >
                    <FaUserCheck className="me-2" /> Leave
                </NavLink>

                <NavLink
                    to="/documents"
                    className="nav-link d-flex align-items-center text-white mb-2"
                    activeClassName="active"
                    style={{
                        padding: '10px 15px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        transition: 'background-color 0.3s, box-shadow 0.3s',
                    }}
                    activeStyle={{
                        backgroundColor: '#0056b3',
                        color: '#ffffff',
                    }}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.1)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                >
                    <FaFileAlt className="me-2" /> Documents
                </NavLink>

                <NavLink
                    to="/settings"
                    className="nav-link d-flex align-items-center text-white mb-2"
                    activeClassName="active"
                    style={{
                        padding: '10px 15px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        transition: 'background-color 0.3s, box-shadow 0.3s',
                    }}
                    activeStyle={{
                        backgroundColor: '#0056b3',
                        color: '#ffffff',
                    }}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.1)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                >
                    <FaCogs className="me-2" /> Settings
                </NavLink>
            </nav>
        </div>
    );
}
