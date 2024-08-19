const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attendees: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    checkedIn: { type: Boolean, default: false }
  }],
  dateCreated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', eventSchema);
