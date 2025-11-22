const { sequelize } = require('../config/sequelizeConfig');
const Sequelize = require('sequelize');
//creating our own custom model without the use of sequelize ORM
const WorkSchedule = {};
// no need to define attributes in sequelize since using Raw SQL queries for DML operations
WorkSchedule.getWorkScheduleByEmployeeIdMonthDay = async function (
  employeeId,
  month,
  day
) {
  const query = `
    SELECT *
    FROM Work_Schedule 
    WHERE employeeID = ? AND schedule_month = ? AND schedule_day=?;`;

  try {
    const rows = await sequelize.query(query, {
      replacements: [employeeId, month, day],
      type: Sequelize.QueryTypes.SELECT,
    });

    // Return the rows as the schedule, with each row representing a day’s schedule
    return rows;
  } catch (error) {
    console.error('Error fetching work schedule by employee ID:', error);
    throw error; // Rethrow the error to be handled in the controller
  }
};
WorkSchedule.getWorkScheduleByEmployeeId = async function (employeeId, month) {
  const query = `
    SELECT schedule_day, schedule_startTime, schedule_endTime, schedule_worktype 
    FROM Work_Schedule 
    WHERE employeeID = ? AND schedule_month = ?;`;

  try {
    const rows = await sequelize.query(query, {
      replacements: [employeeId, month],
      type: Sequelize.QueryTypes.SELECT,
    });

    // Return the rows as the schedule, with each row representing a day’s schedule
    return rows.map((row) => ({
      day: row.schedule_day,
      startTime: row.schedule_startTime,
      endTime: row.schedule_endTime,
      workType: row.schedule_worktype,
    }));
  } catch (error) {
    console.error('Error fetching work schedule by employee ID:', error);
    throw error; // Rethrow the error to be handled in the controller
  }
};

WorkSchedule.getWorkSchedulesByMonth = async function (month) {
  const query = `
    SELECT employeeID, schedule_day, schedule_startTime, schedule_endTime,
    schedule_worktype FROM Work_Schedule
    WHERE schedule_month = ?;`;

  try {
    const rows = await sequelize.query(query, {
      replacements: [month],
      type: Sequelize.QueryTypes.SELECT,
    });

    // Grouping schedules by employeeID and schedule_week
    const groupedSchedules = rows.reduce((acc, row) => {
      if (!acc[row.employeeID]) {
        acc[row.employeeID] = [];
      }

      // Check if the week already exists in the employee's schedule
      let week = acc[row.employeeID].find((w) => w.week === row.schedule_week);
      if (!week) {
        week = { week: row.schedule_week, days: [] };
        acc[row.employeeID].push(week);
      }

      // Add the day's schedule to the week's days
      week.days.push({
        day: row.schedule_day,
        startTime: row.schedule_startTime,
        endTime: row.schedule_endTime,
        workType: row.schedule_worktype,
      });

      return acc;
    }, {});

    return Object.entries(groupedSchedules).map(([employeeID, schedules]) => ({
      employeeID,
      schedules,
    })); // Convert grouped data to an array of objects
  } catch (error) {
    console.error('Error fetching work schedules by month:', error);
    throw error; // Rethrow the error to be handled in the controller
  }
};

WorkSchedule.updateEmployeeWorkSchedule = async function (
  employeeId,
  schedule,
  month
) {
  const updateQuery = `
    UPDATE Work_Schedule
    SET schedule_startTime = ?, 
        schedule_endTime = ?, 
        schedule_worktype = ?
    WHERE employeeID = ? AND schedule_day = ? AND schedule_month = ?;
    `;

  const transaction = await sequelize.transaction(); // Use a transaction to ensure atomicity
  try {
    for (const day of schedule) {
      const { day: scheduleDay, time, location } = day;

      // Extract start time and end time from the time field (e.g., '10:00:00 - 20:00:00')
      const [startTime, endTime] = time.split(' - ');

      // Update the work schedule for the given day
      const [updateResult] = await sequelize.query(updateQuery, {
        replacements: [
          startTime,
          endTime,
          location, // Map 'location' to 'schedule_worktype'
          employeeId,
          scheduleDay,
          month,
        ],
        type: Sequelize.QueryTypes.UPDATE,
        transaction,
      });

      // If no rows were updated, it means the schedule doesn't exist for this day
      if (updateResult === 0) {
        throw new Error(
          `No existing work schedule found for ${scheduleDay} in ${month}`
        );
      }
    }

    await transaction.commit(); // Commit the transaction
    return { message: 'Work schedule updated successfully' };
  } catch (error) {
    await transaction.rollback(); // Rollback on error
    console.error('Error updating work schedule:', error);
    throw error; // Rethrow the error to be handled by the controller
  }
};

WorkSchedule.createWorkSchedule = async function (employeeId, schedule, month) {
  const insertQuery = `
    INSERT INTO Work_Schedule (employeeID, schedule_day, schedule_startTime, schedule_endTime, schedule_worktype, schedule_month)
    VALUES (?, ?, ?, ?, ?, ?);`;

  const transaction = await sequelize.transaction(); // Use a transaction to ensure atomicity
  try {
    for (const day of schedule) {
      console.log(day);
      const { day: scheduleDay, time, location } = day;
      const [startTime, endTime] = time.split(' - ');

      // Insert the work schedule into the database without the week field
      await sequelize.query(insertQuery, {
        replacements: [
          employeeId,
          scheduleDay,
          startTime,
          endTime,
          location,
          month,
        ],
        type: Sequelize.QueryTypes.INSERT,
        transaction,
      });
    }

    await transaction.commit(); // Commit the transaction
    return { message: 'Work schedule created successfully' };
  } catch (error) {
    await transaction.rollback(); // Rollback on error
    console.error('Error creating work schedule:', error);
    throw error; // Rethrow the error to be handled by the controller
  }
};

module.exports = WorkSchedule;
