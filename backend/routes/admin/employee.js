const express = require('express');
const upload = require('../../middlewares/profileImageUpload');
const employee = express.Router();

const {
  getNumberofEmployees,
  getEmployeesDetails,
  updateStatus,
  deleteEmployee,
  getEmployeeDetailByID,
  addEmployee,
  editEmployee,
} = require('../../controllers/employee');

employee.get('/', getNumberofEmployees);
employee.get('/all', getEmployeesDetails);
employee.get('/:id', getEmployeeDetailByID);
employee.post('/update-status', updateStatus);
employee.delete('/delete/:id', deleteEmployee);
employee.post('/create', upload.single('file'), addEmployee);
employee.post('/edit', upload.single('file'), editEmployee);

module.exports = employee;
