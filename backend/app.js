const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bannerRoutes = require('./routes/bannerRoutes');  // Import banner routes
const movieRoutes = require('./routes/movieRoutes');  // Import movie routes
const connectDB = require('./config/dbConfig');  // Import DB connection function

const app = express();
const PORT = process.env.PORT;

// Load environment variables from .env file
dotenv.config();

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Allow requests only from http://localhost:3000
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Define allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Define allowed headers
};

// Middleware
app.use(cors(corsOptions)); // Apply CORS with the specified options
app.use(bodyParser.json()); // Parse JSON request bodies
app.use('/api/user', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/banner', bannerRoutes); // Use banner routes
app.use('/api/movie', movieRoutes);  // Use movie routes

// MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URL;

// Connect to MongoDB
connectDB(MONGO_URI);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
