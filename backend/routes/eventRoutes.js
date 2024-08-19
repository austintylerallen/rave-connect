const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');

// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

// Create a new event
router.post('/', auth, async (req, res) => {
  const { title, description, date, location, latitude, longitude } = req.body;

  try {
    const event = new Event({
      title,
      description,
      date,
      location,
      latitude,
      longitude,
      organizer: req.user.id,
    });

    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'username profilePicture');
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'username profilePicture');
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Search events with filtering by location
router.get('/search', async (req, res) => {
  try {
    const { keyword, date, location, genre, latitude, longitude } = req.query;
    const query = {};

    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }
    if (date) {
      query.date = new Date(date);
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }

    let events = await Event.find(query).populate('organizer', 'username profilePicture');

    if (latitude && longitude) {
      events = events.filter(event => {
        const distance = calculateDistance(
          parseFloat(latitude), parseFloat(longitude),
          event.latitude, event.longitude
        );
        return distance <= 50; // Show events within 50 km radius
      });
    }

    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Check in to an event
router.post('/checkin/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    const attendee = event.attendees.find(a => a.user.toString() === req.user.id);
    if (!attendee) {
      return res.status(400).json({ msg: 'User has not RSVP\'d to this event' });
    }

    if (attendee.checkedIn) {
      return res.status(400).json({ msg: 'User already checked in' });
    }

    attendee.checkedIn = true;
    await event.save();

    res.json({ msg: 'Check-in successful', attendees: event.attendees });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
