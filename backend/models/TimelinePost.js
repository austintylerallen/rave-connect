const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Comment schema
const CommentSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment', // Self-referencing field for threaded comments
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define the TimelinePost schema
const TimelinePostSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, // URL for any uploaded image
    default: null,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', // Optional event-related data
    default: null,
  },
  eventName: {
    type: String,
    default: null,
  },
  eventImage: {
    type: String, // URL for event-related image
    default: null,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }], // Users who liked the post
  comments: [CommentSchema], // Embedded comments schema
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('TimelinePost', TimelinePostSchema);
