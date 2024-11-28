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

        const transformedData = {
          weeks: response.data.data.map((week) => ({
            weekNumber: week.week,
            schedule: week.days.reduce((acc, day) => {
              acc[day.day.toLowerCase().slice(0, 3)] = `${convertTo24HourFormat(day.startTime)} - ${convertTo24HourFormat(day.endTime)}`;
              return acc;
            }, {
              mon: 'Free Slot',
              tue: 'Free Slot',
              wed: 'Free Slot',
              thu: 'Free Slot',
              fri: 'Free Slot',
              sat: 'Free Slot',
              sun: 'Free Slot'
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

    fetchScheduleData();
  }, [selectedMonth]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const convertTo24HourFormat = (timeString) => {
    if (!timeString) {
      return 'N/A';
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

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
                    {Array.from({ length: 4 }, (_, index) => (
                      <tr key={`week-${index + 1}`}>
                        <td style={{ padding: '20px' }}>Week {index + 1}</td>
                        <td style={{ padding: '20px' }}>{scheduleData.weeks[0]?.schedule.mon || 'Free Slot'}</td>
                        <td style={{ padding: '20px' }}>{scheduleData.weeks[0]?.schedule.tue || 'Free Slot'}</td>
                        <td style={{ padding: '20px' }}>{scheduleData.weeks[0]?.schedule.wed || 'Free Slot'}</td>
                        <td style={{ padding: '20px' }}>{scheduleData.weeks[0]?.schedule.thu || 'Free Slot'}</td>
                        <td style={{ padding: '20px' }}>{scheduleData.weeks[0]?.schedule.fri || 'Free Slot'}</td>
                        <td style={{ padding: '20px' }}>{scheduleData.weeks[0]?.schedule.sat || 'Free Slot'}</td>
                        <td style={{ padding: '20px' }}>{scheduleData.weeks[0]?.schedule.sun || 'Free Slot'}</td>
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
