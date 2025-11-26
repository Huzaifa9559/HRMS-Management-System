import React, { useState } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateScheduleModal = ({ show, onHide, onSave }) => {
  const [newSchedule, setNewSchedule] = useState({
    employeeId: '',
    months: [],
    schedule: [],
  });

  // Handle input change for fields like employeeId
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle month selection
  const handleMonthChange = (e) => {
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    setNewSchedule((prevState) => ({
      ...prevState,
      months: value,
    }));
  };

  // Handle adding a new schedule entry (day, time, location)
  const handleAddSchedule = () => {
    setNewSchedule((prevState) => ({
      ...prevState,
      schedule: [...prevState.schedule, { day: '', time: '', location: '' }],
    }));
  };

  // Handle removing a schedule entry
  const handleRemoveSchedule = (index) => {
    const updatedSchedule = [...newSchedule.schedule];
    updatedSchedule.splice(index, 1);
    setNewSchedule((prevState) => ({
      ...prevState,
      schedule: updatedSchedule,
    }));
  };

  // Handle schedule change for each day
  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...newSchedule.schedule];
    updatedSchedule[index][field] = value;
    setNewSchedule((prevState) => ({
      ...prevState,
      schedule: updatedSchedule,
    }));
  };

  // Handle form submission
 const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate input
  if (!newSchedule.employeeId || newSchedule.months.length === 0 || newSchedule.schedule.length === 0) {
    toast.error('Please fill in all required fields.');
    return;
  }

  // Format the time to the standard format (e.g., "HH:mm") before sending
  const formattedSchedule = newSchedule.schedule.map((day) => {
    const { time } = day;
    
    if (time) {
      // Normalize the time input (remove any spaces around the hyphen)
      const normalizedTime = time.replace(/\s*-\s*/, '-'); // Replaces spaces around the hyphen
      
      const [startTime, endTime] = normalizedTime.split('-'); // Split based on the hyphen

      // Function to ensure proper time format (HH:mm)
      const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      };

      return {
        ...day,
        time: `${formatTime(startTime)} - ${formatTime(endTime)}`,
      };
    }

    return day;
  });

  // Update the schedule with formatted times
  const updatedSchedule = { ...newSchedule, schedule: formattedSchedule };

  try {
    await axios.post('/api/admin/work-schedule', updatedSchedule);
    onSave(updatedSchedule); // Pass data back to parent component if needed
    onHide(); // Close the modal
  } catch {
    toast.error("Schedule already exists or error creating new work schedule");
  }
};



  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Work Schedule</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Employee Information */}
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formEmployeeId">
              <Form.Label>Employee ID</Form.Label>
              <Form.Control
                type="text"
                name="employeeId"
                value={newSchedule.employeeId}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Row>

          {/* Month Selection */}
          <Form.Group className="mb-3">
            <Form.Label>Applicable Months</Form.Label>
            <Form.Control
              as="select"
              multiple
              name="months"
              value={newSchedule.months}
              onChange={handleMonthChange}
              required
            >
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </Form.Control>
            <Form.Text className="text-muted">
              Hold Ctrl (Windows) or Command (Mac) to select multiple months
            </Form.Text>
          </Form.Group>

          {/* Schedule Inputs */}
          {newSchedule.schedule.map((entry, index) => (
            <div key={index} className="mb-3">
              <Row>
                <Form.Group as={Col} controlId={`formDay${index}`} className="mb-3">
                  <Form.Label>Day</Form.Label>
                  <Form.Control
                    as="select"
                    value={entry.day}
                    onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                    required
                  >
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col} controlId={`formScheduleTime${index}`} className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., 9:00 - 18:00"
                    value={entry.time}
                    onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col} controlId={`formScheduleLocation${index}`} className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    as="select"
                    value={entry.location}
                    onChange={(e) => handleScheduleChange(index, 'location', e.target.value)}
                    required
                  >
                    <option value="">Select location</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Remote">Remote</option>
                  </Form.Control>
                </Form.Group>

                <Col className="d-flex align-items-end">
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveSchedule(index)}
                    disabled={newSchedule.schedule.length === 1}
                  >
                    Remove Day
                  </Button>
                </Col>
              </Row>
            </div>
          ))}

          <Button variant="secondary" onClick={handleAddSchedule}>
            Add Another Day
          </Button>

          <div className="mt-4">
            <Button variant="primary" type="submit">
              Create Schedule
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateScheduleModal;
