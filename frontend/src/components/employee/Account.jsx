import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Image, Badge } from 'react-bootstrap';
import SideMenu from './SideMenu';
import Header from './Header';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';

const EmpAccount = () => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState();
  const [loading, setLoading] = useState(true);
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(`/api/employees/employee`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployeeData(response.data.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        toast.error('Session expired. Please try again.');
        navigate('/login');
      }
    };

    fetchEmployeeData();
  }, []);

  const {
    employeeID,
    employee_first_name,
    employee_last_name,
    employee_email,
    employee_DOB,
    employee_phonenumber,
    department_name,
    designation_name,
    street_address,
    city,
    state,
    country,
    zip_code,
    employee_status,
    employee_joining_date,
    employee_image,
  } = employeeData || {};

  const imageURL = employee_image
    ? `${backendURL}/uploads/employees/${employee_image}`
    : null;

  if (loading) {
    return <Loader />;
  }

  const isActive = employee_status === 1;

  return (
    <div className="d-flex" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <SideMenu />
      <div className="flex-grow-1 p-3">
        <Header title="Account" />
        <Container fluid className="py-3" style={{ margin: '0 20px 0 0' }}>
          <Row>
            <Col md={4}>
              <Card className="mb-4">
                <div
                  style={{
                    backgroundImage:
                      'url(https://static.vecteezy.com/system/resources/previews/018/991/307/non_2x/soft-gradient-abstract-in-pastel-purple-and-pink-colors-gradient-background-blurred-gradient-texture-decorative-element-wallpaper-vector.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '150px',
                    borderTopLeftRadius: '0.5rem',
                    borderTopRightRadius: '0.5rem',
                  }}
                ></div>
                <Image
                  src={imageURL}
                  roundedCircle
                  style={{
                    width: '100px',
                    height: '100px',
                    border: '2px solid #ffffff',
                    position: 'absolute',
                    top: '75px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                />
                <Card.Body style={{ marginTop: '60px' }} className="text-center">
                  <Card.Title style={{ fontSize: '1.2rem' }}>
                    {employee_first_name} {employee_last_name}
                  </Card.Title>
                  <Card.Text style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                    {designation_name}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={8}>
              <h5 className="fw-bold">Profile Information</h5>
              <Table responsive borderless className="mb-4">
                <tbody>
                  <tr>
                    <td className="text-muted">Employee ID</td>
                    <td>{employeeID}</td>
                    <td className="text-muted">Name</td>
                    <td>{employee_first_name} {employee_last_name}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Date Of Birth</td>
                    <td>{employee_DOB}</td>
                    <td className="text-muted">Phone Number</td>
                    <td>{employee_phonenumber}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Email</td>
                    <td>{employee_email}</td>
                    <td className="text-muted">Designation</td>
                    <td>{designation_name}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Department</td>
                    <td>{department_name}</td>
                    <td className="text-muted">Address</td>
                    <td>{street_address}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Joining Date</td>
                    <td>{employee_joining_date}</td>
                    <td className="text-muted">City/State</td>
                    <td>{city}, {state}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Country</td>
                    <td>{country}</td>
                    <td className="text-muted">Zip Code</td>
                    <td>{zip_code}</td>
                  </tr>
                </tbody>
              </Table>

              <h5 className="fw-bold mt-4">Status</h5>
              <Card
                className="mb-4 text-center"
                style={{
                  padding: '15px',
                  borderRadius: '8px',
                  background: isActive ? '#e8f5e9' : '#ffeef1',
                  color: isActive ? '#388e3c' : '#d32f2f',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                }}
              >
                <div>
                  <Badge
                    bg={isActive ? 'success' : 'danger'}
                    style={{ fontSize: '0.85rem', padding: '5px 10px', marginBottom: '10px' }}
                  >
                    {isActive ? 'Active' : 'Disabled'}
                  </Badge>
                  {isActive ? (
                    <p>You are currently active and can access all features.</p>
                  ) : (
                    <p>
                      Your profile is disabled. You cannot mark attendance, apply for leaves, or perform work-related actions.
                      Please contact the administrator for assistance.
                    </p>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default EmpAccount;
