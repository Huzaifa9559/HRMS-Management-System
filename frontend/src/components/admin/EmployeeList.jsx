import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Button,
  InputGroup,
  FormControl,
  Dropdown,
  Badge,
  Container,
  Row,
  Col,
  Pagination,
} from 'react-bootstrap';
import { FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import SideMenu from './SideMenu';
import Header from './Header';
import Loader from '../Loader';
import debounce from 'lodash.debounce';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function EmployeeList() {
  // State Variables
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const backendURL =
    process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  const debouncedChangeHandler = useMemo(
    () => debounce((value) => setDebouncedSearchTerm(value), 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, [debouncedChangeHandler]);

  useEffect(() => {
    debouncedChangeHandler(searchTerm);
  }, [searchTerm, debouncedChangeHandler]);

  useEffect(() => {
    const fetchDesignationsAndDepartments = async () => {
      try {
        const [designationsRes, departmentsRes] = await Promise.all([
          axios.get('/api/admin/designation'),
          axios.get('/api/admin/department'),
        ]);
        setDesignations(designationsRes.data.data);
        setDepartments(departmentsRes.data.data);
      } catch (error) {
        // Error fetching data
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/api/admin/employee/all');
        setEmployees(response.data.data);
      } catch (error) {
        // Error fetching employees
      } finally {
        setLoading(false);
      }
    };

    fetchDesignationsAndDepartments();
    fetchEmployees();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedDepartment, selectedDesignation]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = debouncedSearchTerm
        ? Object.values(employee)
            .filter((value) => value != null)
            .some((value) =>
              value
                .toString()
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase())
            )
        : true;

      const matchesDepartment = selectedDepartment
        ? employee.department === selectedDepartment
        : true;

      const matchesDesignation = selectedDesignation
        ? employee.designation === selectedDesignation
        : true;

      return matchesSearch && matchesDepartment && matchesDesignation;
    });
  }, [employees, debouncedSearchTerm, selectedDepartment, selectedDesignation]);

  const currentEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEmployees.slice(startIndex, endIndex);
  }, [filteredEmployees, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`/api/admin/employee/delete/${id}`);
      setEmployees(employees.filter((employee) => employee.id !== id));
      toast.success('Employee deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete employee.');
    }
  };

  const handleViewEmployee = (employee) => {
    navigate(`/admin/employee/account/${employee.id}`);
  };

  const addNewEmployee = () => {
    navigate(`/admin/add-new-employee`);
  };
  const handleEditEmployee = (employee) => {
    navigate(`/admin/edit-employee-account/${employee.id}`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div
      className="d-flex"
      style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}
    >
      <SideMenu />
      <div className="flex-grow-1 p-3">
        <Header title="Employee Management" />

        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex flex-wrap gap-2">
              <InputGroup style={{ width: '300px' }}>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <FormControl
                  placeholder="Search by name, email, etc."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary">
                  {selectedDepartment || 'All Departments'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSelectedDepartment('')}>
                    All Departments
                  </Dropdown.Item>
                  {departments.map((dept) => (
                    <Dropdown.Item
                      key={dept.id}
                      onClick={() =>
                        setSelectedDepartment(dept.department_name)
                      }
                    >
                      {dept.department_name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary">
                  {selectedDesignation || 'All Designations'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSelectedDesignation('')}>
                    All Designations
                  </Dropdown.Item>
                  {designations.map((desg) => (
                    <Dropdown.Item
                      key={desg.id}
                      onClick={() =>
                        setSelectedDesignation(desg.designation_name)
                      }
                    >
                      {desg.designation_name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <Button variant="success" onClick={() => addNewEmployee()}>
              Add New Employee
            </Button>
          </div>

          <Row>
            {currentEmployees.map((employee) => (
              <Col md={4} className="mb-4" key={employee.id}>
                <Card className="shadow-sm">
                  <Card.Img
                    variant="top"
                    src={
                      employee.employee_image
                        ? `${backendURL}/uploads/employees/${employee.employee_image}`
                        : 'https://via.placeholder.com/150'
                    }
                    className="rounded-circle mx-auto mt-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                    }}
                  />
                  <Card.Body className="text-center">
                    <Card.Title>{employee.name}</Card.Title>
                    <Card.Text>
                      {employee.designation} | {employee.department}
                    </Card.Text>
                    <Badge bg={employee.status === 1 ? 'success' : 'danger'}>
                      {employee.status === 1 ? 'Active' : 'Disabled'}
                    </Badge>
                    <div className="mt-3 d-flex justify-content-center gap-2">
                      <Button
                        variant="info"
                        onClick={() => handleViewEmployee(employee)}
                      >
                        <FaEye />
                      </Button>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <FaEdit />
                        </Button>
                      </td>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteEmployee(employee.id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.Prev
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
              {Array.from({ length: totalPages }, (_, idx) => (
                <Pagination.Item
                  key={idx}
                  active={currentPage === idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </Pagination>
          </div>
        </Container>
      </div>
    </div>
  );
}
