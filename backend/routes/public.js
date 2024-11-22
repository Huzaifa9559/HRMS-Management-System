const express = require('express'); // Import express
const public = express.Router(); // Create a router instance
// Import the specific controller
const { getDepartment } = require('../controllers/department');
const { getDesignation } = require('../controllers/designation');

public.get('/department', getDepartment);
public.get('/designation', getDesignation);

module.exports = public; // Export the router
