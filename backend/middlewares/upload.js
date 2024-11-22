// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');

// Set up storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Save files to the uploads folder
    },
    filename: (req, file, cb) => {
        // Use the original name or generate a unique name
        cb(null, `${Date.now()}-${file.originalname}`); // Example: 1633036800000-filename.pdf
    }
});

// Create the multer instance
const upload = multer({ storage });

module.exports = upload;