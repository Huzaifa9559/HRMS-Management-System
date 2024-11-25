const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup Multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Set the destination folder for file uploads
        const uploadDir = 'uploads/payslips/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir); // Store files in 'uploads/documents/'
    },
    filename: (req, file, cb) => {
        // Generate a unique filename
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid filename conflicts
    }
});

const upload = multer({ storage: storage });

module.exports = upload;