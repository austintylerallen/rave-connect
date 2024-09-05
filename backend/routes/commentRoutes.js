const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');

// POST a comment or reply
router.post('/:postId', auth, async (req, res) => {
  try {
    const { text, parentId } = req.body;
    const postId = req.params.postId;

    // Create a new comment (or reply)
    const newComment = new Comment({
      text,
      user: req.user.id,
      post: postId,
      parentId: parentId || null, // For replies, parentId should be set
    });

    const comment = await newComment.save();
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET comments for a post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'username profilePicture')
      .sort({ date: 1 });
    
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
