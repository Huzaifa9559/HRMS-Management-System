import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Image } from 'react-bootstrap';
import SideMenu from './SideMenu';
import Header from './Header';
import axios from 'axios';
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';

const EmpAccount = () => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState();
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(`/api/employees/employee`, {
          headers: {
            Authorization: `Bearer ${token}`, // Replace YOUR_TOKEN_HERE with the actual token
          }
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
    employeeID, employee_first_name, employee_last_name, employee_email,
    employee_DOB, employee_phonenumber, department_name, designation_name,
    street_address, city, state, country, zip_code, employee_status,
    employee_joining_date, employee_image // Add employee_image key
  } = employeeData || {};

  const backendURL = process.env.REACT_APP_BACKEND_URL;
  const imageURL = employee_image ? `${backendURL}/uploads/employees/${employee_image}` : null;

  // Show loader if loading is true
  if (loading) {
    return <Loader />;
  }

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
                        src={imageURL}
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
                      <Card.Title>{employee_first_name} {employee_last_name}</Card.Title>
                      <Card.Text>{designation_name}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={8}>
                  <h5 className="fw-bold">Profile Information</h5>
                  <Table responsive borderless className="mb-0">
                    <tbody>
                      <tr>
                        <td className="text-muted">Employee ID</td>
                        <td>{employeeID}</td>
                        <td className="text-muted">Name</td>
                        <td>{employee_first_name}</td>
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
