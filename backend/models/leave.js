const { sequelize } = require("../config/sequelizeConfig");
const Sequelize = require('sequelize');
//creating our own custom model without the use of sequelize ORM 
const Leave = {};
// no need to define attributes in sequelize since using Raw SQL queries for DML operations

Leave.getLeaveDetails = async function (employeeId) {
    const query = `
    SELECT leave_fromDate, leave_toDate, leave_reason, leave_type,
    leave_status, leave_filedOn FROM \`Leave\`
    WHERE employeeID = ? ORDER BY leave_filedOn DESC;`;

    try {
        const rows = await sequelize.query(query, {
            replacements: [employeeId],
            type: Sequelize.QueryTypes.SELECT
        });
        return rows; // Return leave record for the employee
    } catch (error) {
        console.error('Error fetching leave details:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

Leave.setLeaveRequest = async function (leaveData) {
    const query = `
    INSERT INTO \`Leave\` (employeeID, leave_fromDate, leave_toDate, leave_reason,
    leave_type,leave_status,leave_filedOn)
    VALUES (?, ?, ?, ?, ?,0,CURRENT_DATE());`;
    try {
        await sequelize.query(query, {
            replacements: [leaveData.employeeId, leaveData.fromDate,
            leaveData.toDate, leaveData.leave_reason, leaveData.leavetype]
        });
    } catch (error) {
        console.error('Error creating leave request:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

Leave.getAllLeaveDetails = async function () {
    const query = `
   SELECT 
    CONCAT(e.employee_first_name, ' ', e.employee_last_name) AS employee_name,
    e.employeeID,
    d.department_name,
    l.leave_status,
    l.leave_fromDate AS leave_from,
    l.leave_toDate AS leave_to,
    l.leave_type AS leave_type,
    l.leaveID,
    l.leave_reason AS reason,
    DATEDIFF(l.leave_toDate, l.leave_fromDate) AS days -- Calculates the difference in days
    FROM 
        \`Leave\` l
    JOIN 
        Employee e ON l.employeeID = e.employeeID
    JOIN 
        Department d ON d.departmentID = e.departmentID
    ORDER BY 
        l.leave_filedOn DESC;
    `;

    try {
        const rows = await sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT
        });
        return rows; 
    } catch (error) {
        console.error('Error fetching leave details:', error);
        throw error; 
    }
};

Leave.getLeaveDetailsByLeaveId = async function (leaveId) {
    const query = `
    SELECT leave_fromDate, leave_toDate, leave_reason, leave_type,
    leave_status, leave_filedOn, employeeID, DATEDIFF(leave_toDate, leave_fromDate) AS days
    FROM \`Leave\`
    WHERE leaveID = ?;`;

    try {
        const rows = await sequelize.query(query, {
            replacements: [leaveId],
            type: Sequelize.QueryTypes.SELECT
        });

        // Return the leave details if found, or null if no record is found
        if (rows.length > 0) {
            return rows[0];
        } else {
            return null; // No leave details found for the provided leaveId
        }
    } catch (error) {
        console.error('Error fetching leave details by leaveId:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

Leave.getEmployeeLeaveStatistics = async function (employeeId) {
    const query = `
    SELECT 
        COUNT(*) AS total_leave_requests,
        SUM(CASE WHEN leave_status = 1 THEN 1 ELSE 0 END) AS approved_leave,
        SUM(CASE WHEN leave_status = 2 THEN 1 ELSE 0 END) AS rejected_leave,
        SUM(CASE WHEN leave_status = 0 THEN 1 ELSE 0 END) AS pending_leave,
        DATEDIFF(CURDATE(), MAX(leave_filedOn)) AS days_since_last_leave,
        SUM(CASE WHEN MONTH(leave_fromDate) = MONTH(CURDATE()) THEN 1 ELSE 0 END) AS currentMonthLeave,
        SUM(CASE WHEN YEAR(leave_fromDate) = YEAR(CURDATE()) THEN 1 ELSE 0 END) AS currentYearLeave
    FROM \`Leave\`
    WHERE employeeID = ?;`;

    try {
        const rows = await sequelize.query(query, {
            replacements: [employeeId],
            type: Sequelize.QueryTypes.SELECT
        });

        // Return the statistics if found, or null if no record is found
        if (rows.length > 0) {
            return rows[0]; // Return the statistics for the employee
        } else {
            return null; // No leave statistics found for the provided employeeId
        }
    } catch (error) {
        console.error('Error fetching employee leave statistics:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

Leave.updateLeaveStatus = async function (leaveId, status) {
    const query = `
    UPDATE \`Leave\`
    SET leave_status = ?
    WHERE leaveID = ?;`;

    try {
        const [updatedRows] = await sequelize.query(query, {
            replacements: [status, leaveId],
        });

        // Return the number of rows affected
        return updatedRows; 
    } catch (error) {
        console.error('Error updating leave status:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

module.exports = Leave;