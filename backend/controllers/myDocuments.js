const myDocuments = require('../models/myDocuments');
const Signatures = require('../models/signatures');
const { getUser } = require('../service/auth');
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');
const { sequelize } = require('../config/sequelizeConfig');
const { extractToken } = require('../utils/authUtil');
const {
  getSignedUrl,
  getFileStream,
  fileExistsInS3,
} = require('../service/s3Service');
const path = require('path');
const fs = require('fs');

exports.getEmployeeMyDocuments = async (req, res) => {
  const token = extractToken(req, res);
  if (!token) return;
  try {
    const payload = getUser(token);
    const documents = await myDocuments.getDocumentsByEmployeeId(payload._id);
    if (!documents || documents.length === 0) {
      return sendResponse(
        res,
        httpStatus.NOT_FOUND,
        null,
        'No documents found for this myDocuments'
      );
    }
    return sendResponse(
      res,
      httpStatus.OK,
      documents,
      'Documents retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching documents:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error fetching documents',
      error.message
    );
  }
};

exports.downloadDocument = async (req, res) => {
  const documentId = req.params.documentId;

  try {
    const document = await myDocuments.getDocumentNameById(documentId);

    if (!document || !document[0].document_fileName) {
      return res.status(404).send('Document not found');
    }

    const documentFileName = document[0].document_fileName;

    // Check if file is stored in S3 (starts with 'documents/')
    if (documentFileName.startsWith('documents/')) {
      // S3 file - generate signed URL
      try {
        const exists = await fileExistsInS3(documentFileName);
        if (!exists) {
          return res.status(404).send('File not found in S3');
        }

        const signedUrl = await getSignedUrl(documentFileName, 3600); // 1 hour expiry
        return res.redirect(signedUrl);
      } catch (error) {
        console.error('Error generating S3 signed URL:', error);
        return res.status(500).send('Error generating download URL');
      }
    } else {
      // Local file - fallback for old files
      const filePath = path.join(
        __dirname,
        '../uploads/myDocuments',
        documentFileName
      );

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${path.basename(documentFileName)}"`
      );

      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          return res.status(404).send('File not found');
        }
        res.download(filePath, (err) => {
          if (err) {
            return res.status(500).send('Error downloading the file');
          }
        });
      });
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    return res.status(500).send('Server error');
  }
};

exports.getDocumentSignature = async (req, res) => {
  const documentId = req.params.documentId;
  try {
    const sign = await myDocuments.getSignatureById(documentId);
    if (!sign || sign.length === 0) {
      return sendResponse(
        res,
        httpStatus.NOT_FOUND,
        null,
        'No signature found'
      );
    }
    return sendResponse(
      res,
      httpStatus.OK,
      sign,
      'Signature retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching signature:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error fetching signatures',
      error.message
    );
  }
};

exports.uploadDocument = async (req, res) => {
  const { employeeId, title } = req.body;
  const file = req.file;

  // Check if all fields are present
  if (!employeeId || !title || !file) {
    return sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      null,
      'All fields are required'
    );
  }

  try {
    // Get file key (S3 key or local filename)
    // For S3: file.key contains the S3 key
    // For local: file.filename contains the local filename
    const fileName = file.key || file.filename;

    // Create a new document entry in the database
    const newDoc = {
      employeeId: employeeId,
      title: title,
      fileName: fileName, // Save S3 key or local filename
      uploadedAt: new Date(),
    };

    await sequelize.query(
      `INSERT INTO Documents
            (employeeID, document_type, document_fileName, document_receiveDate)
             VALUES (?, ?, ?, ?)`,
      {
        replacements: [
          newDoc.employeeId,
          newDoc.title,
          newDoc.fileName,
          newDoc.uploadedAt,
        ],
        type: sequelize.QueryTypes.INSERT,
      }
    );

    return sendResponse(
      res,
      httpStatus.OK,
      newDoc,
      'Document uploaded successfully'
    );
  } catch (error) {
    console.error('Error uploading document:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error uploading document',
      error.message
    );
  }
};

exports.saveDocumentSignature = async (req, res) => {
  const { documentId, signature } = req.body;
  try {
    await Signatures.saveSignature(documentId, signature);
    return sendResponse(
      res,
      httpStatus.OK,
      null,
      'signature saved successfully'
    );
  } catch (error) {
    console.error('Error saving signature:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error fetching documents',
      error.message
    );
  }
};

exports.getAllEmployeesDocuments = async (req, res) => {
  try {
    // Fetch all documents from the database
    const allDocuments = await myDocuments.getAllDocuments();

    if (!allDocuments || allDocuments.length === 0) {
      return sendResponse(
        res,
        httpStatus.NOT_FOUND,
        null,
        'No documents found'
      );
    }

    return sendResponse(
      res,
      httpStatus.OK,
      allDocuments,
      'All documents retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching all documents:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error fetching all documents',
      error.message
    );
  }
};
