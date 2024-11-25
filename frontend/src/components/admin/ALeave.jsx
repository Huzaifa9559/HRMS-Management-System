import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import SideMenu from './SideMenu';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';

const LeaveManagement = () => {
  const [leaveData, setLeaveData] = useState([]); // State for leave data
  const [filter, setFilter] = useState('All'); // Tracks the current filter
  const [loading, setLoading] = useState(true); // Loading state
  const [currentPage, setCurrentPage] = useState(1); // Pagination current page
  const itemsPerPage = 5; // Number of items per page
  const navigate = useNavigate();

  // Fetch leave data from API
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await axios.get('/api/admin/leave'); // Replace with your API endpoint
        setLeaveData(response.data.data); // Set the fetched data
      } catch (error) {
        console.error('Error fetching leave data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, []);

  // Map numeric leave_status to meaningful labels
  const mapLeaveStatus = (status) => {
    switch (status) {
      case 1:
        return 'Approved';
      case 2:
        return 'Rejected';
      case 0:
      default:
        return 'Pending';
    }
  };

  // Add a mapped status to leave data for easy filtering
  const processedLeaveData = leaveData.map((leave) => ({
    ...leave,
    leave_status_label: mapLeaveStatus(leave.leave_status),
  }));

  // Filtered leave data based on the selected filter
  const filteredLeaveData = processedLeaveData.filter((leave) => {
    if (filter === 'All') return true;
    return leave.leave_status_label === filter;
  });

  // Paginated data
  const totalPages = Math.ceil(filteredLeaveData.length / itemsPerPage);
  const paginatedData = filteredLeaveData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) {
    return <Loader />;
  }

  // Function to apply Bootstrap classes based on the status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-success text-white'; // Green for Approved
      case 'Rejected':
        return 'bg-danger text-white'; // Red for Rejected
      case 'Pending':
      default:
        return 'bg-warning text-dark'; // Yellow for Pending
    }
  };

  return (
    <>
      <style>
        {`
          .leave-management-table tr.hoverable-row {
            transition: background-color 0.3s ease;
          }

          .leave-management-table tr.hoverable-row:hover {
            background-color: #f8f9fa !important;
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
            {/* Button Group */}
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
              <button
                className={`leave-button ${filter === 'Pending' ? 'active' : ''}`}
                onClick={() => setFilter('Pending')}
              >
                Pending
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow p-6">
              <table className="table leave-management-table">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Applied On</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((leave, index) => (
                    <tr key={index} className="hoverable-row">
                      <td>{leave.employee_name}</td>
                      <td>{leave.department_name}</td>
                      <td>
                        <span className={`px-3 py-1 rounded ${getStatusColor(leave.leave_status_label)}`}>
                          {leave.leave_status_label}
                        </span>
                      </td>
                      <td>{leave.leave_from}</td>
                      <td>
                        <button
                          className="btn btn-link"
                          onClick={() => navigate(`/admin/view-employee-leave/${leave.leaveID}/${leave.employeeID}`)}
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="d-flex justify-content-center align-items-center mt-4" style={{ gap: '15px' }}>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="text-muted">Page {currentPage} of {totalPages}</span>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default LeaveManagement;
