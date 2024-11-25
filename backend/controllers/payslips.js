const Payslip = require('../models/payslips'); // Import the myDocuments model
const { getUser } = require('../service/auth'); // Import setUser function
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');
const { extractToken } = require('../utils/authUtil'); // Import the extractToken function
const path = require('path');
const fs = require('fs');
const { sequelize } = require("../config/sequelizeConfig");

exports.getEmployeePayslipDetails = async (req, res) => {
    const year = req.params.year; // Get payslip ID from request parameters
    const token = extractToken(req, res);
    if (!token) return;
    try {
        const payload = getUser(token);
        const payslip = await Payslip.getEmployeePayslips(payload._id, year); // Fetch payslip details from the database
        if (!payslip) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Payslip not found');
        }
        return sendResponse(res, httpStatus.OK, payslip, 'Payslip details retrieved successfully');
    } catch (error) {
        console.error('Error fetching payslip details:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching payslip details', error.message);
    }
};

exports.downloadPayslip = async (req, res) => {
    const payslipId = req.params.payslipId;

    // Fetch the document details from the database using the documentId
    const payslip = await Payslip.getPayslipfileNameById(payslipId); // Fetch document details
    if (!payslip[0].payslip_fileName) {
        return res.status(404).send('Document not found');
    }

    const filePath = path.join(__dirname, '../uploads/payslips', payslip[0].payslip_fileName); // Use the fileName from the document
    res.setHeader('Content-Disposition', `attachment; filename="${payslip[0].payslip_fileName}"`);
    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }
        res.download(filePath, (err) => {
            if (err) {
                res.status(500).send('Error downloading the file');
            }
        });
    });
};

exports.uploadPayslip = async (req, res) => {
 const { employeeId, payslipYear,payslipMonth} = req.body;
    const file = req.file;

    // Check if all fields are present
    if (!employeeId || !payslipMonth  || !file || !payslipYear) {
        return sendResponse(res, httpStatus.BAD_REQUEST, null, 'All fields are required');
    }

    try {
        // Create a new document entry in the database
        const newDoc = {
            employeeId: employeeId,
            year: payslipYear,
            month:payslipMonth,
            fileName: file.filename, // Save the original file name
            uploadedAt: new Date(),
        };

        await sequelize.query(
            `INSERT INTO Payslip
            (employeeID, payslip_year, payslip_fileName, payslip_receiveDate,payslip_monthName)
             VALUES (?, ?, ?, ?,?);`,
            {
                replacements: [
                    newDoc.employeeId,
                    newDoc.year,
                    newDoc.fileName,
                    newDoc.uploadedAt,
                    newDoc.month
                ],
                type: sequelize.QueryTypes.INSERT
            }
        );

        return sendResponse(res, httpStatus.OK, newDoc, 'Document uploaded successfully');
    } catch (error) {
        console.error('Error uploading document:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error uploading document', error.message);
    }
};


