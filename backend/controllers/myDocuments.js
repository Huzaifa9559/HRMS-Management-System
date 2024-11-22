const myDocuments = require('../models/myDocuments');
const Signatures = require('../models/signatures');
const { getUser } = require('../service/auth');
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');
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
    const document = await myDocuments.getDocumentNameById(documentId); // Fetch document details
    if (!document[0].document_fileName) {
        return res.status(404).send('Document not found');
    }
    const filePath = path.join(__dirname, '../uploads/myDocuments', document[0].document_fileName); // Use the fileName from the document
    res.setHeader('Content-Disposition', `attachment; filename="${document[0].document_fileName}"`);
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

exports.getDocumentSignature = async (req, res) => {
    const token = extractToken(req, res);
    if (!token) return;
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


//implementation through multer -- remaining
exports.uploadDocument = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // You can save the file information to the database here if needed
    res.status(200).send({ message: 'File uploaded successfully', file: req.file });
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
