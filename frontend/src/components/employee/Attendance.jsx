import React, { useState, useEffect } from 'react';
import Sidebar from './v3';
const styles = {
    container: {
        display: 'flex',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        height: '100vh',
    },
    sidebar: {
        width: '200px',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRight: '1px solid #e0e0e0',
    },
    sidebarItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        cursor: 'pointer',
    },
    sidebarItemActive: {
        backgroundColor: '#e9ecef',
        borderRadius: '5px',
    },
    main: {
        flex: 1,
        padding: '20px',
        backgroundColor: '#fff',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    headerTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    content: {
        backgroundColor: '#f8f9fa',
        borderRadius: '5px',
        padding: '20px',
    },
    checkInSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    checkInButton: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    timer: {
        fontSize: '24px',
        fontWeight: 'bold',
        border: '1px dashed #ccc',
        padding: '10px 20px',
        borderRadius: '5px',
    },
    date: {
        backgroundColor: '#6c757d',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '18px',
    },
    timesheetHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    timesheetTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
    },
    select: {
        padding: '5px',
        marginLeft: '10px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        backgroundColor: '#f8f9fa',
        padding: '10px',
        textAlign: 'left',
        borderBottom: '1px solid #dee2e6',
    },
    td: {
        padding: '10px',
        borderBottom: '1px solid #dee2e6',
    },
    workingHoursNormal: {
        backgroundColor: '#e9ecef',
        borderRadius: '5px',
        padding: '5px',
        display: 'inline-block',
    },
    workingHoursShort: {
        backgroundColor: '#ffc107',
        borderRadius: '5px',
        padding: '5px',
        display: 'inline-block',
    },
};

const sidebarItems = ['Dashboard', 'Attendance', 'Leave', 'Work Schedule', 'Documents', 'Travel'];

const weekData = [
    { date: '04 Sep 2021', checkIn: '8:30', checkOut: '19:30', breakHours: '00:40', workingHours: '11:00' },
    { date: '03 Sep 2021', checkIn: '8:30', checkOut: '19:30', breakHours: '00:40', workingHours: '06:45' },
    { date: '02 Sep 2021', checkIn: '8:30', checkOut: '19:30', breakHours: '00:40', workingHours: '11:00' },
    { date: '01 Sep 2021', checkIn: '8:30', checkOut: '19:30', breakHours: '00:40', workingHours: '11:00' },
    { date: '31 Aug 2021', checkIn: '8:30', checkOut: '19:30', breakHours: '00:40', workingHours: '11:00' },
    { date: '30 Aug 2021', checkIn: '8:30', checkOut: '19:30', breakHours: '00:40', workingHours: '11:00' },
    { date: '29 Aug 2021', checkIn: '8:30', checkOut: '19:30', breakHours: '00:40', workingHours: '11:00' },
];

export default function AttendancePage() {
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval;
        if (isCheckedIn) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isCheckedIn]);

    const handleCheckIn = () => {
        setIsCheckedIn(!isCheckedIn);
        if (isCheckedIn) {
            setTimer(0);
        }
    };

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return [hours, minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .join(":");
    };

    return (
        <div style={styles.container}>
            <div>
                <Sidebar />
            </div>
            <div style={styles.main}>
                <div style={styles.header}>
                    <div style={styles.headerTitle}>Attendance</div>
                    <div>👤</div>
                </div>
                <div style={styles.content}>
                    <div style={styles.checkInSection}>
                        <button style={styles.checkInButton} onClick={handleCheckIn}>
                            {isCheckedIn ? 'Check out' : 'Check in'}
                        </button>
                        <div style={styles.timer}>{formatTime(timer)}</div>
                        <div style={styles.date}>04 September</div>
                    </div>
                    <div style={styles.timesheetHeader}>
                        <div style={styles.timesheetTitle}>Weekly timesheet</div>
                        <div>
                            <select style={styles.select}>
                                <option>Week</option>
                            </select>
                            <select style={styles.select}>
                                <option>2020</option>
                            </select>
                            <button style={{ ...styles.select, cursor: 'pointer' }}>Export</button>
                        </div>
                    </div>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Check in</th>
                                <th style={styles.th}>Check out</th>
                                <th style={styles.th}>Break Hours</th>
                                <th style={styles.th}>Working Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {weekData.map((day, index) => (
                                <tr key={index}>
                                    <td style={styles.td}>{day.date}</td>
                                    <td style={styles.td}>{day.checkIn}</td>
                                    <td style={styles.td}>{day.checkOut}</td>
                                    <td style={styles.td}>{day.breakHours}</td>
                                    <td style={styles.td}>
                                        <span style={day.workingHours === '06:45' ? styles.workingHoursShort : styles.workingHoursNormal}>
                                            {day.workingHours}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}