import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CreateScheduleModal = ({ show, onHide, onSave }) => {
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    role: '',
    department: '',
    image: '',
    months: [],
    schedule: [
      { day: "Mon", time: "", location: "" },
      { day: "Tue", time: "", location: "" },
      { day: "Wed", time: "", location: "" },
      { day: "Thu", time: "", location: "" },
      { day: "Fri", time: "", location: "" },
      { day: "Sat", time: "", location: "" },
    ]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule({ ...newSchedule, [name]: value });
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...newSchedule.schedule];
    updatedSchedule[index][field] = value;
    setNewSchedule({ ...newSchedule, schedule: updatedSchedule });
  };

  const handleMonthChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setNewSchedule({ ...newSchedule, months: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSchedule({ ...newSchedule, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newSchedule);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Work Schedule</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Employee Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newSchedule.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control
              type="text"
              name="role"
              value={newSchedule.role}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Control
              as="select"
              name="department"
              value={newSchedule.department}
              onChange={handleInputChange}
              required
            >
              <option value="">Select department</option>
              <option value="Design">Design</option>
              <option value="Development">Development</option>
              <option value="Marketing">Marketing</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Employee Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              required
            />
          </Form.Group>
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
              <option value="All">All Months</option>
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
          {newSchedule.schedule.map((day, index) => (
            <div key={day.day} className="mb-3">
              <h6>{day.day}</h6>
              <Form.Group>
                <Form.Label>Time</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., 9:00 - 18:00"
                  value={day.time}
                  onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  as="select"
                  value={day.location}
                  onChange={(e) => handleScheduleChange(index, 'location', e.target.value)}
                  required
                >
                  <option value="">Select location</option>
                  <option value="Office">Office</option>
                  <option value="Work from home">Work from home</option>
                </Form.Control>
              </Form.Group>
            </div>
          ))}
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