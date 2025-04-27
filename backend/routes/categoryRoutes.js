// routes/categoryRoutes.js
const express = require('express');
const { createCategory, getCategories, uploadImage } = require('../controllers/categoryController');

const router = express.Router();

// Route to create a new category with an image
router.post('/', uploadImage, createCategory);

// Route to get all categories
router.get('/', getCategories);

module.exports = router;
