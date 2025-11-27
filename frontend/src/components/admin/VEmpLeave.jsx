import React, { useState, useEffect } from 'react';
import SideMenu from './SideMenu';
import Header from './Header';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Bell, User } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Loader';
import { getImageUrl } from '../../utils/imageUtils';

export default function LeaveManagement() {
  const { leaveID, employeeId } = useParams();
  const [employeeData, setEmployeeData] = useState([]);
  const [leaveStats, setLeaveStats] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [leaveData, setLeaveData] = useState([]);
  const [done, setDone] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Making the three API calls
        const [employeeResponse, leaveResponse, leaveStatsResponse] =
          await Promise.all([
            axios.get(`/api/admin/employee/${employeeId}`),
            axios.get(`/api/admin/leave/${leaveID}`),
            axios.get(`/api/admin/leave/stats/${employeeId}`),
          ]);
        // Set the state with the fetched data
        setEmployeeData(employeeResponse.data.data);
        setLeaveData(leaveResponse.data.data);
        setLeaveStats(leaveStatsResponse.data.data);
      } catch (error) {
        toast.error('Error fetching data.', { position: 'top-right' });
      } finally {
        setLoading(false); // Stop the loading spinner once the data is fetched
      }
    };

    fetchData();
  }, [employeeId, leaveID]);

  // Handle Accept Leave Request
  const handleAcceptLeave = async () => {
    try {
      await axios.post(`/api/admin/leave/accept/${leaveID}`);
      toast.success('Leave request accepted!', { position: 'top-right' });
      setDone(false);
    } catch (error) {
      toast.error('Failed to accept leave request.', { position: 'top-right' });
    }
  };

  // Handle Reject Leave Request
  const handleRejectLeave = async () => {
    try {
      await axios.post(`/api/admin/leave/reject/${leaveID}`);
      toast.success('Leave request rejected!', { position: 'top-right' });
      setDone(false);
    } catch (error) {
      toast.error('Failed to reject leave request.', { position: 'top-right' });
    }
  };
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  const imageURL = employeeData.employee_image
    ? getImageUrl(employeeData.employee_image, backendURL)
    : null;
  const isProcessed = () => {
    if (leaveData.leave_status === 0) {
      return true;
    } else {
      return false;
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div
      className="d-flex"
      style={{
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <SideMenu />
      <div
        className="flex-grow-1 d-flex flex-column p-3"
        style={{ overflowY: 'auto' }}
      >
        <Header title="Leave Management">
          <div className="d-flex align-items-center gap-3">
            <Bell className="icon-sm text-gray-500" />
            <User className="icon-lg text-gray-500 bg-gray-200 rounded-circle p-1" />
          </div>
        </Header>

        <ToastContainer />

        <div className="container mt-0">
          <h4 className="mb-4">Leave Details</h4>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm p-4">
                {/* Reduced padding */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <img
                    src={imageURL}
                    alt="Employee"
                    className="img-fluid mb-2" /* Reduced margin */
                    style={{
                      width: '80px', // Adjusted image size
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <h5 className="text-center mb-1">{employeeData.name}</h5>
                <p className="text-center text-muted">
                  {employeeData.designation_name}
                </p>
                <div className="mt-4">
                  {/* Current Month Leave Card */}
                  <div
                    className="text-center p-4 rounded mb-4"
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                      flex: '1',
                      maxWidth: '220px',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow =
                        '0 6px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 8px rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        width: '120px',
                        height: '120px',
                        background: 'rgba(255, 182, 193, 0.2)', // Pink
                        borderRadius: '50%',
                        transform: 'translate(50%, -50%)',
                      }}
                    ></div>
                    <p
                      className="mb-1"
                      style={{
                        color: '#475569',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      Current Month's Leave
                    </p>
                    <strong
                      style={{
                        color: '#1e293b',
                        fontSize: '24px',
                        fontWeight: '600',
                      }}
                    >
                      {leaveStats.currentMonthLeave}
                    </strong>
                  </div>

                  {/* Current Year Leave Card */}
                  <div
                    className="text-center p-4 rounded"
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                      flex: '1',
                      maxWidth: '220px',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow =
                        '0 6px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 8px rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        width: '120px',
                        height: '120px',
                        background: 'rgba(144, 238, 144, 0.2)', // Green
                        borderRadius: '50%',
                        transform: 'translate(50%, -50%)',
                      }}
                    ></div>
                    <p
                      className="mb-1"
                      style={{
                        color: '#475569',
                        fontSize: '14px',
                        fontWeight: '500',
                      }}
                    >
                      Current Year's Leave
                    </p>
                    <strong
                      style={{
                        color: '#1e293b',
                        fontSize: '24px',
                        fontWeight: '600',
                      }}
                    >
                      {leaveStats.currentYearLeave}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Leave Details and Employee Details */}
            <div className="col-md-9 d-flex flex-column">
              {/* Leave Request Card */}
              <div
                className="card border-0 shadow-sm p-3 mb-2"
                style={{
                  flex: 1,
                }}
              >
                <h5 className="mb-2">Leave Request</h5>
                <table
                  className="table table-borderless mb-0"
                  style={{ fontSize: '14px' }}
                >
                  <tbody>
                    <tr>
                      <td className="text-muted" style={{ width: '30%' }}>
                        Leave Type
                      </td>
                      <td>{leaveData.leave_type}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Leave Date</td>
                      <td>{leaveData.leave_fromDate}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Days</td>
                      <td>{leaveData.days}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Reason</td>
                      <td>{leaveData.leave_reason}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Employee Details Card */}
              <div
                className="card border-0 shadow-sm p-3 mb-2"
                style={{
                  flex: 1,
                }}
              >
                <h5 className="mb-2">Employee Details</h5>
                <table
                  className="table table-borderless mb-0"
                  style={{ fontSize: '14px' }}
                >
                  <tbody>
                    <tr>
                      <td className="text-muted" style={{ width: '30%' }}>
                        Employee ID
                      </td>
                      <td>{employeeData.employeeID}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Phone Number</td>
                      <td>{employeeData.employee_phonenumber}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Designation</td>
                      <td>{employeeData.designation_name}</td>
                    </tr>
                    <tr>
                      <td className="text-muted">Address</td>
                      <td>
                        {employeeData.street_address}, {employeeData.city},{' '}
                        {employeeData.country}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted">Zip Code</td>
                      <td>{employeeData.zip_code}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Action Buttons */}
              {isProcessed() && done && (
                <div
                  className="d-flex justify-content-end gap-2 p-1"
                  style={{
                    flex: 1,

                    alignItems: 'center',
                  }}
                >
                  <button
                    className="btn btn-danger w-20"
                    onClick={handleRejectLeave}
                  >
                    Reject
                  </button>

                  <button
                    className="btn btn-primary w-20"
                    onClick={handleAcceptLeave}
                  >
                    Accept
                  </button>
                </div>
              )}
              ;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
