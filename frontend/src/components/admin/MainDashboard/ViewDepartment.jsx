import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { BiChevronLeft } from 'react-icons/bi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for the toaster
import Header from './Header';
import SideMenu from './SideMenu';

const ViewDepartments = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Fallback for department if undefined
  const department =
    location.state?.department || { name: 'Unknown', designations: 0, employees: 0 };

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [designationName, setDesignationName] = useState('');

  const designations = [
    { name: 'Product Design', employees: 6, lastUpdate: '05 Sep 2021' },
    { name: 'Graphic Designer', employees: 30, lastUpdate: '05 Sep 2021' },
    { name: 'UI/UX Design', employees: 10, lastUpdate: '05 Sep 2021' },
    { name: 'Advertising Designer', employees: 30, lastUpdate: '05 Sep 2021' },
  ];

  const filteredDesignations = designations.filter((designation) =>
    designation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDesignation = () => {
    if (designationName) {
      toast.success(`Designation "${designationName}" created successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });
      setShowModal(false);
      setDesignationName('');
    } else {
      toast.error('Please enter a valid designation name!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
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
    buttonGroup: {
      display: 'flex',
      gap: '10px',
    },
    button: {
      padding: '8px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    backButton: {
      backgroundColor: '#3e4756',
      color: '#ffffff',
      border: 'none',
    },
    createButton: {
      backgroundColor: '#28a745',
      color: '#ffffff',
      border: 'none',
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
  };

  return (
    <div className="d-flex" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', overflow: 'hidden' }}>
      <SideMenu />
      <div className="flex-grow-1 d-flex flex-column p-3" style={{ overflowY: 'auto' }}>
        <Header title="Organization" />
        <div>
          <div style={styles.titleAndButtons}>
            <h4 style={styles.title}>{department.name}</h4>
            <div style={styles.buttonGroup}>
              <button
                style={{ ...styles.button, ...styles.backButton }}
                onClick={() => navigate('/admin/organization/departments')}
              >
                <BiChevronLeft size={20} color="#ffffff" />
                Back
              </button>
              <button style={{ ...styles.button, ...styles.createButton }} onClick={() => setShowModal(true)}>
                Create Designation
              </button>
            </div>
          </div>

          <InputGroup style={styles.searchInputGroup}>
            <InputGroup.Text className="bg-white border-end-0">
              <FaSearch color="#6c757d" />
            </InputGroup.Text>
            <FormControl
              placeholder="Search Designation"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Designation</th>
                <th style={styles.th}>Total Employees</th>
                <th style={styles.th}>Last Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredDesignations.map((designation, index) => (
                <tr key={index}>
                  <td style={styles.td}>{designation.name}</td>
                  <td style={styles.td}>{designation.employees}</td>
                  <td style={styles.td}>{designation.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Create New Designation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Designation Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter designation name"
                  value={designationName}
                  onChange={(e) => setDesignationName(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: '#28a745', border: 'none' }}
              onClick={handleCreateDesignation}
            >
              Create
            </Button>
          </Modal.Footer>
        </Modal>

        <ToastContainer />
      </div>
    </div>
  );
};

export default ViewDepartments;
