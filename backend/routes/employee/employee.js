const express = require('express'); 
const employee = express.Router();

const { EmployeeDetailsById } =
    require('../../controllers/employee');

employee.get('/', EmployeeDetailsById);

module.exports = employee;