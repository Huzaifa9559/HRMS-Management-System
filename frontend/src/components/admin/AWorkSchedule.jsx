import React, { useState, useEffect } from 'react';
import Header from './Header';
import SideMenu from './SideMenu';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader';
import { PlusCircle } from 'react-bootstrap-icons';
import CreateScheduleModal from './CreateScheduleModal';

const backendURL = process.env.REACT_APP_BACKEND_URL;

const WorkSchedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editedSchedule, setEditedSchedule] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`/api/admin/department`);
        setDepartments(response.data.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast.error('Error fetching departments.');
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const response = await axios.get(`/api/admin/work-schedule/${selectedMonth}`);
        setScheduleData(response.data.data);
      } catch (error) {
        console.error('Error fetching schedule data:', error);
        toast.error('Error fetching schedule data.');
      }
    };

    fetchScheduleData();
  }, [selectedMonth]);

  const months = [
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

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const filteredData = scheduleData.filter((employee) => {
    const departmentMatch =
      selectedDepartment === 'All Departments' || employee.department_name === selectedDepartment;
    return departmentMatch;
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

  const handleSave = async () => {
    try {
      // Update the schedule on the backend
      await axios.put(`/api/admin/work-schedule/${selectedEmployee.id}/${selectedMonth}`, editedSchedule);

      // Update the local state
      setScheduleData((prevData) =>
        prevData.map((employee) =>
          employee.id === selectedEmployee.id ? editedSchedule : employee
        )
      );

      setShowModal(false);
      toast.success('Schedule updated successfully!', {
        position: 'top-right',
      });
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('Failed to save changes.');
    }
  };

  const handleCreateNewSchedule = (newSchedule) => {
    // Update state with the newly created schedule
    setScheduleData((prevData) => [...prevData, { id: prevData.length + 1, ...newSchedule }]);
    setShowCreateModal(false);
    toast.success('New work schedule created successfully!', {
      position: 'top-right',
    });
  };

  const formatTimeTo12Hour = (time) => {
    const [startTime, endTime] = time.split(' - ');

    const format12Hour = (timeString) => {
      const [hours, minutes, seconds] = timeString.split(':');
      const date = new Date(0, 0, 0, hours, minutes, seconds);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return `${format12Hour(startTime)} - ${format12Hour(endTime)}`;
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
                  <option key={department.department_name} value={department.department_name}>
                    {department.department_name}
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
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                <PlusCircle className="me-2" />
                Create New WorkSchedule
              </Button>
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
                                src={employee.image ? `${backendURL}/uploads/employees/${employee.image}` : null}
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
                          {days.map((day) => {
                            const daySchedule = employee.schedule.find((s) => s.day === day);
                            return (
                              <td key={day} className="text-center">
                                {daySchedule ? (
                                  <>
                                    <div className="fw-medium" style={{ fontSize: '0.8rem' }}>
                                      {formatTimeTo12Hour(daySchedule.time)}
                                    </div>
                                    <div className="text-muted small">{daySchedule.location}</div>
                                  </>
                                ) : (
                                  <div className="text-muted small">No Schedule</div>
                                )}
                              </td>
                            );
                          })}
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

      {/* Edit Work Schedule Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Work Schedule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editedSchedule && (
            <>
              <h5>Editing {editedSchedule.name}'s schedule</h5>
              <table className="table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Time</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {editedSchedule.schedule.map((s, index) => (
                    <tr key={index}>
                      <td>{s.day}</td>
                      <td>
                        <Form.Control
                          type="text"
                          value={s.time}
                          onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={s.location}
                          onChange={(e) => handleScheduleChange(index, 'location', e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      {/* Create Schedule Modal */}
      <CreateScheduleModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSave={handleCreateNewSchedule}
      />

      <ToastContainer />
    </div>
  );
};

export default WorkSchedule;
