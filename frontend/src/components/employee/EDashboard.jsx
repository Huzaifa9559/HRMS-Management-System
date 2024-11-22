import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Box, Briefcase, Clock, Clipboard, Calendar as CalendarIcon } from 'lucide-react';
import SideMenu from './SideMenu';
import Header from './Header';
import Loader from '../Loader';

const localizer = momentLocalizer(moment);

const CustomCalendar = ({ localizer, events, style }) => (
  <div className="custom-calendar">
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={style}
      views={['month']}
      toolbar={true}
    />
  </div>
);

export default function Dashboard() {
  const [showCurrentYearLeave, setShowCurrentYearLeave] = useState(false);
  const [showCurrentMonthLeave, setShowCurrentMonthLeave] = useState(false);
  const [showYesterdayWorkingHours, setShowYesterdayWorkingHours] = useState(false);
  const [showTimesheet, setShowTimesheet] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const [loading, setLoading] = useState(true); // Loading state
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  const events = [
    {
      title: 'Event',
      start: new Date(2021, 8, 12),
      end: new Date(2021, 8, 12),
    },
  ];

  // Show loader if loading is true
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="d-flex" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', overflow: 'hidden' }}>
      <SideMenu />
      <div className="flex-grow-1 d-flex flex-column p-3" style={{ overflowY: 'auto' }}>
        <Header title="Dashboard" />
        <Container fluid>
          <Row className="mb-2">
            <Col md={4}>
              <Card
                className="hover-card"
                onClick={() => setShowCurrentYearLeave(!showCurrentYearLeave)}
                style={{ cursor: 'pointer', height: '90px' }}
              >
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title style={{ fontWeight: 'normal' }}>Current Year Leaves</Card.Title>
                    {showCurrentYearLeave && <Card.Text className="h5">30 Days</Card.Text>}
                  </div>
                  <Box size={28} color="#4CAF50" />
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="hover-card"
                onClick={() => setShowCurrentMonthLeave(!showCurrentMonthLeave)}
                style={{ cursor: 'pointer', height: '90px' }}
              >
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title style={{ fontWeight: 'normal' }}>Current Month Leaves</Card.Title>
                    {showCurrentMonthLeave && <Card.Text className="h5">04 Days</Card.Text>}
                  </div>
                  <Briefcase size={28} color="#9C27B0" />
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="hover-card"
                onClick={() => setShowYesterdayWorkingHours(!showYesterdayWorkingHours)}
                style={{ cursor: 'pointer', height: '90px' }}
              >
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title style={{ fontWeight: 'normal' }}>Yesterday's Working Hours</Card.Title>
                    {showYesterdayWorkingHours && <Card.Text className="h5">08 h 30 min</Card.Text>}
                  </div>
                  <Clock size={28} color="#FF5722" />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col>
              <Card className="hover-card" style={{ backgroundColor: '#ffffff', width: '100%' }}>
                <Card.Header 
                  onClick={() => setShowCalendar(!showCalendar)} 
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#ffffff',
                    width: '100%',
                    fontSize: '1.25rem', // Increased font size
                    padding: '10px 15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>Calendar</span>
                  <CalendarIcon size={24} color="#00B0FF" />
                </Card.Header>
                {showCalendar && (
                  <Card.Body>
                    <CustomCalendar 
                      localizer={localizer} 
                      events={events} 
                      style={{ height: 200 }}
                    />
                  </Card.Body>
                )}
              </Card>
            </Col>
          </Row>
          {/* Updated Timesheet Section with Increased Font Size */}
          <Row>
            <Col>
              <Card className="hover-card" onClick={() => setShowTimesheet(!showTimesheet)} style={{ cursor: 'pointer' }}>
                <Card.Body className="d-flex justify-content-between align-items-center" style={{ fontSize: '1.25rem' }}> {/* Increased font size */}
                  <Card.Title style={{ fontWeight: 'normal' }}>Timesheet</Card.Title>
                  <Clipboard size={24} color="#FF9800" />
                </Card.Body>
                {showTimesheet && (
                  <Card.Body style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    <Table responsive size="sm">
                      <thead>
                        <tr>
                          <th>Plan</th>
                          <th>Mon</th>
                          <th>Tue</th>
                          <th>Wed</th>
                          <th>Thu</th>
                          <th>Fri</th>
                          <th>Sat</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Last Week</td>
                          <td>9:00 - 18:00</td>
                          <td>8:00 - 18:00</td>
                          <td>8:00 - 18:30</td>
                          <td>9:00 - 20:00</td>
                          <td>8:30 - 18:00</td>
                          <td>9:00 - 18:00</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                )}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

// Add this CSS for styling
const cardHoverCSS = document.createElement('style');
cardHoverCSS.innerHTML = `
  .hover-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  }
  .hover-card:hover {
    transform: scale(1.001); /* Scales evenly from all sides */
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  }
`;
document.head.appendChild(cardHoverCSS);

