const express = require('express');
const TimelinePost = require('../models/TimelinePost');
const router = express.Router();

// Route to get all timeline posts
router.get('/timeline-posts', async (req, res) => {
  try {
    // Use `populate` if you want to get the related user details for each post
    const timelinePosts = await TimelinePost.find()
      .populate('user', 'username profilePicture') // Populate user details like username and profile picture
      .sort({ createdAt: -1 });
    res.json(timelinePosts);
  } catch (err) {
    console.error('Error fetching timeline posts:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
