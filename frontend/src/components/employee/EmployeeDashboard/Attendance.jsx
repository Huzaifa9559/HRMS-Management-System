import React, { useState, useEffect, useMemo } from 'react'
import { Table, Button, Dropdown, Modal } from 'react-bootstrap'
import SideMenu from './SideMenu'
import Header from './Header'
import Loader from '../../Loader';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'

export default function Attendance() {
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  // Update clockS
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}:${seconds}`)
    }, 1000)

    return () => clearInterval(timer)
  }, []);

  const [timesheet, setTimesheet] = useState([])
  const [currentTime, setCurrentTime] = useState('00:00:00')
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [isOnBreak, setIsOnBreak] = useState(false);

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  const [selectedYear, setSelectedYear] = useState('Year')
  const [selectedMonth, setSelectedMonth] = useState('Month')
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)

  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString())
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Fetch previous attendance data on first render
  useEffect(() => {
    const fetchPreviousData = async () => {
      try {
        const token = Cookies.get('token'); // Get the token for authorization
        const response = await axios.get('/api/employees/attendance/all', {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the request headers
          }
        });
        setTimesheet(response.data.data); // Set the fetched data to timesheet state

        const storedCheckInStatus = localStorage.getItem('isCheckedIn');
        const storedBreakStatus = localStorage.getItem('isOnBreak');

        if (storedCheckInStatus === 'true') {
          setIsCheckedIn(true);
        }
        if (storedBreakStatus === 'true') {
          setIsOnBreak(true);
        }
      } catch (error) {
        console.error('Error fetching previous data:', error);
      }
    };

    fetchPreviousData();

  }, [isCheckedIn, isOnBreak]);


  // Filtered timesheet based on selected month, year, and search term
  const filteredTimesheet = useMemo(() => {
    return timesheet.filter(item => {
      const itemDate = new Date(item.attendance_date);
      const monthMatches = selectedMonth === 'Month' || itemDate.toLocaleString('default', { month: 'long' }) === selectedMonth;
      const yearMatches = selectedYear === 'Year' || itemDate.getFullYear().toString() === selectedYear;
      return monthMatches && yearMatches;
    });
  }, [timesheet, selectedMonth, selectedYear]);


  // Check-in logic
  const handleCheckIn = async () => {
    try {
      const storedCheckInStatus = localStorage.getItem('isCheckedIn');
      if (storedCheckInStatus === 'true') {
        toast.error('You have already checked in today.'); // Show error notification
        return;
      }
      const token = Cookies.get('token'); // Get the token for authorization
      const date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const response = await axios.get(`/api/employees/attendance?date=${date}`, { // Pass date as a query parameter
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the request headers
        }
      });
      //Check if an entry exists for today
      if (response.data.message === "Attendance record retrieved successfully") {
        toast.error('You have already checked in today.'); // Show error notification
        return; // Exit the function if already checked in
      }
      //else store check in
      setIsCheckedIn(true);
      localStorage.setItem('isCheckedIn', 'true'); // Store check-in status
      await axios.post('/api/employees/attendance/clockin', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      toast.success(`Check-in successful!`); // Show success notification
    } catch (error) {
      toast.error('Failed to check in. Please try again.'); // Show error notification
      console.error('Error checking in:', error);
    }
  }

  // Break-in logic
  const handleBreakIn = async () => {
    setIsOnBreak(true)
    localStorage.setItem('isOnBreak', 'true');
    // API call to store break-in time in the database
    try {
      const token = Cookies.get('token'); // Get the token for authorization
      const action = "breakIn";
      const date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      // Store break-in time in DB
      await axios.post('/api/employees/attendance/breakin', { date, action }, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the request headers
        }
      });

      toast.success(`Break-in!`);
    } catch (error) {
      toast.error('Failed to record break-in time. Please try again.'); // Show error notification
      console.error('Error recording break-in time:', error);
    }
  }

  // Break-out logic
  const handleBreakOut = async () => {
    setIsOnBreak(false)
    localStorage.setItem('isOnBreak', 'false');
    try {
      const token = Cookies.get('token');
      const action = "breakOut";
      const date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      await axios.post('/api/employees/attendance/breakout', { date, action }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      toast.success(`Break-Out!`);
    } catch (error) {
      toast.error('Failed to record break-out time. Please try again.');
      console.error('Error recording break-out time:', error);
    }
  }

  // Check-out logic with confirmation modal
  const handleCheckOut = () => {
    setShowCheckoutModal(true)
  }

  const confirmCheckOut = async () => {
    setIsCheckedIn(false);
    localStorage.setItem('isCheckedIn', 'false');
    setShowCheckoutModal(false);

    try {
      const token = Cookies.get('token');
      const action = "clockOut";
      const date = new Date().toISOString().split('T')[0];
      await axios.post('/api/employees/attendance/clockout', { date, action }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      toast.success(`Check-out successful!`);
    } catch (error) {
      toast.error('Failed to check out. Please try again.');
      console.error('Error checking out:', error);
    }
  }

  // Convert seconds to hh:mm format and return an object
  const secondsToTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return { hours: hrs, minutes: mins }; // Return as an object
  }

  const convertTo12HourFormat = (timeString) => {
    if (!timeString) {
      return 'N/A'; // Return a default message or handle the error as needed
    }
    // Split the time string into hours, minutes, and seconds
    const [hours, minutes] = timeString.split(':').map(Number);

    // Determine AM or PM suffix
    const suffix = hours >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour to 12-hour format
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight

    // Format the time in "HH:MM AM/PM"
    return `${formattedHours}:${String(minutes).padStart(2, '0')} ${suffix}`;
  }

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredTimesheet.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredTimesheet.length / itemsPerPage)

  // Handle pagination navigation
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Show loader if loading is true
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="d-flex" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <SideMenu />
      <div className="flex-grow-1" style={{ padding: '20px' }}>
        <Header title="Attendance" />

        {/* Timer and Check-in Section */}
        <div className="py-2 px-4 d-flex align-items-center justify-content-between" style={{ backgroundColor: '#ffffff', borderRadius: '8px', position: 'relative' }}>
          <Button
            variant={isCheckedIn ? "danger" : "success"}
            onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
            className="px-4 py-2"
            style={{ fontSize: '1rem', borderRadius: '10px' }}
          >
            {isCheckedIn ? 'Check Out' : 'Check In'}
          </Button>

          {/* Centered Timer */}
          <div className="d-flex flex-column align-items-center">
            <div className="border rounded p-3" style={{ width: '200px', textAlign: 'center', borderStyle: 'dashed' }}>
              <h2 className="display-5 mb-0">{currentTime}</h2>
              <div className="text-muted">
                <small>Hr's</small>
                <small className="mx-4">Min</small>
                <small>Sec</small>
              </div>
            </div>

            {/* Break Button Positioned Below the Timer */}
            {isCheckedIn && (
              <Button
                variant={isOnBreak ? "outline-primary" : "outline-primary"}
                onClick={isOnBreak ? handleBreakOut : handleBreakIn}
                size="sm"
                className="mt-2"
              >
                {isOnBreak ? 'Break Out' : 'Break In'}
              </Button>
            )}
          </div>

          {/* Current Date in the Right Corner */}
          <div className="bg-secondary text-white d-flex flex-column align-items-center justify-content-center rounded" style={{
            width: '80px',
            height: '80px',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            <div>{new Date().getDate()}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>{new Date().toLocaleString('en-GB', { month: 'long' })}</div>
          </div>
        </div>

        {/* Display Total Break Time 
        {totalBreakTime > 0 && (
          <div className="mt-3 text-center">
            <span>Total Break Time: {`${secondsToTime(totalBreakTime).hours}h ${secondsToTime(totalBreakTime).minutes}m`}</span>
          </div>
        )}*/}

        {/* Timesheet Heading */}
        <div className="mt-4 mb-2 d-flex justify-content-between align-items-center">
          <h5 style={{ fontWeight: '500', color: '#4b4b4b' }}>Monthly Attendance</h5>
          <div className="d-flex gap-2">
            <Dropdown onSelect={(eventKey) => setSelectedMonth(eventKey)}>
              <Dropdown.Toggle variant="outline-secondary" size="sm">{selectedMonth}</Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {months.map((month, index) => (
                  <Dropdown.Item key={index} eventKey={month}>{month}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown onSelect={(eventKey) => setSelectedYear(eventKey)}>
              <Dropdown.Toggle variant="outline-secondary" size="sm">{selectedYear}</Dropdown.Toggle>
              <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {years.map((year, index) => (
                  <Dropdown.Item key={index} eventKey={year}>{year}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Timesheet Table */}
        <div className="card shadow-sm">
          <div className="card-body">
            <Table hover responsive className="table-borderless">
              <thead>
                <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                  <th style={{ fontWeight: 'bold', color: 'black' }}>Date</th>
                  <th style={{ fontWeight: 'bold', color: 'black' }}>Check In</th>
                  <th style={{ fontWeight: 'bold', color: 'black' }}>Check Out</th>
                  <th style={{ fontWeight: 'bold', color: 'black' }}>Break Hours</th>
                  <th style={{ fontWeight: 'bold', color: 'black' }}>Working Hours</th>
                </tr>
              </thead>
              <tbody>
                {filteredTimesheet.slice(indexOfFirstItem, indexOfLastItem).map((item, index) => {
                  const breakTime = secondsToTime(item.attendance_totalBreak);
                  const workingTime = secondsToTime(item.attendance_workingHours);
                  return (
                    <tr key={index} style={{ borderBottom: '1px solid #e9ecef', height: '50px' }}>
                      <td>{new Date(item.attendance_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>{convertTo12HourFormat(item.attendance_clockIn)}</td>
                      <td>{convertTo12HourFormat(item.attendance_clockOut)}</td>
                      <td>{`${breakTime.hours}h ${breakTime.minutes}m`}</td> {/* Display break hours */}
                      <td>{`${workingTime.hours}h ${workingTime.minutes}m`}</td> {/* Display working hours */}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>

        {/* Custom Pagination Controls */}
        <div className="custom-pagination d-flex justify-content-center mt-3 mb-3">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>

        {/* Check Out Confirmation Modal */}
        <Modal show={showCheckoutModal} onHide={() => setShowCheckoutModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Confirm Check Out?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={confirmCheckOut}>Continue</Button>
          </Modal.Footer>
        </Modal>
      </div>
      <ToastContainer />
    </div>
  )
}
