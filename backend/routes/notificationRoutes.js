const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const io = require('../server').io; // Import the io instance

// Create a new notification
router.post('/', auth, async (req, res) => {
  try {
    const { type, post, event } = req.body;

    const newNotification = new Notification({
      user: req.user.id,
      type,
      post: post || null,
      event: event || null,
      sender: req.user.id,
    });

    const notification = await newNotification.save();

    io.to(req.user.id).emit('notification', notification); // Emit the notification to the user

    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all notifications for a user
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ date: -1 })
      .populate('sender', 'username profilePicture')
      .populate('post')
      .populate('event');
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Mark a notification as read
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
