import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import SideMenu from './SideMenu';
import Loader from '../../Loader';

export default function WorkSchedule() {
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [loading, setLoading] = useState(true); // Loading state
  const [scheduleData, setScheduleData] = useState({ months: [], weeks: [] }); // Initialize state for schedule data
  
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const response = await fetch('/api/work-schedule'); // Replace with your actual API endpoint
        const data = await response.json();
        
        // Transform the data to match the expected format
        const transformedData = {
          months: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ],
          weeks: data.map(week => ({
            weekNumber: week.scheduleID, // Assuming scheduleID corresponds to week number
            schedule: {
              mon: `${week.schedule_startTime} - ${week.schedule_endTime}`, // Adjust as necessary
              tue: `${week.schedule_startTime} - ${week.schedule_endTime}`,
              wed: `${week.schedule_startTime} - ${week.schedule_endTime}`,
              thu: `${week.schedule_startTime} - ${week.schedule_endTime}`,
              fri: `${week.schedule_startTime} - ${week.schedule_endTime}`,
              sat: `${week.schedule_startTime} - ${week.schedule_endTime}`
            }
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
  }, []);

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
                      {scheduleData.months.map((month) => (
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
                      <th style={{ padding: '16px', borderTopRightRadius: '8px' }}>Sat</th>
                    </tr>
                  </thead>
                  <tbody>
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
