const { sequelize } = require("../config/sequelizeConfig");
const Sequelize = require('sequelize');
//creating our own custom model without the use of sequelize ORM 
const Attendance = {};
// no need to define attributes in sequelize since using Raw SQL queries for DML operations


Attendance.getAttendanceByEmployeeId = async function (employeeId) {
    const query = `
    SELECT 
        attendance_date, 
        attendance_status, 
        attendance_clockIn, 
        attendance_clockOut, 
        attendance_workingHours, 
        attendance_totalBreak 
    FROM Attendance
    WHERE employeeID = ? 
    ORDER BY attendance_date DESC;`;

    try {
        const rows = await sequelize.query(query, {
            replacements: [employeeId],
            type: Sequelize.QueryTypes.SELECT
        });
        return rows; // Return attendance records for the employee
    } catch (error) {
        console.error('Error fetching employee attendance:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

Attendance.setClockIn = async function (employeeId) {
    const query = `
    INSERT INTO Attendance (employeeID)
    VALUES (?)`;

    try {
        await sequelize.query(query, {
            replacements: [employeeId]
        });
    } catch (error) {
        console.error('Error creating attendance record:', error);
        throw error;
    }
};


Attendance.setAttendanceAction = async function (action, data) {
    let query;
    switch (action) {
        case 'breakIn':
            query = `
            UPDATE Attendance
            SET attendance_breakIn = CURRENT_TIME
            WHERE attendance_date = STR_TO_DATE(?, '%Y-%m-%d') AND employeeID = ?;`;
            break;
        case 'breakOut':
            query = `
            UPDATE Attendance
            SET attendance_breakOut = CURRENT_TIME,
            attendance_totalBreak = attendance_totalBreak + (attendance_breakOut-attendance_breakIn)
            WHERE attendance_date = STR_TO_DATE(?, '%Y-%m-%d') AND employeeID = ?;`;
            break;
        case 'clockOut':
            query = `
            UPDATE Attendance
            SET 
                attendance_status = 1,
                attendance_clockOut = CURRENT_TIME,
                attendance_workingHours=(attendance_clockOut-attendance_clockIn) - (attendance_totalBreak)
            WHERE attendance_date = STR_TO_DATE(?, '%Y-%m-%d') AND employeeID = ? ;`;
            break;
        default:
            throw new Error('Invalid action type');
    }

    try {
        await sequelize.query(query, {
            replacements: [data.attendanceDate, data.employeeId]
        });
    } catch (error) {
        console.error(`Error updating attendance record for action ${action}:`, error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

Attendance.getAttendanceByEmployeeIdAndDate = async function (employeeId, date) {
    const query = `
    SELECT 
        attendance_date, 
        attendance_status, 
        attendance_clockIn, 
        attendance_clockOut, 
        attendance_workingHours, 
        attendance_totalBreak 
    FROM Attendance
    WHERE employeeID = ? AND attendance_date = STR_TO_DATE(?, '%Y-%m-%d');`;

    try {
        const [row] = await sequelize.query(query, {
            replacements: [employeeId, date],
            type: Sequelize.QueryTypes.SELECT
        });
        return row; // Return attendance records for the employee on the specified date
    } catch (error) {
        console.error('Error fetching attendance by employee ID and date:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

module.exports = Attendance;
