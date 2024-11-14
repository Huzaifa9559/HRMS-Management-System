import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import SideMenu from './SideMenu';
import Loader from '../../Loader';

export default function WorkSchedule() {
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [loading, setLoading] = useState(true); // Loading state
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);


  // Data for all 12 months
  const scheduleData = {
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    weeks: [
      {
        weekNumber: 1,
        schedule: {
          mon: '9:00 - 18:00',
          tue: '9:00 - 18:00',
          wed: '9:00 - 18:00',
          thu: '9:00 - 20:00',
          fri: '9:00 - 18:00',
          sat: '9:00 - 18:00'
        }
      },
      {
        weekNumber: 2,
        schedule: {
          mon: '9:00 - 18:00',
          tue: '9:00 - 18:00',
          wed: '9:00 - 18:00',
          thu: '9:00 - 20:00',
          fri: '9:00 - 18:00',
          sat: '9:00 - 18:00'
        }
      },
      {
        weekNumber: 3,
        schedule: {
          mon: '9:00 - 18:00',
          tue: '9:00 - 18:00',
          wed: '9:00 - 18:00',
          thu: '9:00 - 20:00',
          fri: '9:00 - 18:00',
          sat: '9:00 - 18:00'
        }
      },
      {
        weekNumber: 4,
        schedule: {
          mon: '9:00 - 18:00',
          tue: '9:00 - 18:00',
          wed: '9:00 - 18:00',
          thu: '9:00 - 20:00',
          fri: '9:00 - 18:00',
          sat: '9:00 - 18:00'
        }
      }
    ]
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
            // Center the loader
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
              <Loader />
            </div>
          ) : (
            <div className="mx-3">
              <Row className="mb-3 align-items-center">
                <Col>
                  <h2 className="h5 mb-0">Timesheet</h2>
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
