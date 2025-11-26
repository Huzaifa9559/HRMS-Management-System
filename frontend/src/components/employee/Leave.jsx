import React, { useEffect, useState } from 'react';
import Loader from '../Loader';
import SideMenu from './SideMenu'; // Importing SideMenu component
import Header from './Header'; // Importing Header component
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaMedkit, FaMoneyBillAlt, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for styling

var isSubmit = 0;
// Overlay component for viewing details
function ViewDetailsOverlay({ show, onHide, leaveDetails }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Leave Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Leave Type:</strong> {leaveDetails.leave_type}</p>
        <p><strong>Filed on:</strong> {leaveDetails.leave_filedOn}</p>
        <p><strong>Reason:</strong> {leaveDetails.leave_reason}</p>
      </Modal.Body>
    </Modal>
  );
}

function NewLeaveRequestOverlay({ show, onHide }) {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare the leave request data
    const leaveRequestData = { startDate, endDate, leaveType, reason };
    try {
      const token = Cookies.get('token'); // Get the token for authorization
      await axios.post('/api/employees/leave/leave-request', leaveRequestData, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the request headers
        }
      });
      onHide(); // Close the modal after successful submission

      toast.success('Leave request submitted successfully!'); // Show success notification
      isSubmit = 1;
 
    } catch (error) {
      toast.error('Failed to submit leave request. Please try again.'); // Show error notification
    }
    setLeaveType('');
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">New Leave Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Leave Type <span style={{ color: 'red' }}>*</span></Form.Label>
            <Row>
              <Col>
                <div className="position-relative">
                  <Button
                    variant="outline-primary"
                    className="w-100 text-start"
                    style={{
                      borderColor: leaveType === 'Medical' ? '#0d6efd' : '#c1e0ff',
                      color: leaveType === 'Medical' ? '#007bff' : '#007bff',
                      backgroundColor: 'transparent',
                      position: 'relative',
                    }}
                    onClick={() => setLeaveType('Medical')}
                  >
                    <FaMedkit className="me-2" />
                    Medical Leave
                    <small className="d-block text-muted">
                      Take time off for health recovery.
                    </small>
                  </Button>
                  {/* Show green checkmark when selected */}
                  {leaveType === 'Medical' && (
                    <FaCheckCircle
                      style={{
                        color: 'green',
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                      }}
                      size={20}
                    />
                  )}
                </div>
              </Col>
              <Col>
                <div className="position-relative">
                  <Button
                    variant="outline-primary"
                    className="w-100 text-start"
                    style={{
                      borderColor: leaveType === 'Unpaid' ? '#0d6efd' : '#c1e0ff',
                      color: leaveType === 'Unpaid' ? '#007bff' : '#007bff',
                      backgroundColor: 'transparent',
                      position: 'relative',
                    }}
                    onClick={() => setLeaveType('Unpaid')}
                  >
                    <FaMoneyBillAlt className="me-2" />
                    Unpaid Leave
                    <small className="d-block text-muted">
                      Take time off without pay.
                    </small>
                  </Button>
                  {/* Show green checkmark when selected */}
                  {leaveType === 'Unpaid' && (
                    <FaCheckCircle
                      style={{
                        color: 'green',
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                      }}
                      size={20}
                    />
                  )}
                </div>
              </Col>
            </Row>
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Leave Date (start) <span style={{ color: 'red' }}>*</span></Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Leave Date (end) <span style={{ color: 'red' }}>*</span></Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Write reason here ..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Form.Group>
          <div className="text-end">
            <Button variant="success" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default function Leave() {
  const [activeTab, setActiveTab] = useState('Leave Requests');
  const [showNewLeaveRequest, setShowNewLeaveRequest] = useState(false);
  const [showDetailsOverlay, setShowDetailsOverlay] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState({});

  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);
  const [allLeaveData, setAllLeaveData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set the number of items per page

  // All leave data
  // Fetch data from backend
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`/api/employees/leave/leave-details`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Replace YOUR_TOKEN_HERE with the actual token
          }
        });
        setAllLeaveData(response.data.data);
      } catch (error) {
        // Error fetching leave data
        //navigate('/login');
      }
    };

    fetchLeaveData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmit]);

  // Filtered data based on the active tab
  const getFilteredData = () => {
    switch (activeTab) {
      case 'Leave Requests':
        return allLeaveData;
      case 'My Pending':
        return allLeaveData.filter((leave) => leave.leave_status === 0);
      case 'My Approved':
        return allLeaveData.filter((leave) => leave.leave_status === 1);
      case 'My Rejected':
        return allLeaveData.filter((leave) => leave.leave_status === 2);
      default:
        return allLeaveData;
    }
  };

  const renderStatusButton = (leave) => {
    let variant = '';
    let style = {
      borderRadius: '5px',
      padding: '3px 10px',
      minWidth: '80px',
      textAlign: 'center',
      display: 'inline-block',
    };
    var temp;
    switch (leave.leave_status) {
      case 0:
        variant = { backgroundColor: '#e1ecff', color: '#006eff' };
        temp = "Pending";
        break;
      case 2:
        variant = { backgroundColor: '#ffe6e6', color: '#ff4d4d' };
        temp = "Rejected";
        break;
      case 1:
        variant = { backgroundColor: '#d4f8e8', color: '#28a745' };
        temp = "Approved";
        break;
      default:
        variant = { backgroundColor: '#f0f0f0', color: '#000' };
    }

    return (
      <div style={{ ...style, ...variant }}>
        {temp}
      </div>
    );
  };

  if (loading) {
    return <Loader />;
  }
  // Calculate the current leaves to display based on pagination
  const indexOfLastLeave = currentPage * itemsPerPage;
  const indexOfFirstLeave = indexOfLastLeave - itemsPerPage;
  const currentLeaves = getFilteredData().slice(indexOfFirstLeave, indexOfLastLeave);
  // Calculate total pages
  const totalPages = Math.ceil(getFilteredData().length / itemsPerPage);

  // Change page
  const changePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="d-flex" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <SideMenu />
      <div className="flex-grow-1 p-3">
        <Header title="Leave Management" />
        <div className="bg-white p-4 rounded shadow-sm">
          {/* Tabs to switch between different views */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              {['Leave Requests', 'My Pending', 'My Approved', 'My Rejected'].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? 'primary' : 'light'}
                  className="me-2"
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>
            <div>
              <Button variant="success" className="me-2" onClick={() => setShowNewLeaveRequest(true)}>Apply Leave</Button>

            </div>
          </div>

          {/* Table for Leave Data */}
          <Table hover>
            <thead>
              <tr>
                <th>S.No</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentLeaves.map((leave, index) => (
                <tr key={index}>
                  <td>{index + 1 + indexOfFirstLeave}</td>
                  <td>{leave.leave_fromDate}</td>
                  <td>{leave.leave_toDate}</td>
                  <td>{Math.ceil((new Date(leave.leave_toDate) - new Date(leave.leave_fromDate)) / (1000 * 60 * 60 * 24))}</td>
                  <td>{renderStatusButton(leave)}</td>
                  <td>
                    {/* View Details Button with cyan outline */}
                    <Button
                      variant="outline-info"
                      style={{
                        borderColor: '#007bff',
                        color: '#007bff',
                        backgroundColor: 'transparent',
                      }}
                      onClick={() => {
                        setSelectedLeave(leave);
                        setShowDetailsOverlay(true);
                      }}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Compact Pagination Controls */}
          <div className="pagination-container d-flex justify-content-center mt-3">
            <button
              className="pagination-btn"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => changePage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
        <style jsx>{`
        .pagination-container {
          display: flex;
          gap: 5px;
        }

        .pagination-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid #ddd;
          background-color: #f9f9f9;
          color: #007bff;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .pagination-btn:hover {
          background-color: #007bff;
          color: #fff;
        }

        .pagination-btn.active {
          background-color: #007bff;
          color: #fff;
          font-weight: bold;
        }

        .pagination-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
      </div>

      {/* View Details Modal */}
      <ViewDetailsOverlay
        show={showDetailsOverlay}
        onHide={() => setShowDetailsOverlay(false)}
        leaveDetails={selectedLeave}
      />

      {/* Apply Leave Modal */}
      <NewLeaveRequestOverlay
        show={showNewLeaveRequest}
        onHide={() => setShowNewLeaveRequest(false)}
      />
      <ToastContainer />
    </div>
  );
}