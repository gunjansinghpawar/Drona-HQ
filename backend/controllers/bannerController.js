// controllers/bannerController.js
const Banner = require('../models/Banner');
const cloudinary = require('../config/cloudinaryConfig');

// Middleware to handle banner image upload to Cloudinary
const uploadBannerToCloudinary = async (req, res, next) => {
  if (req.file) {
    try {
      // Upload the banner image to Cloudinary (using file buffer)
      const uploadResponse = await cloudinary.uploader.upload_stream(
        { folder: 'banners', resource_type: 'image' }, // Upload as an image, organize in 'banners' folder
        (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            return res.status(500).json({ message: 'Failed to upload banner image', error });
          }
          // Add the image URL to the request body
          req.body.imageUrl = result.secure_url; // Store the URL of the uploaded image
          next(); // Proceed to the next middleware
        }
      );

      // Pipe the file buffer to Cloudinary
      uploadResponse.end(req.file.buffer); // Use the buffer since multer stores file in memory

    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return res.status(500).json({ message: 'Failed to upload banner image', error });
    }
  } else {
    next(); // No file provided, continue to the next middleware
  }
};

// Create a new banner
const createBanner = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    // Ensure the image URL is provided
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required.' });
    }

    const newBanner = new Banner({
      imageUrl, // The URL of the image uploaded to Cloudinary
    });

    // Save the banner to the database
    await newBanner.save();
    res.status(201).json({ message: 'Banner created successfully', banner: newBanner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create banner', error });
  }
};

// Get all banners
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch banners', error });
  }
};

// Get a banner by ID
const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.status(200).json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch banner', error });
  }
};

// Delete a banner by ID
// controllers/bannerController.js
const deleteBanner = async (req, res) => {
  try {
    const bannerId = req.params.id; // Assuming the image URL contains an identifier (e.g., public ID)

    // Here, you can use Cloudinary's API to delete the image from Cloudinary if necessary
    await cloudinary.uploader.destroy(bannerId); // Delete from Cloudinary

    // Remove the banner record from your database
    const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
    if (!deletedBanner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.status(200).json({ message: 'Banner deleted successfully', banner: deletedBanner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete banner', error });
  }
};


module.exports = { createBanner, getBanners, getBannerById, deleteBanner, uploadBannerToCloudinary };
