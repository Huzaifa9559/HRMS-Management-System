import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Image,
  Badge,
} from "react-bootstrap";
import SideMenu from "./SideMenu";
import Header from "./Header";
import { useParams } from "react-router-dom";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import Loader from "../Loader";

const EmpAccount = () => {
  const [employeeData, setEmployeeData] = useState();
  const [loading, setLoading] = useState(true);
  const backendURL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  const { id } = useParams();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`/api/admin/employee/${id}`);
        setEmployeeData(response.data.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        toast.error("Session expired. Please try again.");
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
    : "https://via.placeholder.com/150";

  if (loading) {
    return <Loader />;
  }

  const isActive = employee_status === 1;

  return (
    <div
      className="d-flex"
      style={{ backgroundColor: "#f3f4f6", minHeight: "100vh" }}
    >
      <SideMenu />
      <div className="flex-grow-1 p-4">
        <Header title="Employee Account" />
        <Container fluid className="py-4">
          <Row>
            <Col md={4}>
              <Card
                className="mb-4 shadow-sm border-0"
                style={{ borderRadius: "10px", overflow: "hidden" }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                    height: "140px",
                  }}
                ></div>
                <div
                  className="d-flex justify-content-center"
                  style={{ marginTop: "-50px" }}
                >
                  <Image
                    src={imageURL}
                    roundedCircle
                    style={{
                      width: "100px",
                      height: "100px",
                      border: "4px solid #ffffff",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>
                <Card.Body className="text-center">
                  <Card.Title
                    style={{ fontSize: "1.25rem", fontWeight: "bold" }}
                  >
                    {employee_first_name} {employee_last_name}
                  </Card.Title>
                  <Card.Text style={{ fontSize: "0.95rem", color: "#6c757d" }}>
                    {designation_name} | {department_name}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={8}>
              <Card
                className="shadow-sm border-0"
                style={{ borderRadius: "10px" }}
              >
                <Card.Body>
                  <h5 className="fw-bold mb-4" style={{ color: "#495057" }}>
                    Profile Information
                  </h5>
                  <Table responsive borderless>
                    <tbody>
                      <tr>
                        <td className="text-muted">Employee ID</td>
                        <td>{employeeID}</td>
                        <td className="text-muted">Name</td>
                        <td>
                          {employee_first_name} {employee_last_name}
                        </td>
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
                        <td>
                          {city}, {state}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted">Country</td>
                        <td>{country}</td>
                        <td className="text-muted">Zip Code</td>
                        <td>{zip_code}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              <Card
                className="shadow-sm border-0 mt-4"
                style={{
                  borderRadius: "10px",
                  background: isActive ? "#e8f5e9" : "#ffeef1",
                  color: isActive ? "#388e3c" : "#d32f2f",
                  fontWeight: "500",
                }}
              >
                <Card.Body className="text-center">
                  <Badge
                    bg={isActive ? "success" : "danger"}
                    style={{
                      fontSize: "0.85rem",
                      padding: "5px 15px",
                      marginBottom: "10px",
                    }}
                  >
                    {isActive ? "Active" : "Disabled"}
                  </Badge>
                  <p>
                    {isActive
                      ? "This employee is currently active and has full access."
                      : "This profile is disabled and cannot perform any actions."}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default EmpAccount;
