const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to generate a JWT token with profile information
const generateToken = (user) => {
  return jwt.sign(
    {
      user: {
        id: user._id, // Include user ID in the JWT payload
        email: user.email, // Optionally include the email
        username: user.username, // Include the username
        profilePicture: user.profilePicture, // Include the profile picture
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: '5h' } // Token expiration time
  );
};

// Registration
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user object with default profile picture if necessary
    user = new User({
      username,
      email,
      password: hashedPassword, // Save the hashed password
      profilePicture: '/profile-photo-placeholder.jpg', // Default profile picture
    });

    // Save the new user to the database
    await user.save();

    // Generate the token and return it
    const token = generateToken(user);
    res.json({ token }); // Send token to the client
  } catch (err) {
    console.error('Error in registration:', err.message);
    res.status(500).send('Server error');
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if the provided password matches the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate the token and return it with profile information
    const token = generateToken(user);
    res.json({ token }); // Send token to the client
  } catch (err) {
    console.error('Error in login:', err.message);
    res.status(500).send('Server error');
  }
};

// Get user data (requires token)
exports.getUser = async (req, res) => {
  try {
    // Find the user by ID from the JWT token
    const user = await User.findById(req.user.id).select('-password'); // Exclude the password
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user data:', err.message);
    res.status(500).send('Server error');
  }
};
