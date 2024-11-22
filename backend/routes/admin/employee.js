const express = require('express'); 
const employee = express.Router();

const { getNumberofEmployees,getEmployeesDetails } =
    require('../../controllers/employee');

employee.get('/', getNumberofEmployees);
employee.get('/all', getEmployeesDetails);
module.exports = employee;