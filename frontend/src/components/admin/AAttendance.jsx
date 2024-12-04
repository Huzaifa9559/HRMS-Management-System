import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideMenu from './SideMenu';
import Header from './Header';
import Loader from '../Loader';
import axios from 'axios';

export default function AAttendance() {
  const navigate = useNavigate();
  const [departmentData, setDepartmentData] = useState([]); // State for departments
  const [loading, setLoading] = useState(true); // Loading state
  const [deleteModal, setDeleteModal] = useState(false); // Modal for delete confirmation
  const [selectedDepartment, setSelectedDepartment] = useState(null); // Selected department for deletion
  const [popupPosition, setPopupPosition] = useState(null); // Popup position

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer);
  }, []);
    useEffect(() => {
      const fetch_Department_Attendance = async () => {
        try {
          const response = await axios.get('/api/admin/attendance');
     
          setDepartmentData(response.data);
        } catch (error) {
          console.error('Error', error);
        }
      };
      
      fetch_Department_Attendance();    
          
    }, [selectedDepartment]);
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

  const handleEditClick = (department,departmentId) => {
    navigate('/admin/view-attendance', { state: { department ,departmentId} });
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
            onClick={() => handleEditClick(department,department.id)}
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
        <Header title="Attendance" />
        <Container fluid>
          <div>
              <h4 style={{ marginBottom: '5px' }}>Attendance Report</h4>
              <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                Manage all the department attendance in your organization.
              </p>
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
                        <p style={{ fontSize: '0.85rem', margin: '0', color: '#6c757d' }}>Present</p>
                        <p style={{ fontWeight: 'bold', margin: '0', color: '#007bff' }}>
                          {dept.present.toString().padStart(2, '0')}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', margin: '0', color: '#6c757d' }}>Absent</p>
                        <p style={{ fontWeight: 'bold', margin: '0', color: '#007bff' }}>
                          {dept.absent.toString().padStart(2, '0')}
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
