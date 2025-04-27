const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const movieRoutes = require('./routes/movieRoutes');
const connectDB = require('./config/dbConfig');

// Load environment variables at the very top
dotenv.config();

const app = express();

// Correct PORT and MONGO_URI after dotenv
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URL;

const corsOptions = {
  // set origin to a specific origin.
  origin: process.env.FRONTEND_HOST,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// API routes
app.use('/api/user', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/banner', bannerRoutes);
app.use('/api/movie', movieRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connect to MongoDB
connectDB(MONGO_URI);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
