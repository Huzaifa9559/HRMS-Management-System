import React, { useState, useEffect, useMemo } from 'react';
import SideMenu from './SideMenu';
import Header from './Header';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

import {
    Modal,
    Button,
    InputGroup,
    FormControl,
    Dropdown,
    Table,
} from 'react-bootstrap';
import { FaSearch, FaEllipsisV } from 'react-icons/fa';
import Loader from '../Loader';
import debounce from 'lodash.debounce';
import Cookies from 'js-cookie';

export default function EmployeeList() {
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState('');
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [email, setEmail] = useState('');
    const [designations, setDesignations] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editedEmployee, setEditedEmployee] = useState(null);

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
        const timer = setTimeout(() => setLoading(false), 1250);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchDesignationsAndDepartments = async () => {
            try {
                const response = await axios.get('/api/public/designation');
                setDesignations(response.data.data);

                const response2 = await axios.get('/api/public/department');
                setDepartments(response2.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchDesignationsAndDepartments();
    }, []);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('/api/admin/employee/all');
                setEmployees(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchEmployees();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, selectedDepartment, selectedDesignation]);

    const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
        const matchesSearch = debouncedSearchTerm
            ? Object.values(employee)
                  .filter((value) => value != null) // Exclude null/undefined values
                  .some((value) =>
                      value.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
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

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };
    const navigate = useNavigate();

    const handleEditEmployee = (employee) => {
        // Navigate to the edit employee page with the employee's ID
        navigate(`/admin/edit-employee-account/${employee.id}`);
    };
    const handleInviteClick = () => setShowInviteForm(true);

    const handleCloseInvite = () => {
        setShowInviteForm(false);
        setEmail('');
    };

    const handleEmailChange = (e) => setEmail(e.target.value);

    const handleSendInvite = async (e) => {
        e.preventDefault();
        try {
            const token = Cookies.get('token');
            const response = await axios.post(
                '/api/admin/auth/invite-new-employee',
                { email },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            console.log('Response:', response.data);
            toast.success('Invitation sent successfully!');
        } catch (error) {
            console.error('Error sending invitation:', error);
            toast.error('Failed to send the invitation.');
        }
        handleCloseInvite();
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await axios.post(
                '/api/admin/employee/update-status',
                { employeeId: id}
            );

            //Update the status in the local state
            setEmployees((prevEmployees) =>
                prevEmployees.map((emp) =>
                    emp.id === id ? { ...emp, status: newStatus } : emp
                )
            );

            toast.success('Employee status updated!');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status.');
        }
    };

    const handleViewEmployee = (employee) => {
        setEmployeeDetails(employee);
        setShowEmployeeDetails(true);
    };

 

    const handleDeleteEmployee = async (id) => {
        try {
            await axios.delete(`/api/admin/employee/delete/${id}`);
            setEmployees(employees.filter((employee) => employee.id !== id));
            toast.success('Employee deleted successfully!');
        } catch (error) {
            console.error('Error deleting employee:', error);
            toast.error('Failed to delete employee.');
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div
            className="container-fluid"
            style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}
        >
            <div className="row">
                <div className="col-md-2 p-0 d-none d-md-block">
                    <SideMenu />
                </div>

                <div className="col-md-10 p-4">
                    <Header title="Organization Management" />

<div className="d-flex justify-content-between align-items-center mb-4">
    <div className="d-flex flex-wrap">
        {/* Search and Filters */}
        <InputGroup className="me-2 mb-2" style={{ width: '250px' }}>
            <InputGroup.Text className="bg-white border-end-0">
                <FaSearch color="#6c757d" />
            </InputGroup.Text>
            <FormControl
                placeholder="Search Employee"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-start-0"
            />
        </InputGroup>

        <Dropdown className="me-2 mb-2">
            <Dropdown.Toggle variant="outline-secondary">
                {selectedDepartment || 'Select by Department'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSelectedDepartment('')}>
                    All Departments
                </Dropdown.Item>
                {departments.map((department, index) => (
                    <Dropdown.Item
                        key={index}
                        onClick={() =>
                            setSelectedDepartment(department.department_name)
                        }
                    >
                        {department.department_name}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="me-2 mb-2">
            <Dropdown.Toggle variant="outline-secondary">
                {selectedDesignation || 'Select by Designation'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSelectedDesignation('')}>
                    All Designations
                </Dropdown.Item>
                {designations.map((designation, index) => (
                    <Dropdown.Item
                        key={index}
                        onClick={() =>
                            setSelectedDesignation(designation.designation_name)
                        }
                    >
                        {designation.designation_name}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    </div>

    {/* Action Buttons */}
    <div>
        <Button
            variant="success"
            className="me-2"
            onClick={() => navigate('/admin/add-new-employee')}
        >
            Add New Employee
        </Button>
    </div>
</div>


                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Designation</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentEmployees.map((employee, index) => (
                                <tr key={index}>
                                    <td>{employee.name}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.department}</td>
                                    <td>{employee.designation}</td>
                                    <td>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="outline-secondary"  style={{ color: employee.status === 1 ? 'green' : 'red' }}>
                                                
                                                {employee.status===1?'Active':'Disabled'}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item
                                                    onClick={() => handleStatusChange(employee.id, 1)}
                                                >
                                                    Active
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    onClick={() => handleStatusChange(employee.id, 0)}
                                                >
                                                    Disabled
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            onClick={() => handleViewEmployee(employee)}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="warning"
                                            onClick={() => handleEditEmployee(employee)}
                                            className="ms-2"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDeleteEmployee(employee.id)}
                                            className="ms-2"
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between">
                        <button
                            className="btn btn-secondary"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="btn btn-secondary"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>

                    {/* Invite Employee Modal */}
                    <Modal show={showInviteForm} onHide={handleCloseInvite}>
                        <Modal.Header closeButton>
                            <Modal.Title>Invite Employee</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSendInvite}>
                                <div className="mb-3">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        className="form-control"
                                        placeholder="Enter email"
                                    />
                                </div>
                                <div className="mb-3 text-end">
                                    <Button variant="primary" type="submit">
                                        Send Invite
                                    </Button>
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal>

                    {/* Employee Details Modal */}
                    <Modal show={showEmployeeDetails} onHide={() => setShowEmployeeDetails(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Employee Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {employeeDetails && (
                                <>
                                    <p>Name: {employeeDetails.name}</p>
                                    <p>Email: {employeeDetails.email}</p>
                                    <p>Department: {employeeDetails.department}</p>
                                    <p>Designation: {employeeDetails.designation}</p>
                                    <p>Status: {employeeDetails.status===1? 'Active':'Disabled'}</p>
                                </>
                            )}
                        </Modal.Body>
                    </Modal>

                 {/* Edit Employee Modal */}

        


                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
