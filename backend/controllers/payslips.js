const Payslip = require('../models/payslips'); // Import the myDocuments model
const { getUser } = require('../service/auth'); // Import setUser function
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');
const { extractToken } = require('../utils/authUtil'); // Import the extractToken function
const { getSignedUrl, fileExistsInS3 } = require('../service/s3Service');
const path = require('path');
const fs = require('fs');
const { sequelize } = require('../config/sequelizeConfig');

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
    return sendResponse(
      res,
      httpStatus.OK,
      payslip,
      'Payslip details retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching payslip details:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error fetching payslip details',
      error.message
    );
  }
};

exports.downloadPayslip = async (req, res) => {
  const payslipId = req.params.payslipId;

  try {
    const payslip = await Payslip.getPayslipfileNameById(payslipId);
    if (!payslip[0].payslip_fileName) {
      return res.status(404).send('Payslip not found');
    }

    const payslipFileName = payslip[0].payslip_fileName;

    // Check if file is stored in S3 (starts with 'payslips/')
    if (payslipFileName.startsWith('payslips/')) {
      // S3 file - generate signed URL
      try {
        const exists = await fileExistsInS3(payslipFileName);
        if (!exists) {
          return res.status(404).send('File not found in S3');
        }

        const signedUrl = await getSignedUrl(payslipFileName, 3600); // 1 hour expiry
        return res.redirect(signedUrl);
      } catch (error) {
        console.error('Error generating S3 signed URL:', error);
        return res.status(500).send('Error generating download URL');
      }
    } else {
      // Local file - fallback for old files
      const filePath = path.join(
        __dirname,
        '../uploads/payslips',
        payslipFileName
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${path.basename(payslipFileName)}"`
      );

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
    }
  } catch (error) {
    console.error('Error downloading payslip:', error);
    return res.status(500).send('Server error');
  }
};

exports.uploadPayslip = async (req, res) => {
  const { employeeId, payslipYear, payslipMonth } = req.body;
  const file = req.file;

  // Check if all fields are present
  if (!employeeId || !payslipMonth || !file || !payslipYear) {
    return sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      null,
      'All fields are required'
    );
  }

  try {
    // Get file key (S3 key or local filename)
    const fileName = file.key || file.filename;

    // Create a new document entry in the database
    const newDoc = {
      employeeId: employeeId,
      year: payslipYear,
      month: payslipMonth,
      fileName: fileName, // Save S3 key or local filename
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
          newDoc.month,
        ],
        type: sequelize.QueryTypes.INSERT,
      }
    );

    return sendResponse(
      res,
      httpStatus.OK,
      newDoc,
      'Payslip uploaded successfully'
    );
  } catch (error) {
    console.error('Error uploading payslip:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error uploading payslip',
      error.message
    );
  }
};

exports.getAllEmployeesPayslips = async (req, res) => {
  // Get the year from request parameters

  try {
    // Query the database to fetch all payslips for the specified year
    const payslips = await sequelize.query(
      `SELECT
                p.payslipID,
                p.payslip_monthName AS month,
                p.payslip_receiveDate AS receiveDate,
                CONCAT(e.employee_first_name, ' ', e.employee_last_name) AS name,
                p.payslip_fileName AS fileName,
                d.department_name AS department,
                p.payslip_year
            FROM 
                Payslip p
            JOIN 
                Employee e ON p.employeeID = e.employeeID
            JOIN
                Department d ON e.departmentID = d.departmentID
    
            ORDER BY 
                name ASC, p.payslip_monthName ASC;`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!payslips || payslips.length === 0) {
      return sendResponse(res, httpStatus.NOT_FOUND, null, 'No payslips found');
    }

    return sendResponse(
      res,
      httpStatus.OK,
      payslips,
      'All employees payslips retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching all employees payslips:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error fetching all employees payslips',
      error.message
    );
  }
};
