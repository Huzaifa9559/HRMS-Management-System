import React, { useEffect, useState } from 'react';
import SideMenu from './SideMenu';  // Importing SideMenu component
import Header from './Header';      // Importing Header component
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaMedkit, FaMoneyBillAlt, FaCheckCircle } from 'react-icons/fa';
import Loader from '../../Loader';

// Overlay component for viewing details
function ViewDetailsOverlay({ show, onHide, leaveDetails }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Leave Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Leave Type:</strong> {leaveDetails.type}</p>
        <p><strong>Filed on:</strong> {leaveDetails.fileDate}</p>
        <p><strong>Reason:</strong> {leaveDetails.reason}</p>
      </Modal.Body>
    </Modal>
  );
}

function NewLeaveRequestOverlay({ show, onHide }) {
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log({ leaveType, startDate, endDate, reason });
      onHide();
    };
    
    return (
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">New Leave Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Leave Type <span style={{color:'red'}}>*</span></Form.Label>
              <Row>
                <Col>
                  <div className="position-relative">
                    <Button
                      variant="outline-primary"
                      className="w-100 text-start"
                      style={{
                        borderColor: leaveType === 'Medical Leave' ? '#0d6efd' : '#c1e0ff',
                        color: leaveType === 'Medical Leave' ? '#007bff' : '#007bff',
                        backgroundColor: 'transparent',
                        position: 'relative',
                      }}
                      onClick={() => setLeaveType('Medical Leave')}
                    >
                      <FaMedkit className="me-2" />
                      Medical Leave
                      <small className="d-block text-muted">
                        Take time off for health recovery.
                      </small>
                    </Button>
                    {/* Show green checkmark when selected */}
                    {leaveType === 'Medical Leave' && (
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
                        borderColor: leaveType === 'Unpaid Leave' ? '#0d6efd' : '#c1e0ff',
                        color: leaveType === 'Unpaid Leave' ? '#007bff' : '#007bff',
                        backgroundColor: 'transparent',
                        position: 'relative',
                      }}
                      onClick={() => setLeaveType('Unpaid Leave')}
                    >
                      <FaMoneyBillAlt className="me-2" />
                      Unpaid Leave
                      <small className="d-block text-muted">
                        Take time off without pay.
                      </small>
                    </Button>
                    {/* Show green checkmark when selected */}
                    {leaveType === 'Unpaid Leave' && (
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
                  <Form.Label>Leave Date (start) <span style={{color:'red'}}>*</span></Form.Label>
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
                  <Form.Label>Leave Date (end) <span style={{color:'red'}}>*</span></Form.Label>
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

export default function LeaveManagementD() {
  const [activeTab, setActiveTab] = useState('Leave Requests');
  const [showNewLeaveRequest, setShowNewLeaveRequest] = useState(false);
  const [showDetailsOverlay, setShowDetailsOverlay] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState({});
  
  const [loading, setLoading] = useState(true); // Loading state
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);
  // All leave data
  const allLeaveData = [
    { from: '04 Sep 2021', to: '05 Sep 2021', days: '1 day', status: 'Pending', type: 'Medical Leave', reason: 'Health issues', fileDate: '03 Sep 2021' },
    { from: '05 Sep 2021', to: '08 Sep 2021', days: '3 days', status: 'Rejected', type: 'Unpaid Leave', reason: 'Family Emergency', fileDate: '04 Sep 2021' },
    { from: '04 Sep 2021', to: '05 Sep 2021', days: '1 day', status: 'Approved', type: 'Unpaid Leave', reason: 'Personal Work', fileDate: '03 Sep 2021' },
  ];

  // Filtered data based on the active tab
  const getFilteredData = () => {
    switch (activeTab) {
      case 'Leave Requests':
        return allLeaveData;
      case 'My Pending':
        return allLeaveData.filter((leave) => leave.status === 'Pending');
      case 'My Approved':
        return allLeaveData.filter((leave) => leave.status === 'Approved');
      case 'My Rejected':
        return allLeaveData.filter((leave) => leave.status === 'Rejected');
      default:
        return allLeaveData;
    }
  };

  const renderStatusButton = (status) => {
    let variant = '';
    let style = {
      borderRadius: '5px',
      padding: '3px 10px',
      minWidth: '80px',
      textAlign: 'center',
      display: 'inline-block',
    };

    switch (status.toLowerCase()) {
      case 'pending':
        variant = { backgroundColor: '#e1ecff', color: '#006eff' };
        break;
      case 'rejected':
        variant = { backgroundColor: '#ffe6e6', color: '#ff4d4d' };
        break;
      case 'approved':
        variant = { backgroundColor: '#d4f8e8', color: '#28a745' };
        break;
      default:
        variant = { backgroundColor: '#f0f0f0', color: '#000' };
    }

    return (
      <div style={{ ...style, ...variant }}>
        {status}
      </div>
    );
  };

  if (loading) {
    return <Loader />;
  } 

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
              <Button variant="outline-secondary">Export</Button>
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
              {getFilteredData().map((leave, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{leave.from}</td>
                  <td>{leave.to}</td>
                  <td>{leave.days}</td>
                  <td>{renderStatusButton(leave.status)}</td>
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
        </div>
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
    </div>
  );
}
