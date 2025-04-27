// routes/movieRoutes.js
const express = require('express');
const { createMovie, getMovies, getMovieById, updateMovie, deleteMovie,upload, uploadPosterToCloudinary } = require('../controllers/movieController');

const router = express.Router();

router.post('/', upload, uploadPosterToCloudinary, createMovie);

router.get('/', getMovies);

router.get('/:id', getMovieById);

router.put('/:id', upload, uploadPosterToCloudinary, updateMovie);

router.delete('/:id', deleteMovie);

module.exports = router;
