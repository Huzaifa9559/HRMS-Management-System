const express = require('express'); // Import express
const upload = require('../../middlewares/myDocumentsUpload');
const myDocumentsrouter = express.Router(); // Create a router instance

const {getAllEmployeesDocuments, downloadDocument,uploadDocument
} =
    require('../../controllers/myDocuments');

myDocumentsrouter.get('/', getAllEmployeesDocuments);
myDocumentsrouter.get('/download/:documentId', downloadDocument);
myDocumentsrouter.post('/uploadDocument', upload.single('file'),uploadDocument);


module.exports = myDocumentsrouter; 