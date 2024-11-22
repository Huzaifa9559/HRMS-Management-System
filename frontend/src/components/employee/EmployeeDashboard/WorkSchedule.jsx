import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import SideMenu from './SideMenu';
import Loader from '../../Loader';
import axios from 'axios'; 
import Cookies from 'js-cookie'; 

export default function WorkSchedule() {
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [loading, setLoading] = useState(true); // Loading state
  const [scheduleData, setScheduleData] = useState({ weeks: [] }); // Initialize state for schedule data

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(`/api/employees/work-schedule/${selectedMonth}`, {
          headers: {
            Authorization: `Bearer ${token}` // Add token to headers
          }
        });
        // Transform the data to match the expected format
        //schedule_week: 1, schedule_day: 'Thursday',
        //schedule_startTime: '09:00:00', schedule_endTime:
        //'17:00:00', schedule_worktype: 'remote'

        const transformedData = {
          weeks: response.data.data.map((week) => ({ // Adjusted to map directly over the weeks
            weekNumber: week.week, // Use the week number directly from the new format
            schedule: week.days.reduce((acc, day) => { // Reduce days into a schedule object
              acc[day.day.toLowerCase().slice(0, 3)] = `${convertTo24HourFormat(day.startTime)} - ${convertTo24HourFormat(day.endTime)}`; // Convert day names to short form
              return acc;
            }, {
              mon: 'Free Slot', // Default to 'Free Slot'
              tue: 'Free Slot',
              wed: 'Free Slot',
              thu: 'Free Slot',
              fri: 'Free Slot',
              sat: 'Free Slot'
            })
          }))
        };

        setScheduleData(transformedData); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching schedule data:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchScheduleData(); // Call the fetch function
  }, [selectedMonth]); // Dependency array includes selectedMonth

  // Hardcoded months
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const convertTo24HourFormat = (timeString) => {
    if (!timeString) {
      return 'N/A'; // Return a default message or handle the error as needed
    }
    // Split the time string into hours and minutes
    const [hours, minutes] = timeString.split(':').map(Number);

    // Format the time in "HH:MM" (24-hour format)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <SideMenu />
      <div className="flex-grow-1 d-flex flex-column">
        <div className="my-4 mx-3">
          <Header title="Work Schedule" />
        </div>

        <Container fluid className="py-3">
          {loading ? (
            // Center the loader
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
              <Loader />
            </div>
          ) : (
            <div className="mx-3">
              <Row className="mb-3 align-items-center">
                <Col>
                  <h5 style={{ fontWeight: '500', color: '#4b4b4b' }}>Monthly Timesheet</h5>
                </Col>
                <Col xs="auto" className="d-flex gap-2">
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" id="dropdown-month">
                      {selectedMonth}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {months.map((month) => (
                        <Dropdown.Item
                          key={month}
                          onClick={() => setSelectedMonth(month)} // Set selected month
                        >
                          {month}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>

              <div className="bg-white rounded shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <Table responsive hover className="mb-0" style={{ borderCollapse: 'separate', borderSpacing: '0', borderRadius: '8px' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '16px', borderTopLeftRadius: '8px' }}>Plan</th>
                      <th style={{ padding: '16px' }}>Mon</th>
                      <th style={{ padding: '16px' }}>Tue</th>
                      <th style={{ padding: '16px' }}>Wed</th>
                      <th style={{ padding: '16px' }}>Thu</th>
                      <th style={{ padding: '16px' }}>Fri</th>
                      <th style={{ padding: '16px' }}>Sat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Existing schedule data rendering */}
                    {scheduleData.weeks.map((week) => (
                      <tr key={week.weekNumber}>
                        <td style={{ padding: '20px' }}>Week {week.weekNumber}</td>
                        <td style={{ padding: '20px' }}>{week.schedule.mon}</td>
                        <td style={{ padding: '20px' }}>{week.schedule.tue}</td>
                        <td style={{ padding: '20px' }}>{week.schedule.wed}</td>
                        <td style={{ padding: '20px' }}>{week.schedule.thu}</td>
                        <td style={{ padding: '20px' }}>{week.schedule.fri}</td>
                        <td style={{ padding: '20px' }}>{week.schedule.sat}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
}
