'use strict';
module.exports = {
  async up(queryInterface, _Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE EVENT check_employee_attendance
      ON SCHEDULE EVERY 1 DAY
      STARTS CURRENT_TIMESTAMP
      DO
      BEGIN
          INSERT IGNORE INTO Attendance (
              attendance_date,
              attendance_status,
              employeeID,
              attendance_clockIn,
              attendance_clockOut,
              attendance_workingHours,
              attendance_totalBreak
          )
          SELECT 
              CURRENT_DATE,         -- Today's date
              0,                    -- Absent status
              ws.employeeID,        -- Employee ID
              NULL,                 -- No clock-in
              NULL,                 -- No clock-out
              0,                    -- No working hours
              0                     -- No breaks
          FROM Work_Schedule ws
          WHERE ws.schedule_day = DAYNAME(CURRENT_DATE) 
          AND ws.schedule_month=MONTHNAME(CURRENT_DATE)
          AND NOT EXISTS (
                SELECT 1
                FROM Attendance a
                WHERE a.attendance_date = CURRENT_DATE
                  AND a.employeeID = ws.employeeID
            );
      END;
    `);
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.sequelize.query(`
      DROP EVENT IF EXISTS check_employee_attendance;
    `);
  },
};
