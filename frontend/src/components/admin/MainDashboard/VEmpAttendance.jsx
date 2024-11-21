import React, { useState, useEffect } from 'react';
import SideMenu from './SideMenu';
import Header from './Header';
import Loader from '../../Loader';

export default function DashboardLayout() {
    const [year, setYear] = useState('Select Year');
    const [month, setMonth] = useState('Select Month');
    const [loading, setLoading] = useState(true); // Loading state
    const [filteredAttendanceData, setFilteredAttendanceData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Show 5 items per page

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1250); // Simulate loading
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        filterAttendanceData();
    }, [year, month]);

    const filterAttendanceData = () => {
        let filtered = [...attendanceData];

        if (year !== 'Select Year') {
            filtered = filtered.filter(item => {
                const itemYear = item.date.split('-')[2];
                return itemYear === year;
            });
        }

        if (month !== 'Select Month') {
            filtered = filtered.filter(item => {
                const itemMonth = parseInt(item.date.split('-')[1]);
                const selectedMonthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;
                return itemMonth === selectedMonthIndex;
            });
        }

        setFilteredAttendanceData(filtered);
    };

    const employeeData = {
        name: 'Kaiya Schleifer',
        role: 'UI UX Designer',
        avatar: 'https://www.lensmen.ie/wp-content/uploads/2015/02/Profile-Portrait-Photographer-in-Dublin-Ireland..jpg',
        present: '04 Days',
        absent: '04 Days',
        totalWorkedHours: '256 hours',
    };

    const attendanceData = [
        { date: '01-08-2021', day: 'Monday', status: 'Present', clockIn: '10:00 AM', clockOut: '06:30 PM', workingHrs: '08h 30min', totalBreak: '00:30 min' },
        { date: '02-08-2021', day: 'Monday', status: 'Present', clockIn: '10:00 AM', clockOut: '06:30 PM', workingHrs: '04h 30min', totalBreak: '2h 30min' },
        { date: '03-08-2021', day: 'Monday', status: 'Present', clockIn: '10:00 AM', clockOut: '06:30 PM', workingHrs: '08:30 PM', totalBreak: '1h 20min' },
        { date: '04-08-2021', day: 'Monday', status: 'Absent', clockIn: '-', clockOut: '-', workingHrs: '-', totalBreak: '-' },
        { date: '05-08-2021', day: 'Monday', status: 'Present', clockIn: '10:00 AM', clockOut: '06:30 PM', workingHrs: '08:30 PM', totalBreak: '0h 30min' },
        { date: '05-08-2021', day: 'Monday', status: 'Present', clockIn: '10:00 AM', clockOut: '06:30 PM', workingHrs: '08:30 PM', totalBreak: '0h 30min' },
        { date: '05-08-2021', day: 'Monday', status: 'Present', clockIn: '10:00 AM', clockOut: '06:30 PM', workingHrs: '08:30 PM', totalBreak: '0h 30min' },
        { date: '05-08-2021', day: 'Monday', status: 'Present', clockIn: '10:00 AM', clockOut: '06:30 PM', workingHrs: '08:30 PM', totalBreak: '0h 30min' },
    ];

    // Pagination logic
    const totalPages = Math.ceil(filteredAttendanceData.length / itemsPerPage);
    const currentItems = filteredAttendanceData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    if (loading) {
        return <Loader />;
    }

    return (
        <div
            className="d-flex"
            style={{
                background: 'linear-gradient(to bottom, #f9f9f9, #eef2f7)',
                minHeight: '100vh',
                overflow: 'hidden',
            }}
        >
            <SideMenu />
            <div className="flex-grow-1 d-flex flex-column p-3" style={{ overflowY: 'auto' }}>
                <Header title="Attendance" style={{ marginBottom: '20px' }} />
                <main style={{ padding: '20px', overflowY: 'auto' }}>
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                            {/* Employee Report Title */}
                            <h2 className="h5 mb-3">Employee Report</h2>

                            {/* Dropdowns on the top right */}
                            <div className="d-flex gap-2">
                                <select
                                    className="form-select"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    style={{
                                        width: '100px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        padding: '4px 8px',
                                        fontSize: '14px',
                                    }}
                                >
                                    <option value="Select Year">Year</option>
                                    <option value="2021">2021</option>
                                    <option value="2022">2022</option>
                                    <option value="2023">2023</option>
                                </select>
                                <select
                                    className="form-select"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    style={{
                                        width: '100px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        padding: '4px 8px',
                                        fontSize: '14px',
                                    }}
                                >
                                    <option value="Select Month">Month</option>
                                    <option value="January">January</option>
                                    <option value="February">February</option>
                                    <option value="March">March</option>
                                    <option value="April">April</option>
                                    <option value="May">May</option>
                                    <option value="June">June</option>
                                    <option value="July">July</option>
                                    <option value="August">August</option>
                                    <option value="September">September</option>
                                    <option value="October">October</option>
                                    <option value="November">November</option>
                                    <option value="December">December</option>
                                </select>
                            </div>
                        </div>

                        <div
                            className="d-flex justify-content-between align-items-center bg-white p-4 rounded shadow-sm"
                            style={{ gap: '1rem' }}
                        >
                            {/* Employee Avatar and Details */}
                            <div className="d-flex align-items-center">
                                <img
                                    src={employeeData.avatar}
                                    alt={employeeData.name}
                                    className="rounded-circle me-3"
                                    style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                                />
                                <div>
                                    <h3
                                        className="h6 mb-0"
                                        style={{
                                            fontWeight: '600',
                                            color: '#1e293b',
                                            fontSize: '16px',
                                        }}
                                    >
                                        {employeeData.name}
                                    </h3>
                                    <p
                                        className="text-muted mb-0"
                                        style={{
                                            fontSize: '14px',
                                            marginTop: '4px',
                                        }}
                                    >
                                        {employeeData.role}
                                    </p>
                                </div>
                            </div>

                            {/* Cards */}
                            <div className="d-flex gap-4" style={{ flex: 1, justifyContent: 'center' }}>
                                {[
                                    {
                                        label: 'Present',
                                        value: employeeData.present,
                                        color: 'rgba(144, 238, 144, 0.2)', // Green
                                    },
                                    {
                                        label: 'Absent',
                                        value: employeeData.absent,
                                        color: 'rgba(255, 182, 193, 0.2)', // Pink
                                    },
                                    {
                                        label: 'Total Worked Hours',
                                        value: employeeData.totalWorkedHours,
                                        color: 'rgba(173, 216, 230, 0.2)', // Blue
                                    },
                                ].map((card, index) => (
                                    <div
                                    key={index}
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
                                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.05)';
                                    }}
                                >

                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '0',
                                                right: '0',
                                                width: '120px',
                                                height: '120px',
                                                background: card.color,
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
                                            {card.label}
                                        </p>
                                        <strong
                                            style={{
                                                color: '#1e293b',
                                                fontSize: '24px',
                                                fontWeight: '600',
                                            }}
                                        >
                                            {card.value}
                                        </strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Attendance Report Section */}
                    <div>
                        <h2 className="h5 mb-3">Attendance Report</h2>
                        <div
                            className="bg-white rounded shadow-sm"
                            style={{ overflowX: 'auto', borderRadius: '12px' }}
                        >
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Day</th>
                                        <th>Status</th>
                                        <th>Clock In</th>
                                        <th>Clock Out</th>
                                        <th>Working Hrs</th>
                                        <th>Total Break</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map((row, index) => (
                                            <tr key={index}>
                                                <td>{row.date}</td>
                                                <td>{row.day}</td>
                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            row.status === 'Present' ? 'bg-success' : 'bg-danger'
                                                        }`}
                                                        style={{
                                                            padding: '5px 10px',
                                                            fontWeight: 'normal',
                                                        }}
                                                    >
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td>{row.clockIn}</td>
                                                <td>{row.clockOut}</td>
                                                <td>{row.workingHrs}</td>
                                                <td>{row.totalBreak}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">
                                                No attendance records found for the selected period
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                className={`btn btn-sm ${
                                    currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'
                                } rounded-circle mx-1`}
                                onClick={() => handlePageChange(index + 1)}
                                style={{ width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    </div>

                </main>
            </div>
        </div>
    );
}
