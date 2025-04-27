// middlewares/upload.js
const multer = require('multer');

// Configure storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Save images to the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Append current timestamp to filename
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

module.exports = upload;
