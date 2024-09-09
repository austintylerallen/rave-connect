// cloudinaryRoutes.js
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const crypto = require('crypto');

// Cloudinary config (set up your credentials)
cloudinary.config({
  cloud_name: 'dnoc047l5',
  api_key: '589989464939994',
  api_secret: 'qjm_6FfM7nB_qRqJy40gHzp7amY', // Use your actual API secret here
});

// Route to generate a signed upload URL
router.post('/get-signature', (req, res) => {
  const timestamp = Math.floor(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    process.env.CLOUDINARY_API_SECRET
  );
  
  res.json({ timestamp, signature });
});

module.exports = router;
