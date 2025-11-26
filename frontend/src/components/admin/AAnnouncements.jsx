import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideMenu from './SideMenu';
import Header from './Header';
import Loader from '../Loader';
import { FaEye, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';

export default function AnnouncementsDashboard() {
  const [activeButton, setActiveButton] = useState(null); // To track which button is clicked
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Loading state
  const [announcements, setAnnouncements] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(
    'Human Resources (HR)'
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('/api/admin/department');
        setDepartments(response.data.data);
      } catch (error) {
        // Error fetching departments
      }
    };
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(
          `/api/admin/announcements?department=${selectedDepartment}`
        );
        setAnnouncements(response.data.data);
      } catch (error) {
        // Error fetching announcements
      }
    };
    fetchDepartments();
    fetchAnnouncements();
  }, [selectedDepartment]);

  const handleButtonClick = (button) => {
    setActiveButton(button); // Set the clicked button as active
    if (button === 'create') {
      navigate('/admin/create-announcements'); // Redirect to create-announcements route
    } else if (button === 'previous') {
      navigate('/admin/announcements'); // Redirect to announcements route
    }
  };
  const handleSelectChange = (event) => {
    setSelectedDepartment(event.target.value);
  };
  const handleDelete = async (id) => {
    // Filter out the announcement with the matching id
    try {
      await axios.post('/api/admin/announcements/delete', { id });
    } catch (error) {
      // Error deleting announcement
    }
    const updatedAnnouncements = announcements.filter(
      (announcement) => announcement.announcementID !== id
    );
    setAnnouncements(updatedAnnouncements);
  };

  const handleViewClick = (id) => {
    //navigate('/anotherComponent'); // Replace '/edit announcement component' with your desired path
    navigate(`/admin/announcements/view/${id}`);
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
      <div
        className="flex-grow-1 d-flex flex-column p-3"
        style={{ overflowY: 'auto' }}
      >
        <Header title="Announcements" />
        <main style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
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
              <select
                style={{ padding: '10px', fontSize: '14px' }}
                value={selectedDepartment} // Bind the selected value
                onChange={handleSelectChange} // Update state on change
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option
                    key={department.department_name}
                    value={department.department_name}
                  >
                    {department.department_name}
                  </option>
                ))}
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
                    key={announcement.announcementID}
                    style={hoverRowStyle}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#eef2f7')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'white')
                    }
                  >
                    <td style={tableCellStyle}>
                      {announcement.announcement_title}
                    </td>
                    <td style={tableCellStyle}>{selectedDepartment}</td>
                    <td style={tableCellStyle}>
                      {announcement.announcement_date}
                    </td>
                    <td style={tableCellStyle}>
                      <button
                        style={actionButtonStyle}
                        onClick={() =>
                          handleViewClick(announcement.announcementID)
                        }
                      >
                        <FaEye />
                      </button>
                      <button
                        style={{ ...actionButtonStyle, color: 'red' }}
                        onClick={() =>
                          handleDelete(announcement.announcementID)
                        }
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
