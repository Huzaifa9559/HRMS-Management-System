import React from 'react';
import { Container, Row, Col, Card, Table, Image } from 'react-bootstrap';
import SideMenu from './SideMenu';
import Header from './Header';

const EmpAccount = () => {
  const employeeData = {
    name: 'Katya Schleifer',
    title: 'UI UX Designer',
    nic: '35202-1234567-1',
    details: {
      employeeId: 'EU 2453',
      phoneNumber: '+1 233 123 123 1233',
      email: 'xyzuser@gmail.com',
      designation: 'Product designer',
      department: 'Design',
      address: 'Lahore, Punjab',
      zipCode: '637994',
      country: 'Pakistan',
    }
  };

  const { name, title, nic, details } = employeeData;
  const { employeeId, phoneNumber, email, designation, department, address, zipCode, country } = details;

  return (
    <div className="d-flex" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <SideMenu />
      <div className="flex-grow-1 p-3">
        <Header title="Account" />
        <Container fluid className="py-3" style={{ margin: '0 20px 0 0' }}>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Card className="bg-light text-center" style={{ position: 'relative', height: '320px' }}>
                    <div
                      style={{
                        backgroundImage: 'url(https://static.vecteezy.com/system/resources/previews/018/991/307/non_2x/soft-gradient-abstract-in-pastel-purple-and-pink-colors-gradient-background-blurred-gradient-texture-decorative-element-wallpaper-vector.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderTopLeftRadius: '0.5rem',
                        borderTopRightRadius: '0.5rem',
                        paddingTop: '50px',
                        height: '150px',
                      }}
                    ></div>
                    <Image
                      src="https://img.freepik.com/free-photo/human-face-expressions-emotions-positive-joyful-young-beautiful-female-with-fair-straight-hair-casual-clothing_176420-15188.jpg"
                      roundedCircle
                      style={{
                        width: '140px',
                        height: '140px',
                        border: '2px solid #ffffff',
                        position: 'absolute',
                        top: '80px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                    />
                    <Card.Body style={{ marginTop: '60px' }}>
                      <Card.Title>{name}</Card.Title>
                      <Card.Text>{title}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={8}>
                  <h5 className="fw-bold">Profile Information</h5>
                  <Table responsive borderless className="mb-0">
                    <tbody>
                      <tr>
                        <td className="text-muted">Employee ID</td>
                        <td>{employeeId}</td>
                        <td className="text-muted">Name</td>
                        <td>{name}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">CNIC</td>
                        <td>{nic}</td>
                        <td className="text-muted">Phone Number</td>
                        <td>{phoneNumber}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Email</td>
                        <td>{email}</td>
                        <td className="text-muted">Designation</td>
                        <td>{designation}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Department</td>
                        <td>{department}</td>
                        <td className="text-muted">Address</td>
                        <td>{address}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">City/State</td>
                        <td>{address}</td>
                        <td className="text-muted">Zip Code</td>
                        <td>{zipCode}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Country</td>
                        <td>{country}</td>
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
