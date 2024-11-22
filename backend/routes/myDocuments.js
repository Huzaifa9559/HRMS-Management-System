const express = require('express'); // Import express
const myDocumentsrouter = express.Router(); // Create a router instance

const { getEmployeeMyDocuments, downloadDocument, getDocumentSignature,
    saveDocumentSignature
} =
    require('../controllers/myDocuments');

myDocumentsrouter.get('/', getEmployeeMyDocuments);
myDocumentsrouter.get('/download/:documentId', downloadDocument);
myDocumentsrouter.get('/signature/:documentId', getDocumentSignature);
myDocumentsrouter.post('/save-signature', saveDocumentSignature);
//router.post('/my-documents/upload', upload.single('document'), uploadDocument);

module.exports = myDocumentsrouter; // Export the router