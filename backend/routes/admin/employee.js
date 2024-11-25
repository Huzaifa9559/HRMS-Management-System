const express = require('express'); 
const employee = express.Router();

const { getNumberofEmployees,getEmployeesDetails,updateStatus,deleteEmployee,getEmployeeDetailByID } =
    require('../../controllers/employee');

employee.get('/', getNumberofEmployees);
employee.get('/all', getEmployeesDetails);
employee.get('/:id', getEmployeeDetailByID);
employee.post('/update-status',updateStatus);
employee.delete('/delete/:id',deleteEmployee);
module.exports = employee;