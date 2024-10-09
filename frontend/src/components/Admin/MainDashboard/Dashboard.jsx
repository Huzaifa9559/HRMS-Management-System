import React, { useState } from 'react';
import SideMenu from './SideMenu';
import EmployeeList from './EmployeeList';
import InviteNewEmployee from './InviteNewEmployee';
import Header from './Header'; // Import the Header component
import { Modal, Button, InputGroup, FormControl } from 'react-bootstrap'; // Import InputGroup and FormControl from Bootstrap
import { FaSearch } from 'react-icons/fa'; // Import the search icon from react-icons

export default function Dashboard() {
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-2 p-0">
                    <SideMenu />
                </div>

                {/* Main content area */}
                <div className="col-md-10 p-4">
                    {/* Header Component with "Organization" as prop */}
                    <Header title="Organization" /> {/* Highlighted part: Passing "Organization" as a prop */}

                    {/* Invite New Employee Button */}
                    <div className="d-flex justify-content-end mb-4">
                        <button className="btn btn-success" onClick={handleInviteClick}>
                            Invite New Employee
                        </button>
                    </div>

                    {/* Search Bar with Icon */}
                    <div className="mb-4">
                        <InputGroup className="mb-3" style={{ width: '250px' }}>
                            <InputGroup.Text>
                                <FaSearch />
                            </InputGroup.Text>
                            <FormControl
                                placeholder="Search Employee"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </InputGroup>
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
