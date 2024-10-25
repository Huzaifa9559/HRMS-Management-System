import React from 'react';
import { Container, Row, Col, Card, Table, Image } from 'react-bootstrap';
import SideMenu from './SideMenu';
import Header from './Header'; // Import the Header component

const EmpAccount = () => {
  const employeeData = {
    name: 'Katya Schleifer',
    title: 'UI UX Designer',
    employeeId: 'EU 2453',
    phoneNumber: '+1 233 123 123 1233',
    email: 'xyzuser@gmail.com',
    designation: 'Product designer',
    department: 'Design',
    address: 'Lahore, Punjab',
    zipCode: '637994',
    country: 'Pakistan',
  };

  return (
    <div className="d-flex" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <SideMenu />
      <div className="flex-grow-1 p-3"> {/* Same padding as Dashboard */}
        <Header title="Account" /> {/* Use the Header component */}
        <Container fluid className="py-3" style={{ margin: '0 20px' }}> {/* Added margin to match the Dashboard */}
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Card className="bg-light text-center">
                    <div
                      style={{
                        backgroundImage: 'url(https://img.freepik.com/free-vector/pink-blue-swirl-gradient_78370-261.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderTopLeftRadius: '0.5rem',
                        borderTopRightRadius: '0.5rem',
                        paddingTop: '70px',
                      }}
                    >
                      <Image
                        src="https://img.freepik.com/free-photo/human-face-expressions-emotions-positive-joyful-young-beautiful-female-with-fair-straight-hair-casual-clothing_176420-15188.jpg"
                        roundedCircle
                        className="mb-3"
                        style={{
                          width: '120px',
                          height: '120px',
                          border: '5px solid white',
                          marginTop: '-60px',
                        }}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title>{employeeData.name}</Card.Title>
                      <Card.Text>{employeeData.title}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={8}>
                  <h5 className="fw-bold">Profile Information</h5>
                  <Table responsive borderless className="mb-0">
                    <tbody>
                      <tr>
                        <td>Employee ID</td>
                        <td>{employeeData.employeeId}</td>
                        <td>Name</td>
                        <td>{employeeData.name}</td>
                      </tr>
                      <tr>
                        <td>Phone Number</td>
                        <td>{employeeData.phoneNumber}</td>
                        <td>Email</td>
                        <td>{employeeData.email}</td>
                      </tr>
                      <tr>
                        <td>Designation</td>
                        <td>{employeeData.designation}</td>
                        <td>Department</td>
                        <td>{employeeData.department}</td>
                      </tr>
                      <tr>
                        <td>Address</td>
                        <td>{employeeData.address}</td>
                        <td>Zip Code</td>
                        <td>{employeeData.zipCode}</td>
                      </tr>
                      <tr>
                        <td>City/State</td>
                        <td>{employeeData.address}</td>
                        <td>Country</td>
                        <td>{employeeData.country}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default EmpAccount;
