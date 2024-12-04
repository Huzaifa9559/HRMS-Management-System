const express = require('express'); // Import express
const department = express.Router(); // Create a router instance
// Import the specific controller
const {  getDepartment } =
    require('../../controllers/department');

department.get('/', getDepartment);

module.exports = department; // Export the router
