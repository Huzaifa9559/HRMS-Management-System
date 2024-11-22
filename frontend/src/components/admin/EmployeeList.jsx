// EmployeeList.jsx

import React, { useState, useEffect, useMemo } from 'react';
import SideMenu from './SideMenu';
import Header from './Header';
import axios from 'axios';
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

export default function EmployeeList() {
    // State variables
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
    const [loading, setLoading] = useState(true); // Loading state

    // Debounce the search input to improve performance
    const debouncedChangeHandler = useMemo(
        () => debounce((value) => setDebouncedSearchTerm(value), 300),
        []
    );

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            debouncedChangeHandler.cancel();
        };
    }, [debouncedChangeHandler]);

    // Update debounced search term when searchTerm changes
    useEffect(() => {
        debouncedChangeHandler(searchTerm);
    }, [searchTerm, debouncedChangeHandler]);

    // Simulate loading (replace with actual API calls as needed)
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
        return () => clearTimeout(timer); // Cleanup on unmount
    }, []);

    // Fetch designations and departments from API
    useEffect(() => {
        const fetchDesignationsAndDepartments = async () => {
            try {
                const response = await axios.get(
                    '/api/employees/get-designations-and-departments'
                );
                setDesignations(response.data.designations);
                setDepartments(response.data.departments);
            } catch (error) {
                console.error(
                    'Error fetching designations and departments:',
                    error
                );
            }
        };

        fetchDesignationsAndDepartments();
    }, []);

    // Fetch employee data (replace mock data with actual API calls as needed)
    useEffect(() => {
        // Mock Employee Data
        const mockData = [
            {
                id: '61234',
                name: 'Randy Aminoff',
                department: 'Designing',
                designation: 'UI UX designer',
                joiningDate: '05 Sep 2021',
                status: 'Enable',
            },
            {
                id: '61235',
                name: 'Jane Doe',
                department: 'Development',
                designation: 'Frontend Developer',
                joiningDate: '10 Oct 2021',
                status: 'Enable',
            },
            {
                id: '61236',
                name: 'John Smith',
                department: 'HR',
                designation: 'HR Manager',
                joiningDate: '15 Nov 2021',
                status: 'Disable',
            },
            {
                id: '61237',
                name: 'Alice Johnson',
                department: 'Marketing',
                designation: 'Marketing Manager',
                joiningDate: '20 Dec 2021',
                status: 'Enable',
            },
            {
                id: '61238',
                name: 'Bob Brown',
                department: 'Sales',
                designation: 'Sales Executive',
                joiningDate: '25 Jan 2022',
                status: 'Disable',
            },
            {
                id: '61239',
                name: 'Charlie Davis',
                department: 'Support',
                designation: 'Support Engineer',
                joiningDate: '30 Feb 2022',
                status: 'Enable',
            },
            {
                id: '61240',
                name: 'Diana Evans',
                department: 'Finance',
                designation: 'Accountant',
                joiningDate: '05 Mar 2022',
                status: 'Disable',
            },
            {
                id: '61241',
                name: 'Evan Green',
                department: 'IT',
                designation: 'System Administrator',
                joiningDate: '10 Apr 2022',
                status: 'Enable',
            },
            {
                id: '61242',
                name: 'Fiona Harris',
                department: 'Operations',
                designation: 'Operations Manager',
                joiningDate: '15 May 2022',
                status: 'Disable',
            },
            {
                id: '61243',
                name: 'George King',
                department: 'Logistics',
                designation: 'Logistics Coordinator',
                joiningDate: '20 Jun 2022',
                status: 'Enable',
            },
            {
                id: '61244',
                name: 'Hannah Lee',
                department: 'Legal',
                designation: 'Legal Advisor',
                joiningDate: '25 Jul 2022',
                status: 'Disable',
            },
            {
                id: '61245',
                name: 'Ian Moore',
                department: 'Research',
                designation: 'Research Scientist',
                joiningDate: '30 Aug 2022',
                status: 'Enable',
            },
            // Duplicate entries for testing pagination and search
            {
                id: '61246',
                name: 'Ian Moore',
                department: 'Research',
                designation: 'Research Scientist',
                joiningDate: '30 Aug 2022',
                status: 'Enable',
            },
            {
                id: '61247',
                name: 'Ian Moore',
                department: 'Research',
                designation: 'Research Scientist',
                joiningDate: '30 Aug 2022',
                status: 'Enable',
            },
            {
                id: '61248',
                name: 'Ian Moore',
                department: 'Research',
                designation: 'Research Scientist',
                joiningDate: '30 Aug 2022',
                status: 'Enable',
            },
            {
                id: '61249',
                name: 'Ian Moore',
                department: 'Research',
                designation: 'Research Scientist',
                joiningDate: '30 Aug 2022',
                status: 'Enable',
            },
            {
                id: '61250',
                name: 'Ian Moore',
                department: 'Research',
                designation: 'Research Scientist',
                joiningDate: '30 Aug 2022',
                status: 'Enable',
            },
            {
                id: '61251',
                name: 'Ian Moore',
                department: 'Research',
                designation: 'Research Scientist',
                joiningDate: '30 Aug 2022',
                status: 'Enable',
            },
            {
                id: '61252',
                name: 'Ian Moore',
                department: 'Research',
                designation: 'Research Scientist',
                joiningDate: '30 Aug 2022',
                status: 'Enable',
            },
        ];
        setEmployees(mockData);
    }, []);

    // Reset currentPage to 1 whenever filters or search term change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, selectedDepartment, selectedDesignation]);

    // Filter employees based on search term and selected filters
    const filteredEmployees = useMemo(() => {
        return employees.filter((employee) => {
            // Enhanced search across multiple fields
            const matchesSearch = debouncedSearchTerm
                ? Object.values(employee).some((value) =>
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
    }, [
        employees,
        debouncedSearchTerm,
        selectedDepartment,
        selectedDesignation,
    ]);

    // Determine the current page's employees
    const currentEmployees = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredEmployees.slice(startIndex, endIndex);
    }, [filteredEmployees, currentPage, itemsPerPage]);

    // Calculate total pages based on filtered employees
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    // Handle page change with boundary checks
    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    // Handle invite modal visibility
    const handleInviteClick = () => setShowInviteForm(true);
    const handleCloseInvite = () => {
        setShowInviteForm(false);
        setEmail('');
    };

    // Handle email input change
    const handleEmailChange = (e) => setEmail(e.target.value);

    // Handle sending invitation
    const handleSendInvite = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                '/api/admin/invite-new-employee',
                { email }
            );
            console.log('Response:', response.data);
            alert('Invitation sent successfully!');
        } catch (error) {
            console.error('Error sending invitation:', error);
            alert('Failed to send the invitation.');
        }
        handleCloseInvite();
    };

    // Handle status change (Enable/Disable)
    const handleStatusChange = (id, newStatus) => {
        setEmployees((prevEmployees) =>
            prevEmployees.map((emp) =>
                emp.id === id ? { ...emp, status: newStatus } : emp
            )
        );
    };

    // Show loader if loading is true
    if (loading) {
        return <Loader />;
    }

    return (
        <div
            className="container-fluid"
            style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}
        >
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-2 p-0 d-none d-md-block">
                    <SideMenu />
                </div>

                {/* Main Content */}
                <div className="col-md-10 p-4">
                    {/* Header */}
                    <Header title="Organization Management" />

                    {/* Search Bar, Filters, and Invite Button */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex flex-wrap">
                            {/* Search Input */}
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

                            {/* Department Filter */}
                            <Dropdown className="me-2 mb-2">
                                <Dropdown.Toggle variant="outline-secondary">
                                    {selectedDepartment || 'Select by Department'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        onClick={() => setSelectedDepartment('')}
                                    >
                                        All Departments
                                    </Dropdown.Item>
                                    {departments.map((department, index) => (
                                        <Dropdown.Item
                                            key={index}
                                            onClick={() =>
                                                setSelectedDepartment(
                                                    department.department_name
                                                )
                                            }
                                        >
                                            {department.department_name}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>

                            {/* Designation Filter */}
                            <Dropdown className="me-2 mb-2">
                                <Dropdown.Toggle variant="outline-secondary">
                                    {selectedDesignation || 'Select by Designation'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        onClick={() => setSelectedDesignation('')}
                                    >
                                        All Designations
                                    </Dropdown.Item>
                                    {designations.map((designation, index) => (
                                        <Dropdown.Item
                                            key={index}
                                            onClick={() =>
                                                setSelectedDesignation(
                                                    designation.designation_name
                                                )
                                            }
                                        >
                                            {designation.designation_name}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        {/* Invite New Employee Button */}
                        <Button
                            className="btn btn-success"
                            onClick={handleInviteClick}
                        >
                            Invite New Employee
                        </Button>
                    </div>

                    {/* Employee List */}
                    <div
                        className="p-4 rounded-lg shadow-md"
                        style={{ backgroundColor: '#ffffff' }}
                    >
                        <Table bordered hover responsive>
                            <thead className="table-light">
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Designation</th>
                                    <th>Joining Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEmployees.length > 0 ? (
                                    currentEmployees.map((employee) => (
                                        <tr key={employee.id}>
                                            <td>{employee.id}</td>
                                            <td>{employee.name}</td>
                                            <td>{employee.department}</td>
                                            <td>{employee.designation}</td>
                                            <td>{employee.joiningDate}</td>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        variant={
                                                            employee.status === 'Enable'
                                                                ? 'success'
                                                                : 'danger'
                                                        }
                                                        size="sm"
                                                    >
                                                        {employee.status}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {employee.status !== 'Enable' && (
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        employee.id,
                                                                        'Enable'
                                                                    )
                                                                }
                                                            >
                                                                Enable
                                                            </Dropdown.Item>
                                                        )}
                                                        {employee.status !== 'Disable' && (
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        employee.id,
                                                                        'Disable'
                                                                    )
                                                                }
                                                            >
                                                                Disable
                                                            </Dropdown.Item>
                                                        )}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        as="div"
                                                        className="border-0 bg-transparent p-0"
                                                    >
                                                        <FaEllipsisV
                                                            style={{
                                                                cursor: 'pointer',
                                                                color: '#6c757d',
                                                            }}
                                                        />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item>View</Dropdown.Item>
                                                        <Dropdown.Item>Edit</Dropdown.Item>
                                                        <Dropdown.Item>Delete</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            No employees found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                        {/* Pagination Controls */}
                        {filteredEmployees.length > itemsPerPage && (
                            <div className="d-flex justify-content-center mt-3">
                                <Button
                                    variant="outline-secondary"
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="me-2"
                                >
                                    Previous
                                </Button>
                                <span className="align-self-center">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline-secondary"
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="ms-2"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Invite New Employee Modal */}
            <Modal show={showInviteForm} onHide={handleCloseInvite} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Invite New Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSendInvite}>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="email">
                                Enter Email <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="Enter employee email"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }}
                                required
                            />
                        </div>
                        <Button type="submit" className="btn btn-primary w-100">
                            Send Invitation
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
