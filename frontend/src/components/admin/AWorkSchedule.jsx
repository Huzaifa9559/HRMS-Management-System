import React, { useState, useEffect } from 'react';
import Header from './Header';
import SideMenu from './SideMenu';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader';

const WorkSchedule = () => {
  const [scheduleData, setScheduleData] = useState([
    {
        id: 1,
        name: "Allah Ditta",
        role: "UI/UX Designer",
        department: "Design",
        image: 'https://i.pinimg.com/originals/01/f7/29/01f72913cc3ca15094bdb505b4a55dfe.jpg',
        months: "All", // This employee's schedule applies to all months
        schedule: [
          { day: "Mon", time: "9:00 - 18:00", location: "Office" },
          { day: "Tue", time: "9:00 - 18:00", location: "Work from home" },
          { day: "Wed", time: "9:00 - 18:00", location: "Office" },
          { day: "Thu", time: "9:00 - 18:00", location: "Work from home" },
          { day: "Fri", time: "9:00 - 18:00", location: "Office" },
          { day: "Sat", time: "9:00 - 18:00", location: "Work from home" },
        ]
      },
      {
        id: 2,
        name: "Dildar Hussain",
        role: "Frontend Developer",
        department: "Development",
        image: 'https://tse3.mm.bing.net/th?id=OIP.GqlTASML6WlXY-sp0vab7QHaHa&pid=Api&P=0&h=220',
        months: ["June"], // Schedule specific to June
        schedule: [
          { day: "Mon", time: "10:00 - 19:00", location: "Office" },
          { day: "Tue", time: "10:00 - 19:00", location: "Work from home" },
          { day: "Wed", time: "10:00 - 19:00", location: "Office" },
          { day: "Thu", time: "10:00 - 19:00", location: "Work from home" },
          { day: "Fri", time: "10:00 - 19:00", location: "Office" },
          { day: "Sat", time: "10:00 - 19:00", location: "Work from home" },
        ]
      },
      {
        id: 3,
        name: "Ghulam Nabibaksh",
        role: "Backend Developer",
        department: "Development",
        image: 'https://tse2.mm.bing.net/th?id=OIP.2sbd_31J0jrz0QuxmV7W3wHaKt&pid=Api&P=0&h=220',
        months: "All", // Schedule applies to all months
        schedule: [
          { day: "Mon", time: "9:00 - 18:00", location: "Work from home" },
          { day: "Tue", time: "9:00 - 18:00", location: "Office" },
          { day: "Wed", time: "9:00 - 18:00", location: "Office" },
          { day: "Thu", time: "9:00 - 18:00", location: "Work from home" },
          { day: "Fri", time: "9:00 - 18:00", location: "Office" },
          { day: "Sat", time: "9:00 - 18:00", location: "Work from home" },
        ]
      },
      {
        id: 4,
        name: "Alice Chandio",
        role: "Marketing Specialist",
        department: "Marketing",
        image: 'https://tse4.mm.bing.net/th?id=OIP.N_3IEEiprvNN-ZZQCdbZ1gAAAA&pid=Api&P=0&h=220',
        months: ["April", "May"], // Specific to April and May
        schedule: [
          { day: "Mon", time: "8:00 - 17:00", location: "Office" },
          { day: "Tue", time: "8:00 - 17:00", location: "Office" },
          { day: "Wed", time: "8:00 - 17:00", location: "Office" },
          { day: "Thu", time: "8:00 - 17:00", location: "Work from home" },
          { day: "Fri", time: "8:00 - 17:00", location: "Work from home" },
          { day: "Sat", time: "8:00 - 17:00", location: "Work from home" },
        ]
      },
      {
        id: 5,
        name: "Rayyan Stokes",
        role: "Content Creator",
        department: "Marketing",
        image: 'https://image.shutterstock.com/image-photo/average-looking-young-adult-smiles-260nw-51397285.jpg',
        months: ["June", "July"], // Specific to June and July
        schedule: [
          { day: "Mon", time: "9:00 - 18:00", location: "Office" },
          { day: "Tue", time: "9:00 - 18:00", location: "Work from home" },
          { day: "Wed", time: "9:00 - 18:00", location: "Office" },
          { day: "Thu", time: "9:00 - 18:00", location: "Work from home" },
          { day: "Fri", time: "9:00 - 18:00", location: "Office" },
          { day: "Sat", time: "9:00 - 18:00", location: "Work from home" },
        ]
      },
      {
        id: 6,
        name: "Alyssa Rana",
        role: "Project Manager",
        department: "Design",
        image: 'https://tse1.mm.bing.net/th?id=OIP.89SMvpiHE4bD4o3cmriGMwHaEc&pid=Api&P=0&h=220',
        months: "All", // Applies to all months
        schedule: [
          { day: "Mon", time: "10:00 - 19:00", location: "Office" },
          { day: "Tue", time: "10:00 - 19:00", location: "Work from home" },
          { day: "Wed", time: "10:00 - 19:00", location: "Office" },
          { day: "Thu", time: "10:00 - 19:00", location: "Work from home" },
          { day: "Fri", time: "10:00 - 19:00", location: "Office" },
          { day: "Sat", time: "10:00 - 19:00", location: "Work from home" },
        ]
      }
    ]);

  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editedSchedule, setEditedSchedule] = useState(null);
 
    const [loading, setLoading] = useState(true); // Loading state
    useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer);
    }, []);
    

  const departments = ['All Departments', 'Design', 'Development', 'Marketing'];
  const months = [
    'All Months',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const filteredData = scheduleData.filter((employee) => {
    const departmentMatch =
      selectedDepartment === 'All Departments' || employee.department === selectedDepartment;

    const monthMatch =
      selectedMonth === 'All Months' ||
      employee.months === 'All' ||
      (Array.isArray(employee.months) && employee.months.includes(selectedMonth));

    return departmentMatch && monthMatch;
  });

  const handleProfileClick = (employee) => {
    setSelectedEmployee(employee);
    setEditedSchedule({ ...employee }); // Clone employee for editing
    setShowModal(true);
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...editedSchedule.schedule];
    updatedSchedule[index][field] = value;
    setEditedSchedule({ ...editedSchedule, schedule: updatedSchedule });
  };

  const handleMonthChange = (value) => {
    setEditedSchedule({ ...editedSchedule, months: value });
  };

  const handleSave = () => {
    setScheduleData((prevData) =>
      prevData.map((employee) =>
        employee.id === selectedEmployee.id ? editedSchedule : employee
      )
    );
    setShowModal(false);
  
    // Updated Toast
    toast.success('Schedule updated successfully!', {
      position: "top-right", // Use string instead of toast.POSITION.TOP_RIGHT
    });
  };
  if (loading) {
    return <Loader />;
    }

  return (
    <div className="d-flex" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', overflow: 'hidden' }}>
      <SideMenu />
      <div className="flex-grow-1 d-flex flex-column p-3" style={{ overflowY: 'auto' }}>
        <Header title="Work Schedule" />
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Timesheet</h4>
            <div className="d-flex gap-3">
              <select
                className="form-select"
                style={{ width: '200px' }}
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
              <select
                className="form-select"
                style={{ width: '200px' }}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-bordered m-0">
                  <thead>
                    <tr>
                      <th style={{ width: '200px' }}>Plan</th>
                      {days.map((day) => (
                        <th key={day} className="text-center">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((employee) => (
                        <tr
                          key={employee.id}
                          onClick={() => handleProfileClick(employee)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={employee.image}
                                alt={employee.name}
                                className="rounded-circle"
                                width="40"
                                height="40"
                              />
                              <div>
                                <div className="fw-medium">{employee.name}</div>
                                <div className="text-muted small">{employee.role}</div>
                              </div>
                            </div>
                          </td>
                          {employee.schedule.map((day, index) => (
                            <td key={index} className="text-center">
                              <div className="fw-medium">{day.time}</div>
                              <div className="text-muted small">{day.location}</div>
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={days.length + 1} className="text-center">
                          No employees match the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Work Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editedSchedule && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Months</Form.Label>
                <Form.Control
                  as="select"
                  value={editedSchedule.months}
                  onChange={(e) => handleMonthChange(e.target.value)}
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              {editedSchedule.schedule.map((day, index) => (
                <div key={index} className="mb-3">
                  <h6>{day.day}</h6>
                  <Form.Group>
                    <Form.Label>Time</Form.Label>
                    <Form.Control
                      type="text"
                      value={day.time}
                      onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      value={day.location}
                      onChange={(e) => handleScheduleChange(index, 'location', e.target.value)}
                    />
                  </Form.Group>
                </div>
              ))}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default WorkSchedule;
