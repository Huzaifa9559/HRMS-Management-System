const { sequelize } = require("../config/sequelizeConfig");
const Sequelize = require('sequelize');
//creating our own custom model without the use of sequelize ORM 
const Leave = {};
// no need to define attributes in sequelize since using Raw SQL queries for DML operations

Leave.getLeaveDetails = async function (employeeId) {
    const query = `
    SELECT leave_fromDate, leave_toDate, leave_reason, leave_type,
    leave_status, leave_filedOn FROM \`Leave\`
    WHERE employeeID = ? AND YEAR(leave_fromDate) = YEAR(CURDATE()) ORDER BY leave_filedOn DESC;`;

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

module.exports = Leave;