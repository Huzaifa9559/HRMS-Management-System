const { sequelize } = require('../config/sequelizeConfig');
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
      type: Sequelize.QueryTypes.SELECT,
    });
    return rows; // Return attendance records for the employee
  } catch (error) {
    console.error('Error fetching employee attendance:', error);
    throw error; // Rethrow the error to be handled in the controller
  }
};

Attendance.setClockIn = async function (employeeId) {
  const checkStatusQuery = `
    SELECT employee_status
    FROM Employee
    WHERE employeeID = ?`;

  const insertAttendanceQuery = `
    INSERT INTO Attendance (employeeID)
    VALUES (?)`;

  try {
    const [statusResult] = await sequelize.query(checkStatusQuery, {
      replacements: [employeeId],
      type: sequelize.QueryTypes.SELECT,
    });

    if (!statusResult || statusResult.employee_status !== 1) {
      throw new Error('Employee is not eligible to clock in.');
    }

    await sequelize.query(insertAttendanceQuery, {
      replacements: [employeeId],
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
      replacements: [data.attendanceDate, data.employeeId],
    });
  } catch (error) {
    console.error(
      `Error updating attendance record for action ${action}:`,
      error
    );
    throw error; // Rethrow the error to be handled in the controller
  }
};

Attendance.getAttendanceByEmployeeIdAndDate = async function (
  employeeId,
  date
) {
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
      type: Sequelize.QueryTypes.SELECT,
    });
    return row; // Return attendance records for the employee on the specified date
  } catch (error) {
    console.error('Error fetching attendance by employee ID and date:', error);
    throw error; // Rethrow the error to be handled in the controller
  }
};

Attendance.getAttendanceByDepartmentId = async function (departmentId) {
  try {
    const query = `
            SELECT 
                a.employeeID AS employeeId,
                CONCAT(e.employee_first_name, ' ', e.employee_last_name) AS employeeName,
                d.designation_name AS designation,
                a.attendance_status AS status
                
            FROM 
                attendance a
            JOIN 
                employee e
            ON 
                a.employeeID = e.employeeID
            LEFT JOIN 
              designation d
            ON d.designationID = e.designationID
            WHERE 
                e.departmentID = ?;`;

    // Execute the query
    const rows = await sequelize.query(query, { replacements: [departmentId] });
    return rows;
  } catch (error) {
    throw new Error(
      'Error fetching attendance data by department ID: ' + error.message
    );
  }
};

Attendance.Attendance_Dashboard = async function () {
  const query = `
        SELECT 
        d.departmentID AS departmentId,
        d.department_name AS departmentName,
        COUNT(CASE WHEN a.attendance_status = 1 THEN 1 END) AS presentCount,
        COUNT(CASE WHEN a.attendance_status = 0 THEN 1 END) AS absentCount
        FROM 
        Department d
        LEFT JOIN 
        Employee e ON d.departmentID = e.departmentID
        LEFT JOIN 
        Attendance a ON e.employeeID = a.employeeID
        GROUP BY 
        d.departmentID, d.department_name
        ORDER BY 
        d.department_name;
    `;

  try {
    const rows = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });
    return rows; // Return attendance data for all employees for the current day
  } catch (error) {
    console.error(
      'Error fetching current attendance data for all employees:',
      error
    );
    throw error; // Rethrow the error to be handled in the controller
  }
};

Attendance.getAttendanceStats = async function (id) {
  const query = `
    SELECT 
     CONCAT(e.employee_first_name, ' ', e.employee_last_name) AS name,
     d.designation_name AS role,
     i.employee_image_fileName AS employee_image,
     SUM(a.attendance_workingHours) AS totalWorkedHours,
    COUNT(CASE WHEN a.attendance_status = 1 THEN 1 END) AS present,
    COUNT(CASE WHEN a.attendance_status = 0 THEN 1 END) AS absent

    FROM attendance a
    LEFT JOIN Employee e ON e.employeeID = a.employeeID
    LEFT JOIN Designation d ON e.designationID = d.designationID
    LEFT JOIN employee_images i ON e.employeeID = i.employeeID
    WHERE a.employeeID=?
    GROUP BY
    a.employeeID;


     `;

  try {
    const rows = await sequelize.query(query, {
      replacements: [id],
      type: Sequelize.QueryTypes.SELECT,
    });
    console.log(rows[0]);
    return rows; // Return attendance records for the employee
  } catch (error) {
    console.error('Error fetching employee attendance:', error);
    throw error; // Rethrow the error to be handled in the controller
  }
};

module.exports = Attendance;
