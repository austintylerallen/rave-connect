const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables

// Cloudinary config (use environment variables for credentials)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route to generate a signed upload URL
router.post('/get-signature', (req, res) => {
  try {
    const timestamp = Math.floor(new Date().getTime() / 1000);
    
    // Generate the signature using Cloudinary API secret
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
      },
      process.env.CLOUDINARY_API_SECRET
    );
    
    // Return the timestamp and signature
    res.json({ timestamp, signature });
  } catch (err) {
    console.error('Error generating Cloudinary signature:', err);
    res.status(500).json({ message: 'Failed to generate Cloudinary signature' });
  }
});

module.exports = router;
