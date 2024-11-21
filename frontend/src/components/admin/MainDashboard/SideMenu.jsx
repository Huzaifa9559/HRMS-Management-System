import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBuilding, FaUsers, FaCalendarAlt, FaUserCheck, FaBullhorn, FaFileAlt,FaSitemap } from 'react-icons/fa'; 
import { ChevronLeft, ChevronRight } from 'lucide-react'; 
import { MdDashboard } from 'react-icons/md';

export default function SideMenu() {
    const [isCollapsed, setIsCollapsed] = useState(false); // State for collapsed status
    const [showOrganizationsDropdown, setShowOrganizationsDropdown] = useState(false); // State for documents dropdown

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed); // Toggle collapse/expand
    };

    const sidebarStyles = {
        height: '100vh',
        width: isCollapsed ? '80px' : '250px',
        backgroundColor: '#007bff', // Primary blue background
        borderRight: '1px solid #e0e0e0',
        transition: 'width 0.3s',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    };

    const logoSectionStyles = {
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
    };

    const menuTextStyles = {
        marginLeft: '10px',
        fontSize: '16px',
        display: isCollapsed ? 'none' : 'inline',
        color: 'white',
    };

    const collapseButtonStyles = {
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        cursor: 'pointer',
    };

    const navLinkStyles = {
        padding: '10px 15px',
        borderRadius: '4px',
        textDecoration: 'none',
        transition: 'background-color 0.3s, box-shadow 0.3s',
    };

    return (
        <div style={sidebarStyles}>
            {/* Top-left logo */}
            <div style={logoSectionStyles}>
                <svg className="bi" width="40" height="40" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="5" width="15" height="15" rx="4" ry="4" fill="white" transform="rotate(20 12 12)" />
                    <rect x="25" y="10" width="10" height="10" rx="3" ry="3" fill="lightgreen" transform="rotate(10 25 15)" />
                    <rect x="15" y="30" width="15" height="15" rx="4" ry="4" fill="red" transform="rotate(-10 20 36)" />
                </svg>
                {!isCollapsed && <span className="ms-2 fs-5 fw-bold text-white">HRMS</span>}
            </div>

            {/* Navigation Links with Hover Effect */}
            <nav className="nav flex-column">
                <NavLink
                    to="/admin/dashboard"
                    className="nav-link d-flex align-items-center text-white mb-2"
                    activeClassName="active"
                    style={navLinkStyles}
                    activeStyle={{
                        backgroundColor: '#0056b3',
                        color: '#ffffff',
                    }}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.1)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                >
                    <MdDashboard className="me-2" />
                    <span style={menuTextStyles}>Dashboard</span>
                </NavLink>
                {/* Documents Dropdown */}
                <div
                    className="nav-link d-flex align-items-center text-white mb-2"
                    style={{ ...navLinkStyles, cursor: 'pointer' }}
                    onClick={() => setShowOrganizationsDropdown(!showOrganizationsDropdown)}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.1)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                >
                    <FaSitemap className="me-2" />
                    <span style={menuTextStyles}>Organization</span>
                    <ChevronRight
                        className="ms-auto"
                        style={{
                            transform: showOrganizationsDropdown ? 'rotate(90deg)' : 'rotate(0)',
                            transition: 'transform 0.3s',
                            width: '16px', // Adjust the width
                            height: '16px', // Adjust the height
                        }}
                    />
                </div>
                {showOrganizationsDropdown && (
                    <div style={{ marginLeft: isCollapsed ? '15px' : '35px', transition: 'margin-left 0.3s' }}>
                        <NavLink
                            to="/admin/organization/employee-list"
                            className="nav-link d-flex align-items-center text-white mb-2"
                            activeClassName="active"
                            style={navLinkStyles}
                            activeStyle={{
                                backgroundColor: '#0056b3',
                                color: '#ffffff',
                            }}
                            onMouseEnter={(e) => e.target.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.1)'}
                            onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                        >
                            <FaUsers className="me-2" />
                            <span style={menuTextStyles}>Employee List</span>
                        </NavLink>
                        <NavLink
                            to="/admin/organization/departments"
                            className="nav-link d-flex align-items-center text-white mb-2"
                            activeClassName="active"
                            style={navLinkStyles}
                            activeStyle={{
                                backgroundColor: '#0056b3',
                                color: '#ffffff',
                            }}
                            onMouseEnter={(e) => e.target.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.1)'}
                            onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                        >
                            <FaBuilding className="me-2" />
                            <span style={menuTextStyles}>Departments</span>
                        </NavLink>
                    </div>
                )}

                <NavLink
                    to="/admin/attendance"
                    className="nav-link d-flex align-items-center text-white mb-2"
                    activeClassName="active"
                    style={navLinkStyles}
                    activeStyle={{
                        backgroundColor: '#0056b3',
                        color: '#ffffff',
                    }}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.1)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                >
                    <FaCalendarAlt className="me-2" />
                    <span style={menuTextStyles}>Attendance</span>
                </NavLink>

                <NavLink
                    to="/admin/leave"
                    className="nav-link d-flex align-items-center text-white mb-2"
                    activeClassName="active"
                    style={navLinkStyles}
                    activeStyle={{
                        backgroundColor: '#0056b3',
                        color: '#ffffff',
                    }}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.1)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                >
                    <FaUserCheck className="me-2" />
                    <span style={menuTextStyles}>Leave</span>
                </NavLink>

                <NavLink
                    to="/admin/documents"
                    className="nav-link d-flex align-items-center text-white mb-2"
                    activeClassName="active"
                    style={navLinkStyles}
                    activeStyle={{
                        backgroundColor: '#0056b3',
                        color: '#ffffff',
                    }}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.1)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                >
                    <FaFileAlt className="me-2" />
                    <span style={menuTextStyles}>Documents</span>
                </NavLink>

                <NavLink
                    to="/admin/announcements"
                    className="nav-link d-flex align-items-center text-white mb-2"
                    activeClassName="active"
                    style={navLinkStyles}
                    activeStyle={{
                        backgroundColor: '#0056b3',
                        color: '#ffffff',
                    }}
                    onMouseEnter={(e) => e.target.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.1)'}
                    onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                >
                    <FaBullhorn className="me-2" />
                    <span style={menuTextStyles}>Announcements</span>
                </NavLink>
            </nav>

            {/* Collapse/Expand Button */}
            <div style={collapseButtonStyles} onClick={toggleSidebar}>
                {isCollapsed ? <ChevronRight color="#fff" /> : <ChevronLeft color="#fff" />}
            </div>
        </div>
    );
}
