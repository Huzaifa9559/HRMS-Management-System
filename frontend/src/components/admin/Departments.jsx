import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideMenu from './SideMenu';
import Header from './Header';
import Loader from '../Loader';

export default function Departments() {
  const navigate = useNavigate();

  const initialDepartments = [
    { id: 1, name: 'Design Department', designations: 4, employees: 15 },
    { id: 2, name: 'Android Development', designations: 4, employees: 15 },
    { id: 3, name: 'HR', designations: 4, employees: 15 },
    { id: 4, name: 'Web Development', designations: 4, employees: 15 },
    { id: 5, name: 'Account Development', designations: 4, employees: 15 },
  ];

  const [departmentData, setDepartmentData] = useState(initialDepartments); // State for departments
  const [loading, setLoading] = useState(true); // Loading state
  const [showModal, setShowModal] = useState(false); // Modal for adding departments
  const [deleteModal, setDeleteModal] = useState(false); // Modal for delete confirmation
  const [departmentName, setDepartmentName] = useState(''); // New department name
  const [selectedDepartment, setSelectedDepartment] = useState(null); // Selected department for deletion
  const [popupPosition, setPopupPosition] = useState(null); // Popup position

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  const handleMenuToggle = (index, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    let calculatedX = rect.x + rect.width;
    let calculatedY = rect.y;

    if (calculatedX + 200 > viewportWidth) {
      calculatedX = rect.x - 200; // Position the popup to the left if it overflows
    }

    setPopupPosition({
      x: calculatedX,
      y: calculatedY,
      departmentIndex: index,
    });
  };

  const closePopup = () => {
    setPopupPosition(null);
  };

  const handleEditClick = (department) => {
    navigate('/admin/organization/view-departments', { state: { department } });
    closePopup();
  };

  const handleDeleteClick = (department) => {
    setSelectedDepartment(department);
    setDeleteModal(true); // Show delete confirmation modal
  };

  const confirmDelete = () => {
    if (selectedDepartment) {
      setDepartmentData(departmentData.filter((dept) => dept.id !== selectedDepartment.id)); // Remove department from state
      toast.success(`Department "${selectedDepartment.name}" deleted successfully!`);
      setDeleteModal(false); // Close delete modal
      closePopup();
    } else {
      toast.error('Failed to delete the department. Please try again.');
    }
  };

  const handleCreateDepartment = (e) => {
    e.preventDefault();
    if (departmentName.trim() === '') {
      toast.error('Failed to create department. Please provide a valid name.');
      return;
    }
    const newDepartment = {
      id: departmentData.length + 1,
      name: departmentName,
      designations: 0,
      employees: 0,
    };
    setDepartmentData([...departmentData, newDepartment]); // Add new department to state
    toast.success(`Department "${departmentName}" created successfully!`);
    setShowModal(false); // Close modal
    setDepartmentName(''); // Reset input field
  };

  const handleModalClose = () => {
    setShowModal(false);
    setDepartmentName('');
  };

  const renderPopupMenu = () => {
    if (!popupPosition) return null;

    const department = departmentData[popupPosition.departmentIndex];

    return createPortal(
      <div
        style={{
          position: 'absolute',
          top: popupPosition.y,
          left: popupPosition.x,
          zIndex: 9999,
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          width: '180px',
          padding: '10px',
        }}
      >
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              color: '#4a4a4a',
              borderRadius: '5px',
              transition: 'background-color 0.2s',
            }}
            onClick={() => handleEditClick(department)}
          >
            <span style={{ marginRight: '10px', fontSize: '1rem', color: '#f39c12' }}>📝</span>
            View & Edit
          </li>
          <li
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              color: '#4a4a4a',
              borderRadius: '5px',
              transition: 'background-color 0.2s',
            }}
            onClick={() => handleDeleteClick(department)}
          >
            <span style={{ marginRight: '10px', fontSize: '1rem', color: '#e74c3c' }}>🗑️</span>
            Delete
          </li>
        </ul>
      </div>,
      document.body
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="d-flex" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', overflow: 'hidden' }}>
      <SideMenu />
      <div className="flex-grow-1 d-flex flex-column p-3" style={{ overflowY: 'auto' }}>
        <Header title="Organization" />
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 style={{ marginBottom: '5px' }}>Departments</h4>
              <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                Manage all the department details and department hierarchy in your organization.
              </p>
            </div>
            <Button
              variant="success"
              className="btn-sm"
              style={{
                padding: '10px 20px',
                fontSize: '1.001rem',
                borderRadius: '5px',
              }}
              onClick={() => setShowModal(true)}
            >
              Create Department
            </Button>
          </div>
          <Row className="g-3">
            {departmentData.map((dept, index) => (
              <Col lg={4} md={6} key={dept.id}>
                <Card
                  className="hover-card"
                  style={{
                    padding: '10px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    position: 'relative',
                  }}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <h5 style={{ fontWeight: 'bold', marginBottom: '10px' }}>{dept.name}</h5>
                      <div
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => handleMenuToggle(index, e)}
                      >
                        ⋮
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div>
                        <p style={{ fontSize: '0.85rem', margin: '0', color: '#6c757d' }}>Designations</p>
                        <p style={{ fontWeight: 'bold', margin: '0', color: '#007bff' }}>
                          {dept.designations.toString().padStart(2, '0')}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', margin: '0', color: '#6c757d' }}>Employees</p>
                        <p style={{ fontWeight: 'bold', margin: '0', color: '#007bff' }}>
                          {dept.employees.toString().padStart(2, '0')}
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
      {renderPopupMenu()}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleCreateDepartment}>
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="departmentName"
                style={{ display: 'block', marginBottom: '10px' }}
              >
                Department Name <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                id="departmentName"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder="Enter department name"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
                required
              />
            </div>
            <Button
              type="submit"
              className="btn btn-primary w-100"
              style={{
                padding: '12px',
                fontSize: '1rem',
                borderRadius: '6px',
              }}
            >
              Create
            </Button>
          </form>
        </Modal.Body>
      </Modal>
      <Modal show={deleteModal} onHide={() => setDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedDepartment?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}
