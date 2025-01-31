import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { Box, Briefcase, Users } from 'lucide-react';
import SideMenu from './SideMenu';
import Header from './Header';
import Loader from '../Loader';
import { useNavigate } from 'react-router-dom';

export default function ADashboard() {
  const [loading, setLoading] = useState(true);
  const [showLeaveTable, setShowLeaveTable] = useState(false); 
  const navigate = useNavigate();

  // States for toggling card collapsibility
  const [showDepartments, setShowDepartments] = useState(false);
  const [showDesignations, setShowDesignations] = useState(false);
  const [showEmployees, setShowEmployees] = useState(false);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [totalDesignations, setTotalDesignations] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [leaveData, setLeaveData] = useState([]);
  
  useEffect(() => {
    const run = async () => {
      try {
        const res1 = await axios.get('/api/admin/department');
        setTotalDepartments(res1.data.data.length);

        const res2 = await axios.get('/api/admin/designation');
        setTotalDesignations(res2.data.data.length);

        const res3 = await axios.get('/api/admin/employee');
        setTotalEmployees(res3.data.data.total_count);

        const res4 = await axios.get('/api/admin/leave');
        const firstFiveRecords = res4.data.data.slice(0, 5); // Get the first 5 records
        setLeaveData(firstFiveRecords);
      }
      catch (error) {
        console.error('Error fetching previous data:', error);
      }
    };
    run();
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

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
          {/* Cards Section */}
          <Row className="mb-3">
            <Col md={4}>
              <Card
                className="hover-card"
                onClick={() => setShowDepartments(!showDepartments)}
                style={{ cursor: 'pointer', height: 'auto' }}
              >
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title style={{ fontWeight: 'normal' }}>Departments</Card.Title>
                    {showDepartments && <Card.Text className="h5 mt-2">{totalDepartments}</Card.Text>}
                  </div>
                  <Box size={28} color="#4CAF50" />
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="hover-card"
                onClick={() => setShowDesignations(!showDesignations)}
                style={{ cursor: 'pointer', height: 'auto' }}
              >
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title style={{ fontWeight: 'normal' }}>Designations</Card.Title>
                    {showDesignations && <Card.Text className="h5 mt-2">{totalDesignations }</Card.Text>}
                  </div>
                  <Briefcase size={28} color="#9C27B0" />
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="hover-card"
                onClick={() => setShowEmployees(!showEmployees)}
                style={{ cursor: 'pointer', height: 'auto' }}
              >
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <Card.Title style={{ fontWeight: 'normal' }}>Total Active Employees</Card.Title>
                    {showEmployees && <Card.Text className="h5 mt-2">{ totalEmployees}</Card.Text>}
                  </div>
                  <Users size={28} color="#FF5722" />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Leave Table */}
          <Row>
            <Col>
              <Card className="hover-card" style={{ backgroundColor: '#ffffff', width: '100%' }}>
              <Card.Header
                style={{
                    backgroundColor: '#ffffff',
                    fontSize: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between', // Align header elements horizontally
                    alignItems: 'center', // Vertically center elements
                    cursor: 'pointer',
                }}
                onClick={() => setShowLeaveTable(!showLeaveTable)}
                >
                <div>
                    <div>Leave</div>
                    <div
                    style={{
                        fontSize: '0.9rem',
                        fontWeight: 'normal',
                        marginTop: '5px',
                        color: '#6c757d',
                    }}
                    >
                    Recent Employee's Leave Requests
                    </div>
                </div>
                <button
                    className="btn btn-outline-primary btn-sm"
                    style={{
                      fontSize: '0.85rem',
                      padding: '5px 12px', // Adjust padding for better spacing
                    }}
                    onClick={() => navigate('/admin/leave')}
                >
                    View All
                </button>
                </Card.Header>


                {showLeaveTable && (
                  <Card.Body style={{ maxHeight: '300px', overflowY: 'auto', padding: '10px' }}>
                    <Table responsive size="sm" className="leave-table">
                      <thead>
                        <tr>
                          <th style={{ color: 'black', fontSize: '1.02rem', fontWeight: 'bold', backgroundColor: '#ffffff' }}>Employee</th>
                          <th style={{ color: 'black', fontSize: '1.02rem', fontWeight: 'bold', backgroundColor: '#ffffff' }}>Department</th>
                          <th style={{ color: 'black', fontSize: '1.02rem', fontWeight: 'bold', backgroundColor: '#ffffff' }}>Days</th>
                          <th style={{ color: 'black', fontSize: '1.02rem', fontWeight: 'bold', backgroundColor: '#ffffff' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaveData.map((leave, index) => (
                          <tr key={index} style={{ padding: '10px 0' }}>
                            <td style={{ padding: '20px 10px' }}>{leave.employee_name}</td>
                            <td style={{ padding: '20px 10px' }}>{leave.department_name}</td>
                            <td style={{ padding: '20px 10px' }}>{leave.days}</td>
                            <td
                              style={{
                                  color:
                                    leave.leave_status === 0
                                      ? 'blue' // Blue for Pending
                                      : leave.leave_status === 1
                                      ? 'green' // Green for Approved
                                      : leave.leave_status === 2
                                      ? 'red' // Orange for Rejecting
                                      : 'orange', // Red for Rejected
                                }}
                            >
                              {leave.leave_status === 1
                                    ? 'Approved'
                                    : leave.leave_status === 0
                                    ? 'Pending'
                                    : leave.leave_status === 2
                                    ? 'Rejected'
                                    : 'Unknown'}
                            </td>
                          </tr>
                        ))}
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

// Add CSS for hover effects and spacing
const leaveTableCSS = document.createElement('style');
leaveTableCSS.innerHTML = `
  .leave-table th {
    text-align: left;
    font-size: 0.9rem;
    font-weight: bold;
    background-color: #ffffff; /* Set header row background to white */
  }

  .leave-table td {
    font-size: 0.9rem;
    vertical-align: middle;
    padding: 20px 10px !important; /* Increased padding for better spacing */
  }

  .hover-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  }

  .hover-card:hover {
    transform: scale(1.01);
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  }
`;
document.head.appendChild(leaveTableCSS);
