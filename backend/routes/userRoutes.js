const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user profile by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err.message);
    res.status(500).send('Server error');
  }
});

// Update user profile
router.put('/:id', auth, async (req, res) => {
  const { bio, favoriteGenres, profilePicture, coverPhoto } = req.body;

  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.bio = bio || user.bio;
    user.favoriteGenres = favoriteGenres || user.favoriteGenres;
    user.profilePicture = profilePicture || user.profilePicture;
    user.coverPhoto = coverPhoto || user.coverPhoto; // Update the cover photo if provided

    await user.save();
    res.json(user);
  } catch (err) {
    console.error('Error updating user profile:', err.message);
    res.status(500).send('Server error');
  }
});

// Follow a user
router.post('/follow/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!user || !currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!user.followers.includes(req.user.id)) {
      user.followers.push(req.user.id);
      currentUser.following.push(req.params.id);
      await user.save();
      await currentUser.save();
      res.json({ msg: `You are now following ${user.username}` });
    } else {
      res.status(400).json({ msg: 'You are already following this user' });
    }
  } catch (err) {
    console.error('Error following user:', err.message);
    res.status(500).send('Server error');
  }
});

// Unfollow a user
router.post('/unfollow/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!user || !currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.followers.includes(req.user.id)) {
      user.followers.pull(req.user.id);
      currentUser.following.pull(req.params.id);
      await user.save();
      await currentUser.save();
      res.json({ msg: `You have unfollowed ${user.username}` });
    } else {
      res.status(400).json({ msg: 'You are not following this user' });
    }
  } catch (err) {
    console.error('Error unfollowing user:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
