const myDocuments = require('../models/myDocuments');
const Signatures = require('../models/signatures');
const { getUser } = require('../service/auth');
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');
const { sequelize } = require("../config/sequelizeConfig");
const { extractToken } = require('../utils/authUtil');
const path = require('path');
const fs = require('fs');

exports.getEmployeeMyDocuments = async (req, res) => {
    const token = extractToken(req, res);
    if (!token) return;
    try {
        const payload = getUser(token);
        const documents = await myDocuments.getDocumentsByEmployeeId(payload._id);
        if (!documents || documents.length === 0) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'No documents found for this myDocuments');
        }
        return sendResponse(res, httpStatus.OK, documents, 'Documents retrieved successfully');
    } catch (error) {
        console.error('Error fetching documents:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching documents', error.message);
    }
};


exports.downloadDocument = async (req, res) => {
    const documentId = req.params.documentId;

    // Fetch the document details from the database using the documentId
    try {
        const document = await myDocuments.getDocumentNameById(documentId); // Fetch document details

        if (!document || !document[0].document_fileName) {
            return res.status(404).send('Document not found');
        }

        const documentFileName = document[0].document_fileName;
        const filePath = path.join(__dirname, '../uploads/myDocuments', documentFileName);
        
        // Set the content-disposition header for file download
        res.setHeader('Content-Disposition', `attachment; filename="${documentFileName}"`);

        // Check if the file exists before attempting to send it
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
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'No signature found');
        }
        return sendResponse(res, httpStatus.OK, sign, 'Signature retrieved successfully');
    } catch (error) {
        console.error('Error fetching signature:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching signatures', error.message);
    }
};


exports.uploadDocument = async (req, res) => {
 const { employeeId, title} = req.body;
    const file = req.file;

    // Check if all fields are present
    if (!employeeId || !title  || !file) {
        return sendResponse(res, httpStatus.BAD_REQUEST, null, 'All fields are required');
    }

    try {
        // Create a new document entry in the database
        const newDoc = {
            employeeId: employeeId,
            title: title,
            fileName: file.filename, // Save the original file name
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
                type: sequelize.QueryTypes.INSERT
            }
        );

        return sendResponse(res, httpStatus.OK, newDoc, 'Document uploaded successfully');
    } catch (error) {
        console.error('Error uploading document:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error uploading document', error.message);
    }
};


exports.saveDocumentSignature = async (req, res) => {
    const { documentId, signature } = req.body
    try {
        await Signatures.saveSignature(documentId, signature);
        return sendResponse(res, httpStatus.OK, null, 'signature saved successfully');
    } catch (error) {
        console.error('Error saving signature:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching documents', error.message);
    }
};
