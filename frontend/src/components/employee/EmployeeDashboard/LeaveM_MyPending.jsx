import React, { useState } from 'react';
import SideMenu from './SideMenu';
import Header from './Header';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';

// Modal for creating a new leave request
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
        <Modal.Title>New Leave Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Leave Type <span style={{ color: 'red' }}>*</span></Form.Label>
            <Form.Control
              as="select"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
            >
              <option value="">Select Leave Type</option>
              <option value="Medical">Medical Leave</option>
              <option value="Unpaid">Unpaid Leave</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Leave Start Date <span style={{ color: 'red' }}>*</span></Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Leave End Date <span style={{ color: 'red' }}>*</span></Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Write the reason for the leave"
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="success" type="submit">
              Submit Request
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

// Main My Pending Component
export default function MyPending() {
  const [pendingData] = useState([
    { type: 'Unpaid', from: '04 Sep 2021', to: '05 Sep 2021', days: '1 day', reason: 'Lorem ipsum is a placeholder text ...' },
    { type: 'Medical', from: '05 Sep 2021', to: '07 Sep 2021', days: '3 days', reason: 'Medical checkup required' },
    { type: 'Unpaid', from: '08 Sep 2021', to: '09 Sep 2021', days: '2 days', reason: 'Family trip' },
  ]);

  const [showNewLeaveRequest, setShowNewLeaveRequest] = useState(false);

  return (
    <div className="d-flex" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <SideMenu />
      <div className="flex-grow-1 p-3">
        <Header title="My Pending Requests" />
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Button
              variant="success"
              className="me-2"
              onClick={() => setShowNewLeaveRequest(true)}
            >
              Apply New Leave
            </Button>
          </div>
          <Table hover>
            <thead>
              <tr>
                <th className="text-center" style={{ width: '15%' }}>Leave Type</th>
                <th className="text-center" style={{ width: '20%' }}>From</th>
                <th className="text-center" style={{ width: '20%' }}>To</th>
                <th className="text-center" style={{ width: '15%' }}>Days</th>
                <th className="text-center" style={{ width: '20%' }}>Reason</th>
                <th className="text-center" style={{ width: '10%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingData.map((request, index) => (
                <tr key={index}>
                  <td className="text-center">{request.type}</td>
                  <td className="text-center">{request.from}</td>
                  <td className="text-center">{request.to}</td>
                  <td className="text-center">{request.days}</td>
                  <td className="text-center">{request.reason}</td>
                  <td className="text-center">
                    <Button
                      variant="outline-info"
                      size="sm"
                    >
                      <FaEllipsisV />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Modal for new leave request */}
      <NewLeaveRequestOverlay
        show={showNewLeaveRequest}
        onHide={() => setShowNewLeaveRequest(false)}
      />
    </div>
  );
}
