import React, { useState, useEffect } from 'react';
import { Table, Dropdown, Pagination, Button } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';  // Importing vertical dots icon

export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [currentEmployees, setCurrentEmployees] = useState([]);
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const mockData = [
                    { id: '61234', name: 'Randy Aminoff', department: 'Designing', designation: 'UI UX designer', joiningDate: '05 Sep 2021', status: 'Enable' },
                    { id: '61235', name: 'Jane Doe', department: 'Development', designation: 'Frontend Developer', joiningDate: '10 Oct 2021', status: 'Enable' },
                    { id: '61236', name: 'John Smith', department: 'HR', designation: 'HR Manager', joiningDate: '15 Nov 2021', status: 'Disable' },
                    { id: '61237', name: 'Alice Johnson', department: 'Marketing', designation: 'Marketing Manager', joiningDate: '20 Dec 2021', status: 'Enable' },
                    { id: '61238', name: 'Bob Brown', department: 'Sales', designation: 'Sales Executive', joiningDate: '25 Jan 2022', status: 'Disable' },
                    { id: '61239', name: 'Charlie Davis', department: 'Support', designation: 'Support Engineer', joiningDate: '30 Feb 2022', status: 'Enable' },
                    { id: '61240', name: 'Diana Evans', department: 'Finance', designation: 'Accountant', joiningDate: '05 Mar 2022', status: 'Disable' },
                    { id: '61241', name: 'Evan Green', department: 'IT', designation: 'System Administrator', joiningDate: '10 Apr 2022', status: 'Enable' },
                    { id: '61242', name: 'Fiona Harris', department: 'Operations', designation: 'Operations Manager', joiningDate: '15 May 2022', status: 'Disable' },
                    { id: '61243', name: 'George King', department: 'Logistics', designation: 'Logistics Coordinator', joiningDate: '20 Jun 2022', status: 'Enable' },
                    { id: '61244', name: 'Hannah Lee', department: 'Legal', designation: 'Legal Advisor', joiningDate: '25 Jul 2022', status: 'Disable' },
                    { id: '61245', name: 'Ian Moore', department: 'Research', designation: 'Research Scientist', joiningDate: '30 Aug 2022', status: 'Enable' },
                    { id: '61246', name: 'Ian Moore', department: 'Research', designation: 'Research Scientist', joiningDate: '30 Aug 2022', status: 'Enable' },
                    { id: '61247', name: 'Ian Moore', department: 'Research', designation: 'Research Scientist', joiningDate: '30 Aug 2022', status: 'Enable' },
                    { id: '61248', name: 'Ian Moore', department: 'Research', designation: 'Research Scientist', joiningDate: '30 Aug 2022', status: 'Enable' },
                    { id: '61249', name: 'Ian Moore', department: 'Research', designation: 'Research Scientist', joiningDate: '30 Aug 2022', status: 'Enable' },
                    { id: '61250', name: 'Ian Moore', department: 'Research', designation: 'Research Scientist', joiningDate: '30 Aug 2022', status: 'Enable' },
                    { id: '61251', name: 'Ian Moore', department: 'Research', designation: 'Research Scientist', joiningDate: '30 Aug 2022', status: 'Enable' },
                    { id: '61252', name: 'Ian Moore', department: 'Research', designation: 'Research Scientist', joiningDate: '30 Aug 2022', status: 'Enable' }
                ];
                setEmployees(mockData);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
        fetchEmployees();
    }, [])
    
    useEffect(() => {
        setCurrentEmployees(employees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    }, [currentPage, employees]);


    const handleStatusChange = (id, newStatus) => {
        setEmployees(employees.map(emp => emp.id === id ? { ...emp, status: newStatus } : emp));
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > Math.ceil(employees.length / itemsPerPage)) return;
        setCurrentPage(pageNumber);
    };

    return (
        <div className="p-4 rounded-lg shadow-md" style={{ backgroundColor: '#f9f9f9' }}>
            <Table bordered hover responsive>
                <thead className="table-light">
                    <tr>
                        <th>Employee ID</th>
                        <th>Emp Name</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Joining Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEmployees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            <td>{employee.department}</td>
                            <td>{employee.designation}</td>
                            <td>{employee.joiningDate}</td>
                            <td>
                                <Dropdown>
                                    <Dropdown.Toggle variant={employee.status === 'Enable' ? 'success' : 'danger'} size="sm">
                                        {employee.status}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleStatusChange(employee.id, 'Enable')}>Enable</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleStatusChange(employee.id, 'Disable')}>Disable</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                            <td>
                                <Dropdown>
                                    <Dropdown.Toggle as="div" className="border-0 bg-transparent p-0">
                                        <FaEllipsisV style={{ cursor: 'pointer', color: '#6c757d' }} />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>View</Dropdown.Item>
                                        <Dropdown.Item>Edit</Dropdown.Item>
                                        <Dropdown.Item>Delete</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-center mt-3">
                <Button
                    variant="outline-secondary"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </Button>
                <span className="mx-3">Page {currentPage} of {Math.ceil(employees.length / itemsPerPage)}</span>
                <Button
                    variant="outline-secondary"
                    disabled={currentPage === Math.ceil(employees.length / itemsPerPage)}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
