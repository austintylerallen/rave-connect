const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');

// Create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { text, imageUrl, eventImage, eventId, eventName } = req.body;

    if (!text) {
      return res.status(400).json({ msg: 'Text is required' });
    }

    // Log to check req.user.id
    console.log('Creating post for user:', req.user.id);

    const newPost = new Post({
      text,
      user: req.user.id,
      imageUrl: imageUrl || null,
      eventImage: eventImage || null,
      eventName: eventName || null,
      eventId: eventId || null,
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }).populate('user', 'username profilePicture');
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a post
router.put('/:id', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the user is the owner of the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post.text = text;
    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the user deleting the post is the one who created it
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.deleteOne();  // This is the correct method to delete a post document

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the post has already been liked by the user
    const likedIndex = post.likes.findIndex((like) => like.user.toString() === req.user.id);

    if (likedIndex !== -1) {
      // If the post is already liked, unlike it (remove the like)
      post.likes.splice(likedIndex, 1);
    } else {
      // Otherwise, add a like
      post.likes.unshift({ user: req.user.id });
    }

    await post.save();

    return res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
