const express = require('express');
const employee = express.Router();

const {
  EmployeeDetailsById,
  getEmployeeImageFileName,
  getEmployeeStats,
} = require('../../controllers/employee');

employee.get('/', EmployeeDetailsById);
employee.get('/image', getEmployeeImageFileName);
employee.get('/stats', getEmployeeStats);

module.exports = employee;
