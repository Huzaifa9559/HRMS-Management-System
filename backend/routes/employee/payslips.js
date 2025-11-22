const express = require('express'); // Import express
const payslip = express.Router(); // Create a router instance

const {
  getEmployeePayslipDetails,
  downloadPayslip,
} = require('../../controllers/payslips');

payslip.get('/:year', getEmployeePayslipDetails);
payslip.get('/download/:payslipId', downloadPayslip);

module.exports = payslip; // Export the router
