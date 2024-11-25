const express = require('express'); // Import express
const upload = require('../../middlewares/myDocumentsUpload');
const myDocumentsrouter = express.Router(); // Create a router instance

const { getEmployeeMyDocuments, downloadDocument,uploadDocument
} =
    require('../../controllers/myDocuments');

myDocumentsrouter.get('/', getEmployeeMyDocuments);
myDocumentsrouter.get('/download/:documentId', downloadDocument);
myDocumentsrouter.post('/uploadDocument', upload.single('file'),uploadDocument);

//myDocumentsrouter.get('/signature/:documentId', getDocumentSignature);
//myDocumentsrouter.post('/save-signature', saveDocumentSignature);
//router.post('/my-documents/upload', upload.single('document'), uploadDocument);

module.exports = myDocumentsrouter; 