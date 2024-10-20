import React, { useState, useEffect } from 'react';
import { Table, Dropdown } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';  // Importing vertical dots icon

export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const mockData = [
                { id: '61234', name: 'Randy Aminoff', department: 'Designing', designation: 'UI UX designer', joiningDate: '05 Sep 2021', status: 'Enable' },
                { id: '61235', name: 'Jane Doe', department: 'Development', designation: 'Frontend Developer', joiningDate: '10 Oct 2021', status: 'Enable' },
                { id: '61236', name: 'John Smith', department: 'HR', designation: 'HR Manager', joiningDate: '15 Nov 2021', status: 'Disable' }
            ];
            setEmployees(mockData);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setEmployees(employees.map(emp => emp.id === id ? { ...emp, status: newStatus } : emp));
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
                    {employees.map((employee) => (
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
                                {/* Using react-icons for vertical dots */}
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
        </div>
    );
}
