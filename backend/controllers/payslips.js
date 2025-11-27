const Payslip = require('../models/payslips'); // Import the myDocuments model
const { getUser } = require('../service/auth'); // Import setUser function
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');
const { extractToken } = require('../utils/authUtil'); // Import the extractToken function
const { getSignedUrl, fileExistsInS3 } = require('../service/s3Service');
const path = require('path');
const fs = require('fs');
const { sequelize } = require('../config/sequelizeConfig');

// Note: No longer needed - URLs are now stored directly in the database

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
    
    // URLs are already stored in database, return directly
    // Also add a payslipUrl field for easier frontend access
    const payslipsWithUrls = payslip.map((p) => {
      if (p.payslip_fileName) {
        p.payslipUrl = p.payslip_fileName;
      }
      return p;
    });
    
    return sendResponse(
      res,
      httpStatus.OK,
      payslipsWithUrls,
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
    if (!payslip[0]?.payslip_fileName) {
      return res.status(404).send('Payslip not found');
    }

    const payslipFileName = payslip[0].payslip_fileName;
    let s3Key = null;

    // Check if it's already a full URL (S3 URL)
    if (payslipFileName.startsWith('http://') || payslipFileName.startsWith('https://')) {
      // Extract S3 key from URL: https://bucket.s3.region.amazonaws.com/payslips/...
      try {
        const urlParts = payslipFileName.split('.amazonaws.com/');
        if (urlParts.length > 1) {
          s3Key = urlParts[1].split('?')[0]; // Remove query params if any
        } else {
          // If we can't parse, try to extract from the path
          const urlObj = new URL(payslipFileName);
          s3Key = urlObj.pathname.substring(1); // Remove leading slash
        }
      } catch (error) {
        console.error('Error parsing S3 URL:', error);
        return res.status(400).send('Invalid file URL');
      }
    } else if (payslipFileName.startsWith('payslips/')) {
      // Old format key
      s3Key = payslipFileName;
    }

    // If we have an S3 key, stream from S3
    if (s3Key) {
      try {
        const exists = await fileExistsInS3(s3Key);
        if (!exists) {
          return res.status(404).send('File not found in S3');
        }

        const { getFileStream } = require('../service/s3Service');
        const fileStream = getFileStream(s3Key);
        
        // Get file extension for content type
        const ext = path.extname(s3Key).toLowerCase();
        const contentTypeMap = {
          '.pdf': 'application/pdf',
          '.doc': 'application/msword',
          '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          '.xls': 'application/vnd.ms-excel',
          '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        };
        const contentType = contentTypeMap[ext] || 'application/octet-stream';

        res.setHeader('Content-Type', contentType);
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${path.basename(s3Key)}"`
        );

        fileStream.pipe(res);
        fileStream.on('error', (error) => {
          console.error('Error streaming file from S3:', error);
          if (!res.headersSent) {
            res.status(500).send('Error downloading the file');
          }
        });
        res.on('close', () => {
          if (fileStream && !fileStream.destroyed) {
            fileStream.destroy();
          }
        });
        return;
      } catch (error) {
        console.error('Error streaming from S3:', error);
        return res.status(500).send('Error downloading the file');
      }
    }

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
    let fileUrl = null;
    if (file.key && file.key.startsWith('payslips/')) {
      // S3 file - generate full URL
      const { getDirectS3Url } = require('../service/s3Service');
      fileUrl = getDirectS3Url(file.key);
    } else {
      // Local file - use filename
      fileUrl = file.filename;
    }

    // Create a new document entry in the database
    const newDoc = {
      employeeId: employeeId,
      year: payslipYear,
      month: payslipMonth,
      fileName: fileUrl, // Save full URL or local filename
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

    // URLs are already stored in database, return directly
    // Also add a payslipUrl field for easier frontend access
    const payslipsWithUrls = payslips.map((payslip) => {
      if (payslip.fileName) {
        payslip.payslipUrl = payslip.fileName;
      }
      return payslip;
    });

    return sendResponse(
      res,
      httpStatus.OK,
      payslipsWithUrls,
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
