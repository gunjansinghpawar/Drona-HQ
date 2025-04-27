// models/Banner.js
const mongoose = require('mongoose');

// Banner schema definition
const bannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now },
});

// Create and export the Banner model
const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner;
