const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Ensure environment variables are loaded
dotenv.config();

// Verify required environment variables
const requiredVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Verify configuration
const config = cloudinary.config();
if (!config.cloud_name || !config.api_key || !config.api_secret) {
  throw new Error('Cloudinary configuration is incomplete');
}

module.exports = cloudinary;