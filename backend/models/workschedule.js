const { sequelize } = require("../config/sequelizeConfig");
const Sequelize = require('sequelize');
//creating our own custom model without the use of sequelize ORM 
const WorkSchedule = {};
// no need to define attributes in sequelize since using Raw SQL queries for DML operations

WorkSchedule.getWorkScheduleByEmployeeId = async function (employeeId, month) {
    const query = `
    SELECT schedule_week,schedule_day,schedule_startTime,schedule_endTime,
    schedule_worktype FROM Work_Schedule
    WHERE employeeID = ? AND schedule_month=? 
    ORDER BY schedule_week ASC;`;

    try {
        const rows = await sequelize.query(query, {
            replacements: [employeeId, month],
            type: Sequelize.QueryTypes.SELECT
        });
        
        // Grouping the rows by schedule_week
        const groupedSchedule = rows.reduce((acc, row) => {
            const week = row.schedule_week;
            if (!acc[week]) {
                acc[week] = { week, days: [] }; // Initialize week object
            }
            acc[week].days.push({
                day: row.schedule_day,
                startTime: row.schedule_startTime,
                endTime: row.schedule_endTime,
                workType: row.schedule_worktype
            });
            return acc;
        }, {});

        return Object.values(groupedSchedule); // Return array of week objects
    } catch (error) {
        console.error('Error fetching work schedule by employee ID:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

module.exports = WorkSchedule;

