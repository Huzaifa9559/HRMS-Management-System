const express = require('express'); // Import express
const workSchedule = express.Router();

const { getEmployeeWorkSchedule } =
    require('../../controllers/workschedule');

workSchedule.get('/:month', getEmployeeWorkSchedule);

module.exports = workSchedule; 