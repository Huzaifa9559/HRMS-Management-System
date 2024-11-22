const express = require('express'); // Import express
const employee = express.Router();
// Import the specific controller
const { EmployeeDetailsById } =
    require('../controllers/employee');

employee.get('/', EmployeeDetailsById);

module.exports = employee;