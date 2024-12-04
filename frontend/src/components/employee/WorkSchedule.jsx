import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import SideMenu from './SideMenu';
import Loader from '../Loader';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function WorkSchedule() {
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [loading, setLoading] = useState(true); // Loading state
  const [scheduleData, setScheduleData] = useState([]); // Initialize state for schedule data

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(`/api/employees/work-schedule/${selectedMonth}`, {
          headers: {
            Authorization: `Bearer ${token}` // Add token to headers
          }
        });

        // Log backend data for debugging
        console.log('Backend Data:', response.data);

        // Process the schedule data
        const transformedData = processScheduleData(response.data.data);

        setScheduleData(transformedData); // Update state with transformed data
      } catch (error) {
        console.error('Error fetching schedule data:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchScheduleData();
  }, [selectedMonth]);

  // Function to process schedule data into a weekly format
  const processScheduleData = (data) => {
    // Initialize a template for each week
    const weekTemplate = {
      mon: 'Free Slot', tue: 'Free Slot', wed: 'Free Slot', thu: 'Free Slot',
      fri: 'Free Slot', sat: 'Free Slot', sun: 'Free Slot'
    };

    const schedule = {
      weeks: []
    };

    // Assign each day's schedule from the backend to the week template
    data.forEach(({ day, startTime, endTime, workType }) => {
      const dayKey = day.toLowerCase().slice(0, 3); // 'mon', 'tue', 'wed', etc.
      const formattedTime = startTime && endTime
        ? `${convertTo24HourFormat(startTime)} - ${convertTo24HourFormat(endTime)}`
        : 'Free Slot';

      // Add the schedule for the specific day to the template
      weekTemplate[dayKey] = formattedTime;
    });

    // Create 4 identical weeks (one for each week in the month)
    for (let i = 0; i < 4; i++) {
      schedule.weeks.push({
        weekNumber: i + 1,
        schedule: { ...weekTemplate } // Spread operator to ensure all weeks have the same schedule
      });
    }

    return schedule.weeks;
  };

  const convertTo24HourFormat = (timeString) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':').map(Number);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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
                        onClick={() => setSelectedMonth(month)}
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
                    <th style={{ padding: '16px', borderTopRightRadius: '8px' }}>Sun</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((week, index) => (
                    <tr key={`week-${index + 1}`}>
                      <td style={{ padding: '20px' }}>Week {week.weekNumber}</td>
                      <td style={{ padding: '20px' }}>{week.schedule.mon}</td>
                      <td style={{ padding: '20px' }}>{week.schedule.tue}</td>
                      <td style={{ padding: '20px' }}>{week.schedule.wed}</td>
                      <td style={{ padding: '20px' }}>{week.schedule.thu}</td>
                      <td style={{ padding: '20px' }}>{week.schedule.fri}</td>
                      <td style={{ padding: '20px' }}>{week.schedule.sat}</td>
                      <td style={{ padding: '20px' }}>{week.schedule.sun}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
