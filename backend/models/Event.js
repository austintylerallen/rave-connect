const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  edmtrainId: { type: Number, unique: true }, // Store EDMTrain event ID
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  organizer: { type: String, required: true }, // Or ref to User if applicable
  attendees: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    checkedIn: { type: Boolean, default: false }
  }],
  dateCreated: { type: Date, default: Date.now },
  deleteAt: { 
    type: Date,
    default: function() {
      return new Date(this.date.getTime() + 12 * 60 * 60 * 1000); // 12 hours after the event date
    }
  }
});

// Ensure TTL index is created
eventSchema.index({ deleteAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Event', eventSchema);
