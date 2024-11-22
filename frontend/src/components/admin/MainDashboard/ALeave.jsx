import React, { useState, useEffect } from 'react';
import Header from './Header';
import SideMenu from './SideMenu';
import { Eye } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Loader from '../../Loader';

const LeaveManagement = () => {
  const [leaveData] = useState([
    { employee: 'Randy Aminoff', department: 'Mobile App', from: '04 Sep 2021 to 05 Sep 2021', type: 'Unpaid Leave', reason: 'Lorem ipsum is a placeholder text commonly used to ...', status: 'Pending' },
    { employee: 'Jane Doe', department: 'Web Development', from: '06 Sep 2021 to 07 Sep 2021', type: 'Paid Leave', reason: 'For personal matters.', status: 'Approved' },
    { employee: 'John Smith', department: 'Marketing', from: '08 Sep 2021 to 09 Sep 2021', type: 'Sick Leave', reason: 'Medical reasons.', status: 'Rejected' },
    { employee: 'Alice Johnson', department: 'Mobile App', from: '10 Sep 2021 to 12 Sep 2021', type: 'Unpaid Leave', reason: 'Family emergency.', status: 'Approved' },
    { employee: 'Bob Brown', department: 'Design', from: '13 Sep 2021 to 15 Sep 2021', type: 'Paid Leave', reason: 'Vacation.', status: 'Pending' },
  ]);

  const [filter, setFilter] = useState('All'); // Tracks the current filter
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  // Filtered leave data based on the selected filter
  const filteredLeaveData = leaveData.filter((leave) => {
    if (filter === 'All') return true;
    return leave.status === filter;
  });

  if (loading) {
    return <Loader />;
  }
  
  return (
    <>
      <style>
        {`
          .leave-management-table tr.hoverable-row {
            transition: background-color 0.3s ease;
            }

            .leave-management-table tr.hoverable-row:hover {
            background-color: #f8f9fa !important; /* Ensure the background color is applied */
            cursor: pointer;
            }

          .leave-button {
            padding: 8px 16px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            background-color: transparent;
            color: #6b7280;
            font-weight: normal;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.3s ease, color 0.3s ease;
          }

          .leave-button.active {
            background-color: #3b82f6;
            color: white;
            font-weight: normal;
            border: 1px solid #3b82f6;
          }
        `}
      </style>
      <div className="d-flex" style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', overflow: 'hidden' }}>
        <SideMenu />
        <div className="flex-grow-1 d-flex flex-column p-3" style={{ overflowY: 'auto' }}>
          <Header title="Leave Management" />
          <main style={{ padding: '20px' }}>
            {/* Button Group at the top-left under the header */}
            <div className="d-flex justify-content-start align-items-center mb-4" style={{ gap: '15px' }}>
              <button
                className={`leave-button ${filter === 'All' ? 'active' : ''}`}
                onClick={() => setFilter('All')}
              >
                Leave Requests
              </button>
              <button
                className={`leave-button ${filter === 'Approved' ? 'active' : ''}`}
                onClick={() => setFilter('Approved')}
              >
                Approved
              </button>
              <button
                className={`leave-button ${filter === 'Rejected' ? 'active' : ''}`}
                onClick={() => setFilter('Rejected')}
              >
                Rejected
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow p-6">
              <table className="table leave-management-table">
                <thead className="table-light">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Departments</th>
                    <th className="px-4 py-3">From</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">View</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaveData.map((leave, index) => (
                    <tr key={index} className="hoverable-row">
                      <td className="px-4 py-3">{leave.employee}</td>
                      <td className="px-4 py-3">{leave.department}</td>
                      <td className="px-4 py-3">{leave.from}</td>
                      <td className="px-4 py-3">{leave.type}</td>
                      <td className="px-4 py-3">{leave.reason}</td>
                      <td className="px-4 py-3">
                      <button
                        className="btn btn-link"
                        onClick={() => navigate("/admin/view-employee-leave")}
                      >
                        <Eye className="h-5 w-5" />
                      </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default LeaveManagement;
