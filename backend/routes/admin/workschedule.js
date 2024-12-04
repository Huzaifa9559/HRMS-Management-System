const express = require('express'); // Import express
const workSchedule = express.Router();

const { getAllEmployeesWorkSchedule,editEmployeeWorkSchedule,createNewWorkSchedule } =
    require('../../controllers/workschedule');

workSchedule.get('/:month', getAllEmployeesWorkSchedule);
workSchedule.put(`/:id/:month`, editEmployeeWorkSchedule);
workSchedule.post('/', createNewWorkSchedule);
module.exports = workSchedule; 