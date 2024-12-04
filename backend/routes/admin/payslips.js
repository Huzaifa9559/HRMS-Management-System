const express = require('express'); // Import express
const payslip = express.Router(); // Create a router instance
const upload = require('../../middlewares/payslipsUpload');

const { getAllEmployeesPayslips, downloadPayslip,uploadPayslip } =
    require('../../controllers/payslips');

payslip.get('/', getAllEmployeesPayslips);
payslip.get('/download/:payslipId', downloadPayslip);
payslip.post('/uploadPayslip', upload.single('file'), uploadPayslip);

module.exports = payslip; // Export the router