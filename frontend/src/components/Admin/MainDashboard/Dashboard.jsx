import React, { useState } from 'react';
import SideMenu from './SideMenu';
import EmployeeList from './EmployeeList';
import InviteNewEmployee from './InviteNewEmployee';

export default function Dashboard() {
    const [showInviteForm, setShowInviteForm] = useState(false);

    const handleInviteClick = () => {
        setShowInviteForm(true);
    };

    const handleCloseInvite = () => {
        setShowInviteForm(false);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-3 p-0">
                    <SideMenu />
                </div>

                {/* Main content area */}
                <div className={`col-md-${showInviteForm ? '6' : '9'} p-4`}>
                    {/* Header and Invite Button */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="h4">Organization</h1>
                        <button
                            className="btn btn-success"
                            onClick={handleInviteClick}
                        >
                            Invite New Employee
                        </button>
                    </div>

                    {/* Employee List */}
                    <EmployeeList />
                </div>

                {/* Invite New Employee Form (Sidebar on the right) */}
                {showInviteForm && (
                    <div className="col-md-3 p-4 bg-light">
                        <InviteNewEmployee onClose={handleCloseInvite} />
                    </div>
                )}
            </div>
        </div>
    );
}
