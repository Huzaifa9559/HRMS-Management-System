import React from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Box, Briefcase, Clock } from 'lucide-react';
import SideMenu from './SideMenu';
import Header from './Header';

const localizer = momentLocalizer(moment);

const CustomCalendar = ({ localizer, events }) => (
  <div className="custom-calendar">
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 250 }} // Adjusted height of the calendar
      views={['month']}
      toolbar={{
        label: () => (
          <h2 style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>
            October 2024 {/* Bold Month and Year */}
          </h2>
        ),
        navigate: ({ date, onNavigate }) => (
          <div className="d-flex justify-content-between align-items-center">
            <button onClick={() => onNavigate('PREV')} className="btn btn-outline-secondary">
              Back
            </button>
            <button onClick={() => onNavigate('TODAY')} className="btn btn-outline-primary mx-2">
              Today
            </button>
            <button onClick={() => onNavigate('NEXT')} className="btn btn-outline-secondary">
              Next
            </button>
          </div>
        ),
      }}
    />
  </div>
);

export default function Dashboard() {
  const events = [
    {
      title: 'Event',
      start: new Date(2021, 8, 12),
      end: new Date(2021, 8, 12),
    },
  ];

  return (
    <div className="d-flex" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}> {/* Set background color */}
      <SideMenu /> {/* Using your custom SideMenu component */}
      <div className="flex-grow-1 p-3">
        {/* Include Header at the top */}
        <Header title="Dashboard" /> {/* Assuming Header accepts a title prop */}
        <Container fluid>
          <Row className="mb-2"> {/* Reduced margin */}
            <Col md={4}>
              <Card>
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title style={{ fontWeight: 'normal' }}>Current Year Leaves</Card.Title> {/* Unbold */}
                    <Card.Text className="h5">30 Days</Card.Text> {/* Reduced font size */}
                  </div>
                  <Box size={28} color="#4CAF50" /> {/* Reduced icon size */}
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title style={{ fontWeight: 'normal' }}>Current Month Leaves</Card.Title> {/* Unbold */}
                    <Card.Text className="h5">04 Days</Card.Text> {/* Reduced font size */}
                  </div>
                  <Briefcase size={28} color="#9C27B0" /> {/* Reduced icon size */}
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title style={{ fontWeight: 'normal' }}>Yesterday's Working Hours</Card.Title> {/* Unbold */}
                    <Card.Text className="h5">08 h 30 min</Card.Text> {/* Reduced font size */}
                  </div>
                  <Clock size={28} color="#FF5722" /> {/* Reduced icon size */}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mb-2"> {/* Reduced margin */}
            <Col>
              <Card>
                <Card.Body>
                  <CustomCalendar localizer={localizer} events={events} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Timesheet</Card.Title>
                  <Table responsive>
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
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
