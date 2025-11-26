import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { InputGroup, FormControl } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { BiChevronLeft } from 'react-icons/bi';
import Header from './Header';
import SideMenu from './SideMenu';
import Loader from '../Loader';
import axios from 'axios';

const ViewAttendance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { department, departmentId } = location.state;
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchDepartmentAttendance = async () => {
      try {
        const response = await axios.get(`/api/admin/attendance/view-attendance/${departmentId}`);
        setEmployees(response.data.data[0]);
      } catch {
        // Error fetching department attendance
      }
    };

    fetchDepartmentAttendance();
  }, [departmentId]);

  const filteredEmployees = employees.filter((employee) =>
    employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / recordsPerPage);

  const paginate = (employees, page) => {
    const startIndex = (page - 1) * recordsPerPage;
    return employees.slice(startIndex, startIndex + recordsPerPage);
  };

  const displayedEmployees = paginate(filteredEmployees, currentPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

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
    button: {
      backgroundColor: '#007bff',
      color: '#ffffff',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
    },
    pageButton: {
      margin: '0 5px',
      padding: '5px 10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#ffffff',
    },
    activePageButton: {
      backgroundColor: '#007bff',
      color: '#ffffff',
      border: '1px solid #007bff',
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
              onClick={() => navigate('/admin/attendance')}
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
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedEmployees.map((employee, index) => (
                <tr key={index}>
                  <td style={styles.td}>{employee.employeeId}</td>
                  <td style={styles.td}>{employee.employeeName}</td>
                  <td style={styles.td}>{employee.designation}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.button}
                      onClick={() => navigate('/admin/view-employee-attendance', { state: { employeeId: employee.employeeId } })}
                    >
                      Show Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.pagination}>
            <button
              style={currentPage === 1 ? { ...styles.pageButton, cursor: 'not-allowed', opacity: 0.6 } : styles.pageButton}
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                style={currentPage === index + 1 ? { ...styles.pageButton, ...styles.activePageButton } : styles.pageButton}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              style={currentPage === totalPages ? { ...styles.pageButton, cursor: 'not-allowed', opacity: 0.6 } : styles.pageButton}
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAttendance;
