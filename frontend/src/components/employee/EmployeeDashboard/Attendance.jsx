import React, { useState, useEffect, useMemo } from 'react'
import { Table, Button, Pagination, Dropdown, Modal } from 'react-bootstrap'
import SideMenu from './SideMenu'
import Header from './Header'
import Loader from '../../Loader';

// Mock data for the timesheet
const mockTimesheet = [
  {
    date: '04 Sep 2021',
    checkIn: '8:30',
    checkOut: '19:30',
    breakHours: '00:40',
    status: 'present'
  },
  {
    date: '03 Sep 2021',
    checkIn: '8:30',
    checkOut: '19:30',
    breakHours: '00:40',
    status: 'late'
  },
  {
    date: '02 Sep 2021',
    checkIn: '9:00',
    checkOut: '18:00',
    breakHours: '01:00',
    status: 'present'
  },
  {
    date: '01 Sep 2021',
    checkIn: '8:45',
    checkOut: '17:30',
    breakHours: '00:45',
    status: 'present'
  },
  {
    date: '31 Aug 2021',
    checkIn: '8:30',
    checkOut: '19:00',
    breakHours: '01:00',
    status: 'present'
  },
  {
    date: '30 Aug 2021',
    checkIn: '9:00',
    checkOut: '18:00',
    breakHours: '00:30',
    status: 'late'
  },
  {
    date: '29 Aug 2021',
    checkIn: '8:30',
    checkOut: '17:30',
    breakHours: '00:45',
    status: 'present'
  },
  {
    date: '28 Aug 2021',
    checkIn: '9:15',
    checkOut: '17:45',
    breakHours: '00:30',
    status: 'late'
  },
  {
    date: '27 Aug 2021',
    checkIn: '8:30',
    checkOut: '17:30',
    breakHours: '00:30',
    status: 'present'
  },
  {
    date: '26 Aug 2021',
    checkIn: '9:00',
    checkOut: '18:00',
    breakHours: '01:00',
    status: 'late'
  }
]

export default function Component() {
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);
  const [timesheet, setTimesheet] = useState(mockTimesheet)
  const [currentTime, setCurrentTime] = useState('00:00:00')
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [isOnBreak, setIsOnBreak] = useState(false)
  const [checkInTime, setCheckInTime] = useState(null)
  const [breakInTime, setBreakInTime] = useState(null)
  const [totalBreakTime, setTotalBreakTime] = useState(0)

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

  // Filtered timesheet based on selected month, year, and search term
  const filteredTimesheet = useMemo(() => {
    return timesheet.filter(item => {
      const itemDate = new Date(item.date);
      const monthMatches = selectedMonth === 'Month' || itemDate.toLocaleString('default', { month: 'long' }) === selectedMonth;
      const yearMatches = selectedYear === 'Year' || itemDate.getFullYear().toString() === selectedYear;
      return monthMatches && yearMatches;
    });
  }, [timesheet, selectedMonth, selectedYear]);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}:${seconds}`)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Check-in logic
  const handleCheckIn = () => {
    setIsCheckedIn(true)
    setCheckInTime(new Date())
  }

  // Break-in logic
  const handleBreakIn = () => {
    setIsOnBreak(true)
    setBreakInTime(new Date())
  }

  // Break-out logic
  const handleBreakOut = () => {
    setIsOnBreak(false)
    const breakOutTime = new Date()
    const breakDuration = (breakOutTime - breakInTime) / 1000 // duration in seconds
    setTotalBreakTime(totalBreakTime + breakDuration)
  }

  // Check-out logic with confirmation modal
  const handleCheckOut = () => {
    setShowCheckoutModal(true)
  }

  const confirmCheckOut = () => {
    setIsCheckedIn(false)
    setShowCheckoutModal(false)
    const checkOutTime = new Date()

    const newEntry = {
      date: checkOutTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      checkIn: checkInTime ? checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
      checkOut: checkOutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      breakHours: secondsToTime(totalBreakTime),
      status: 'present', // Adjust based on actual status if needed
    }
    // Reset all values
    try {
      // Make API call to save attendance data
      //axios.post('/api/employee/attendance', newEntry)

      // Update timesheet state to display the new entry
      setTimesheet(prevTimesheet => [newEntry, ...prevTimesheet])
    } catch (error) {
      console.error('Error saving attendance:', error)
    }

    // Reset all values
    setCheckInTime(null)
    setBreakInTime(null)
    setTotalBreakTime(0)
  }

  // Convert time in hh:mm format to seconds
  const timeToSeconds = (time) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 3600 + minutes * 60
  }

  // Convert seconds to hh:mm format
  const secondsToTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0')
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
    return `${hrs}:${mins}`
  }

  // Calculate working hours based on check-in, check-out, and break hours
  const calculateWorkingHours = (checkIn, checkOut, breakHours) => {
    const checkInSeconds = timeToSeconds(checkIn)
    const checkOutSeconds = timeToSeconds(checkOut)
    const breakSeconds = timeToSeconds(breakHours)
    const workingSeconds = checkOutSeconds - checkInSeconds - breakSeconds
    return secondsToTime(workingSeconds > 0 ? workingSeconds : 0) // Handle cases where the result might be negative
  }

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredTimesheet.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredTimesheet.length / itemsPerPage)

  // Handle pagination navigation
  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))
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

        {/* Display Total Break Time */}
        {totalBreakTime > 0 && (
          <div className="mt-3 text-center">
            <span>Total Break Time: {secondsToTime(totalBreakTime)}</span>
          </div>
        )}

        {/* Timesheet Heading */}
        <div className="mt-4 mb-2 d-flex justify-content-between align-items-center">
          <h5 style={{ fontWeight: '500', color: '#4b4b4b' }}>Monthly Timesheet</h5>
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
                {filteredTimesheet.slice(indexOfFirstItem, indexOfLastItem).map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e9ecef', height: '50px' }}>
                    <td>{item.date}</td>
                    <td>{item.checkIn}</td>
                    <td>{item.checkOut}</td>
                    <td>{item.breakHours}</td>
                    <td>{calculateWorkingHours(item.checkIn, item.checkOut, item.breakHours)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>


        {/* Pagination Controls */}
        <div className="d-flex justify-content-center mt-3">
          <Pagination style={{ fontSize: '0.875rem', border: '1px solid #ddd', borderRadius: '5px', padding: '0 8px' }}>
            <Pagination.Prev onClick={handlePrevPage} disabled={currentPage === 1} style={{ color: '#333', border: 'none', backgroundColor: 'transparent' }}>
              {"<"}
            </Pagination.Prev>
            <Pagination.Item active style={{ pointerEvents: 'none', color: '#333', backgroundColor: 'transparent', border: 'none' }}>
              {`${currentPage} of ${totalPages}`}
            </Pagination.Item>
            <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} style={{ color: '#333', border: 'none', backgroundColor: 'transparent' }}>
              {">"}
            </Pagination.Next>
          </Pagination>
        </div>




        {/* Check Out Confirmation Modal */}
        <Modal show={showCheckoutModal} onHide={() => setShowCheckoutModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Do you really want to check out?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={confirmCheckOut}>Confirm Check Out</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}
