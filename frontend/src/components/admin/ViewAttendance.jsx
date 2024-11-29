import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { InputGroup, FormControl } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { BiChevronLeft } from 'react-icons/bi';
import Header from './Header';
import SideMenu from './SideMenu';
import Loader from '../Loader';

const ViewAttendance = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Fallback for department if undefined
  const department = location.state?.department || { name: 'Unknown', present: 0, absent: 0 };
  const [loading, setLoading] = useState(true); // Loading state
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer);
}, []);

  const employees = [
    { id: 'EM13464', name: 'Nolan Press', designation: 'Product Design', status: 'Present' },
    { id: 'EM13465', name: 'Cristofer Stanton', designation: 'Graphic Designer', status: 'Absent' },
    { id: 'EM13466', name: 'Davis Aminoff', designation: 'UI/UX Design', status: 'Present' },
    { id: 'EM13467', name: 'James Lubin', designation: 'Advertising Designer', status: 'Present' },
  ];

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    titleAndButtons: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'normal',
    },
    backButton: {
      backgroundColor: '#3e4756',
      color: '#ffffff',
      border: 'none',
      padding: '8px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      marginLeft: '-10px',
    },
    searchInputGroup: {
      marginBottom: '20px',
      width: '100%',
      maxWidth: '400px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      backgroundColor: '#f4f4f4',
      padding: '10px',
      border: '1px solid #ddd',
      textAlign: 'left',
    },
    td: {
      padding: '10px',
      border: '1px solid #ddd',
      textAlign: 'left',
    },
    presentText: {
      color: '#28a745',
    },
    absentText: {
      color: '#e74c3c',
    },
    rowHover: {
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    rowHoverActive: {
      backgroundColor: '#f1f1f1',
    },
  };

  if (loading) {
    return <Loader />;
}

  return (
    <div className="d-flex" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', overflow: 'hidden' }}>
      <SideMenu />
      <div className="flex-grow-1 d-flex flex-column p-3" style={{ overflowY: 'auto' }}>
        <Header title="Attendance" />
        <div>
          <div style={styles.titleAndButtons}>
            <h4 style={styles.title}>{department.name}</h4>
            <button
              style={styles.backButton}
              onClick={() => navigate('/admin/attendance')} // Redirect to /admin/attendance
            >
              <BiChevronLeft size={20} color="#ffffff" />
              Back
            </button>
          </div>

          <InputGroup style={styles.searchInputGroup}>
            <InputGroup.Text className="bg-white border-end-0">
              <FaSearch color="#6c757d" />
            </InputGroup.Text>
            <FormControl
              placeholder="Search Employee"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Employee ID</th>
                <th style={styles.th}>Employee</th>
                <th style={styles.th}>Designation</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr
                  key={index}
                  style={styles.rowHover}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.rowHoverActive.backgroundColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                >
                  <td style={styles.td}>{employee.id}</td>
                  <td style={styles.td}>{employee.name}</td>
                  <td style={styles.td}>{employee.designation}</td>
                  <td style={styles.td}>
                    <span
                      style={
                        employee.status === 'Present'
                          ? styles.presentText
                          : styles.absentText
                      }
                    >
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewAttendance;
