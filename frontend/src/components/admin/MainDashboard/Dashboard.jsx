import React, { useState, useEffect } from 'react';
import SideMenu from './SideMenu';
import EmployeeList from './EmployeeList';
import InviteNewEmployee from './InviteNewEmployee';
import Header from './Header';
import { Modal, Button, InputGroup, FormControl, Dropdown } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

export default function Dashboard() {
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState('');
    

    const [designations, setDesignations] = useState([]);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchDesignationsAndDepartments = async () => {
            try {
                const response = await axios.get('/api/employees/get-designations-and-departments');
                setDesignations(response.data.designations);
                setDepartments(response.data.departments);
            } catch (error) {
                console.error('Error fetching designations and departments:', error);
            }
        };

        fetchDesignationsAndDepartments();
    }, []);

    const handleInviteClick = () => {
        setShowInviteForm(true);
    };

    const handleCloseInvite = () => {
        setShowInviteForm(false);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <div className="container-fluid" style={{ backgroundColor: '#f9f9f9' }}> {/* Set light grey background */}
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-2 p-0 d-none d-md-block">
                    <SideMenu />
                </div>

                {/* Main content area */}
                <div className="col-md-10 p-4">
                    {/* Header Component */}
                    <Header title="Employee List" />

                    {/* Search Bar, Dropdowns, and Invite Button */}
                    <div className="mb-4 d-flex justify-content-between align-items-center">
                        <div className="d-flex flex-wrap">
                            <InputGroup className="me-2 mb-2" style={{ width: '250px' }}>
                                <InputGroup.Text className="bg-white border-end-0">
                                    <FaSearch color="#6c757d" />
                                </InputGroup.Text>
                                <FormControl
                                    placeholder="Search Employee"
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="border-start-0"
                                />
                            </InputGroup>
                            <Dropdown className="me-2 mb-2">
                                <Dropdown.Toggle variant="outline-secondary">
                                    {selectedDepartment || 'Select by Department'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {departments.map((department, index) => (
                                        <Dropdown.Item key={index} onClick={() => setSelectedDepartment(department.department_name)}>
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
                                    {designations.map((designation, index) => (
                                        <Dropdown.Item key={index} onClick={() => setSelectedDesignation(designation.designation_name)}>
                                            {designation.designation_name}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <Button className="btn btn-success me-2" onClick={handleInviteClick}>
                            Invite New Employee
                        </Button>
                    </div>

                    {/* Employee List */}
                    <EmployeeList searchTerm={searchTerm} />
                </div>
            </div>

            {/* Invite New Employee Modal */}
            <Modal show={showInviteForm} onHide={handleCloseInvite} centered>
                <Modal.Header className="justify-content-center">
                    <Modal.Title>Invite New Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InviteNewEmployee />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        style={{ backgroundColor: '#6c757d', borderColor: '#6c757d', color: 'white' }}
                        onClick={handleCloseInvite}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
