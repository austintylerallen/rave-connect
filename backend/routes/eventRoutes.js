const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const getSpotifyToken = require('../spotifyAuth');

const router = express.Router();

// Helper function to fetch artist photos from Spotify
const fetchArtistPhotos = async (artistNames, token) => {
  const photos = {};
  for (const name of artistNames) {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/search`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: name,
          type: 'artist',
          limit: 1,
        },
      });
      const artist = response.data.artists.items[0];
      if (artist && artist.images.length > 0) {
        photos[name] = artist.images[0].url;
      }
    } catch (err) {
      console.error(`Error fetching photo for artist ${name}:`, err.message);
    }
  }
  return photos;
};

// Helper function to fetch and save event details from EDMTrain API
const fetchAndSaveEvent = async (edmtrainId) => {
  try {
    const edmTrainResponse = await axios.get(`https://edmtrain.com/api/events`, {
      params: {
        id: edmtrainId,
        client: process.env.EDM_TRAIN_API_KEY,
      },
    });

    if (!edmTrainResponse.data || !edmTrainResponse.data.data || edmTrainResponse.data.data.length === 0) {
      throw new Error('Event not found on EDMTrain');
    }

    const eventData = edmTrainResponse.data.data[0];
    const newEvent = new Event({
      edmtrainId: eventData.id,
      title: eventData.name || eventData.artistList.map(artist => artist.name).join(', '),
      date: eventData.date,
      location: eventData.venue.location,
      latitude: eventData.venue.latitude,
      longitude: eventData.venue.longitude,
      organizer: 'EDMTrain',
    });

    const savedEvent = await newEvent.save();
    return savedEvent;
  } catch (error) {
    throw new Error('Failed to fetch or save event: ' + error.message);
  }
};

// RSVP to an event or create it if it doesn't exist
router.post('/rsvp/:id', auth, async (req, res) => {
  try {
    // Check if the event exists in the database using edmtrainId
    let event = await Event.findOne({ edmtrainId: req.params.id });

    if (!event) {
      console.log('Event not found in DB, fetching from EDMTrain API');
      try {
        event = await fetchAndSaveEvent(req.params.id);
      } catch (apiError) {
        console.error('Failed to fetch or save event:', apiError.message);
        return res.status(500).json({ msg: 'Failed to fetch event from EDMTrain' });
      }
    } else {
      console.log('Event found in DB, adding RSVP');
      const isAttending = event.attendees.some(attendee => attendee.user.toString() === req.user.id);
      if (isAttending) {
        return res.status(400).json({ msg: 'User has already RSVPed to this event' });
      }

      event.attendees.push({ user: req.user.id });
      await event.save();
    }

    res.json({ msg: 'RSVP successful', attendees: event.attendees });
  } catch (err) {
    console.error('Error during RSVP:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
