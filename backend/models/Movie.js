// models/Movie.js
const mongoose = require('mongoose');

// Movie schema definition
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  poster: { type: String },
  youtubeLink: { type: String, required: true },
  uploadLink: { type: String, required: true },
  status: { type: String,enum:['active','pending','inactive'] },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create and export the Movie model
const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
