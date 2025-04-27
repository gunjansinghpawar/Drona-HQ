const Category = require('../models/Category');
const cloudinary = require('../config/cloudinaryConfig'); // Cloudinary configuration
const multer = require('multer');

// Multer setup for file uploads
const storage = multer.memoryStorage(); // Store images in memory before uploading to Cloudinary
const upload = multer({ storage: storage }).single('image'); // Expecting a single 'image' field

// Middleware to handle file upload
const uploadImage = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading file', error: err });
    }
    next();
  });
};

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return res.status(500).json({ message: 'Failed to upload image to Cloudinary', error });
        }

        const imageUrl = result.secure_url;  // Get the image URL from Cloudinary

        // Create the new category
        const newCategory = new Category({
          title,
          image: imageUrl,  // Store the Cloudinary URL
        });

        newCategory.save()
          .then(category => {
            res.status(201).json({
              message: 'Category created successfully',
              category
            });
          })
          .catch(err => {
            console.error('Category Save Error:', err);
            res.status(500).json({ message: 'Failed to create category', error: err });
          });
      }
    );

    // Pipe the image buffer into Cloudinary
    result.end(req.file.buffer); // Send the image buffer directly to Cloudinary
  } catch (error) {
    console.error('General Error:', error);
    res.status(500).json({ message: 'Failed to create category', error });
  }
};


// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error });
  }
};

module.exports = { createCategory, getCategories, uploadImage };
