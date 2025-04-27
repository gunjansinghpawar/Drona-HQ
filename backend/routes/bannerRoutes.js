// routes/bannerRoutes.js
const express = require('express');
const { createBanner, getBanners, getBannerById, deleteBanner, uploadBannerToCloudinary } = require('../controllers/bannerController');
const multer = require('multer');
const upload = multer(); // Using in-memory storage for file uploads

const router = express.Router();

// Route to create a new banner (with file upload middleware)
router.post('/', upload.single('image'), uploadBannerToCloudinary, createBanner);

// Route to get all banners
router.get('/', getBanners);

// Route to get a banner by ID
router.get('/:id', getBannerById);

// Route to delete a banner by ID
router.delete('/:id', deleteBanner);

module.exports = router;
