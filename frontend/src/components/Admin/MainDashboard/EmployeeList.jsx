import React, { useState, useEffect } from 'react';

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

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr>
                        <th className="border-b p-2 text-left">Employee ID</th>
                        <th className="border-b p-2 text-left">Emp Name</th>
                        <th className="border-b p-2 text-left">Department</th>
                        <th className="border-b p-2 text-left">Designation</th>
                        <th className="border-b p-2 text-left">Joining Date</th>
                        <th className="border-b p-2 text-left">Status</th>
                        <th className="border-b p-2 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td className="border-b p-2">{employee.id}</td>
                            <td className="border-b p-2">{employee.name}</td>
                            <td className="border-b p-2">{employee.department}</td>
                            <td className="border-b p-2">{employee.designation}</td>
                            <td className="border-b p-2">{employee.joiningDate}</td>
                            <td className="border-b p-2">
                                <button
                                    className={`px-2 py-1 rounded-md ${employee.status === 'Enable' ? 'bg-green-200' : 'bg-red-200'}`}
                                >
                                    {employee.status}
                                </button>
                            </td>
                            <td className="border-b p-2">
                                <button className="p-2 border rounded-md">
                                    ...
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
