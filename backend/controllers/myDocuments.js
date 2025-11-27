const myDocuments = require('../models/myDocuments');
const Signatures = require('../models/signatures');
const { getUser } = require('../service/auth');
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');
const { sequelize } = require('../config/sequelizeConfig');
const { extractToken } = require('../utils/authUtil');
const { getSignedUrl, fileExistsInS3 } = require('../service/s3Service');
const path = require('path');
const fs = require('fs');

// Note: No longer needed - URLs are now stored directly in the database

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
    
    // Note: getDocumentsByEmployeeId doesn't return document_fileName,
    // so we don't need to convert URLs here. If needed, update the model query.
    
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

    if (!document || !document[0]?.document_fileName) {
      return res.status(404).send('Document not found');
    }

    const documentFileName = document[0].document_fileName;
    let s3Key = null;

    // Check if it's already a full URL (S3 URL)
    if (documentFileName.startsWith('http://') || documentFileName.startsWith('https://')) {
      // Extract S3 key from URL: https://bucket.s3.region.amazonaws.com/documents/...
      try {
        const urlParts = documentFileName.split('.amazonaws.com/');
        if (urlParts.length > 1) {
          s3Key = urlParts[1].split('?')[0]; // Remove query params if any
        } else {
          // If we can't parse, try to extract from the path
          const urlObj = new URL(documentFileName);
          s3Key = urlObj.pathname.substring(1); // Remove leading slash
        }
      } catch (error) {
        console.error('Error parsing S3 URL:', error);
        return res.status(400).send('Invalid file URL');
      }
    } else if (documentFileName.startsWith('documents/')) {
      // Old format key
      s3Key = documentFileName;
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
    let fileUrl = null;
    if (file.key && file.key.startsWith('documents/')) {
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
      title: title,
      fileName: fileUrl, // Save full URL or local filename
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

    // URLs are already stored in database, return directly
    // Also add a documentUrl field for easier frontend access
    const documentsWithUrls = allDocuments.map((document) => {
      if (document.document_fileName) {
        document.documentUrl = document.document_fileName;
      }
      return document;
    });

    return sendResponse(
      res,
      httpStatus.OK,
      documentsWithUrls,
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
