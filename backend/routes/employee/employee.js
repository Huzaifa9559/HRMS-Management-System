const express = require('express'); 
const employee = express.Router();

const { EmployeeDetailsById,getEmployeeImageFileName } =
    require('../../controllers/employee');

employee.get('/', EmployeeDetailsById);
employee.get('/image', getEmployeeImageFileName);

module.exports = employee;