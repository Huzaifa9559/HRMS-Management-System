const express = require('express'); // Import express
const department = express.Router(); // Create a router instance
// Import the specific controller
const {
  getDepartment,
  getDepartmentsDetails,
  createDepartment,
  deleteDepartment,
} = require('../../controllers/department');

department.get('/', getDepartment);
department.get('/all', getDepartmentsDetails);
department.post('/create', createDepartment);
department.delete('/delete', deleteDepartment);

module.exports = department; // Export the router
