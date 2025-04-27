// models/User.js
const mongoose = require('mongoose');

// User schema definition
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String,enum:['active','pending','inactive'] },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
