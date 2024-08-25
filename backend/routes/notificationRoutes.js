// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

// Create a new notification
router.post('/', auth, async (req, res) => {
    try {
      const { type, post, event } = req.body;
      
      // Use the authenticated user's ID
      const userId = req.user.id;
  
      const newNotification = new Notification({
        user: userId,
        type,
        post: post || null,
        event: event || null,
        sender: userId, // Assuming the sender is the logged-in user
      });
  
      const notification = await newNotification.save();
      res.json(notification);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

// Get all notifications for a user
router.get('/:userId', auth, async (req, res) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ msg: 'User ID is required' });
      }
      const notifications = await Notification.find({ user: userId })
        .sort({ date: -1 })
        .populate('post')
        .populate('event')
        .populate('sender', 'username profilePicture');
      res.json(notifications);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  

// Mark notifications as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
