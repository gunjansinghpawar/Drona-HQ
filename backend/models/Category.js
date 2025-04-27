// models/category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,  // This will store the image URL after it's uploaded
      required: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
