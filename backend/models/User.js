// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  favoriteGenres: { type: [String] },
  profilePicture: { 
    type: String,
    default: '/profile-photo-placeholder.jpg',
  },
  coverPhoto: { 
    type: String,
    default: '/placeholder-cover-photo.jpg',
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

// Remove the `pre('save')` hook for password hashing
// Since you're already hashing the password in the registration controller
const User = mongoose.model('User', userSchema);
module.exports = User;
