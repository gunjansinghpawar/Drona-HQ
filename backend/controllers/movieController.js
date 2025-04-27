const Movie = require('../models/Movie');
const cloudinary = require('../config/cloudinaryConfig');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('poster');

const uploadPosterToCloudinary = (req, res, next) => {
  if (req.file) {
    cloudinary.uploader.upload_stream(
      { folder: 'movies', resource_type: 'image' },
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Error uploading to Cloudinary', error });
        }
        req.body.poster = result.secure_url; // Set the Cloudinary URL in the request body
        next(); // Proceed to the next middleware or controller
      }
    ).end(req.file.buffer); // Upload the file buffer to Cloudinary
  } else {
    next(); // No file uploaded, proceed without updating the poster
  }
};


const createMovie = async (req, res) => {
  try {
    const { title, youtubeLink, uploadLink, category } = req.body;

    if (!title || !youtubeLink || !uploadLink || !category) {
      return res.status(400).json({ message: 'Title, YouTube Link, Upload Link, and Category are required.' });
    }

    const newMovie = new Movie({
      title,
      youtubeLink,
      uploadLink,
      poster: req.body.poster,
      category,
      status:'active',
  });

  await newMovie.save();
  res.status(201).json({ message: 'Movie created successfully', movie: newMovie });
} catch (error) {
  console.error('Create Movie Error:', error);
  res.status(500).json({ message: 'Failed to create movie', error });
}
};

// Get all movies
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().populate('category'); // Populate category details
    res.status(200).json(movies);
  } catch (error) {
    console.error('Get Movies Error:', error);
    res.status(500).json({ message: 'Failed to fetch movies', error });
  }
};

// Get a movie by ID
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('category'); // Populate category details
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    console.error('Get Movie Error:', error);
    res.status(500).json({ message: 'Failed to fetch movie', error });
  }
};

// Update a movie by ID
const updateMovie = async (req, res) => {
  try {
    const { title, youtubeLink, uploadLink, status, category } = req.body;

    // If a new poster is uploaded, update it
    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload_stream(
        { folder: 'movies', resource_type: 'image' },
        (error, result) => {
          if (error) {
            return res.status(500).json({ message: 'Error uploading to Cloudinary', error });
          }
          req.body.poster = result.secure_url; // Set the Cloudinary URL in the request body
        }
      );
      const stream = cloudinary.uploader.upload_stream(uploadResponse);
      stream.end(req.file.buffer); // Upload the file buffer to Cloudinary
    }

    // Update the movie in the database with status
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title,
        youtubeLink,
        uploadLink,
        poster: req.body.poster,  // Cloudinary poster URL
        status: status || "active",  // Default to "active" if no status is provided
        category, // Update category
        updatedAt: Date.now(),
      },
      { new: true }
    ).populate('category'); // Populate category details

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie updated successfully', movie: updatedMovie });
  } catch (error) {
    console.error('Update Movie Error:', error);
    res.status(500).json({ message: 'Failed to update movie', error });
  }
};


// Delete a movie by ID
const deleteMovie = async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json({ message: 'Movie deleted successfully', movie: deletedMovie });
  } catch (error) {
    console.error('Delete Movie Error:', error);
    res.status(500).json({ message: 'Failed to delete movie', error });
  }
};

module.exports = {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  uploadPosterToCloudinary,
  upload,
};