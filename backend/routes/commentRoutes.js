const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');


// Create a comment
// In commentRoutes.js or wherever you're handling the comment routes

router.post('/:postId', auth, async (req, res) => {
  const { text, parentId } = req.body;

  try {
    const userId = req.user.id; // The 'auth' middleware should decode the JWT and attach the user to req

    if (!text) {
      return res.status(400).json({ msg: 'Comment text is required' });
    }

    const newComment = new Comment({
      text,
      user: userId,  // Associate the comment with the logged-in user
      post: req.params.postId,
      parent: parentId || null,
    });

    // Save the new comment
    let savedComment = await newComment.save();

    // Populate the user data on the comment before sending the response
    savedComment = await savedComment.populate('user', 'username profilePicture').execPopulate();

    res.json(savedComment);  // Return the populated comment
  } catch (err) {
    console.error('Error creating comment:', err);
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
